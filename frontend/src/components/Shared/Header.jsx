import React from 'react';
import './Shared.css';

const Header = ({ user, onLogout, unreadCount, onNotificationClick }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Social Media Dashboard</h1>
        
        <div className="header-actions">
          {unreadCount !== undefined && (
            <button 
              className="notification-icon"
              onClick={onNotificationClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
          )}
          
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role === 'ceo' ? 'CEO' : 'Manager'}</span>
          </div>
          
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;