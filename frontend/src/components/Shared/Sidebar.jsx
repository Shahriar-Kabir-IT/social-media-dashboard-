import React from 'react';
import './Shared.css';

const Sidebar = ({ role, activeTab, setActiveTab, unreadCount, onNotificationClick }) => {
  const tabs = role === 'ceo' 
    ? [
        { id: 'approval', label: 'Post Approval', icon: 'check' },
        { id: 'history', label: 'Post History', icon: 'history' }
      ]
    : [
        { id: 'create', label: 'Create Post', icon: 'create' },
        { id: 'posts', label: 'My Posts', icon: 'list' }
      ];

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        <ul>
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="material-icons">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            </li>
          ))}
          
          {role === 'manager' && (
            <li>
              <button 
                className="nav-item notification-item"
                onClick={onNotificationClick}
              >
                <span className="material-icons">notifications</span>
                <span className="nav-label">Notifications</span>
                {unreadCount > 0 && <span className="sidebar-badge">{unreadCount}</span>}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;