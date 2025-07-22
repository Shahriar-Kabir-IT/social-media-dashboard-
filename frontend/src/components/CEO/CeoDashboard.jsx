import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../Shared/Header';
import Sidebar from '../Shared/Sidebar';
import PostApproval from './PostApproval';
import PostHistory from './PostHistory';
import './CeoDashboard.css';

const CeoDashboard = () => {
  const [activeTab, setActiveTab] = useState('approval');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'ceo') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="ceo-dashboard">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="dashboard-content">
        {!isMobile && <Sidebar role="ceo" activeTab={activeTab} setActiveTab={setActiveTab} />}
        
        <main className="main-content">
          {isMobile && (
            <div className="mobile-tabs">
              <button 
                className={activeTab === 'approval' ? 'active' : ''}
                onClick={() => setActiveTab('approval')}
              >
                Post Approval
              </button>
              <button 
                className={activeTab === 'history' ? 'active' : ''}
                onClick={() => setActiveTab('history')}
              >
                Post History
              </button>
            </div>
          )}
          
          {activeTab === 'approval' ? <PostApproval /> : <PostHistory />}
        </main>
      </div>
    </div>
  );
};

export default CeoDashboard;