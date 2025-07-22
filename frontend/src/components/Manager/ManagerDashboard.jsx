import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../Shared/Header';
import Sidebar from '../Shared/Sidebar';
import CreatePost from './CreatePost';
import PostList from './PostList';
import Notification from './Notification';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
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
    if (!user || user.role !== 'manager') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications = [
      { id: 1, message: 'Your post was approved by CEO', read: false, timestamp: new Date() },
      { id: 2, message: 'Your post was rejected by CEO', read: false, timestamp: new Date(Date.now() - 3600000) },
      { id: 3, message: 'New comment on your post', read: true, timestamp: new Date(Date.now() - 86400000) },
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(notifications.filter(n => !n.read && n.id !== id).length);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="manager-dashboard">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        unreadCount={unreadCount}
        onNotificationClick={() => setShowNotifications(!showNotifications)}
      />
      
      <div className="dashboard-content">
        {!isMobile && (
          <Sidebar 
            role="manager" 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            unreadCount={unreadCount}
            onNotificationClick={() => setShowNotifications(!showNotifications)}
          />
        )}
        
        <main className="main-content">
          {isMobile && (
            <div className="mobile-tabs">
              <button 
                className={activeTab === 'create' ? 'active' : ''}
                onClick={() => setActiveTab('create')}
              >
                Create Post
              </button>
              <button 
                className={activeTab === 'posts' ? 'active' : ''}
                onClick={() => setActiveTab('posts')}
              >
                My Posts
              </button>
              <button 
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>
            </div>
          )}
          
          {showNotifications ? (
            <Notification 
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onClose={() => setShowNotifications(false)}
            />
          ) : (
            activeTab === 'create' ? <CreatePost /> : <PostList />
          )}
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;