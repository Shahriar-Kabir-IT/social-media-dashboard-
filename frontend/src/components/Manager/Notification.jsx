import React from 'react';
import './ManagerDashboard.css';

const Notification = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }) => {
  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications</h3>
        <div className="notification-actions">
          <button onClick={onMarkAllAsRead}>Mark All as Read</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
            >
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">
                {new Date(notification.timestamp).toLocaleString()}
              </div>
              {!notification.read && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;