import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import CeoDashboard from './components/CEO/CeoDashboard';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import PrivateRoute from './components/Shared/PrivateRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/ceo-dashboard" element={
              <PrivateRoute role="ceo">
                <CeoDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/manager-dashboard" element={
              <PrivateRoute role="manager">
                <ManagerDashboard />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;