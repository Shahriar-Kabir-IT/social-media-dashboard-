import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Auth check that only runs once
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          return;
        }

        const { data } = await api.get('/auth/check');
        setUser(data.data);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    if (!initialCheckDone) {
      checkAuth();
    }
  }, [initialCheckDone]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role
      });
      
      localStorage.setItem('token', data.token);
      setUser(data.data);
      return true; // Return success status
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {initialCheckDone && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);