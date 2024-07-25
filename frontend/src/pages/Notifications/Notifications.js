import React, { useState, useEffect } from 'react';
import { supabase } from '../../components/supabaseClient';
import './Notifications.css';
import Sidebar from '../../components/Sidebar';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      setNotifications(data);
    }
  };

  const markAsRead = async (id) => {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) {
      console.error('Error marking as read:', error);
    } else {
      fetchNotifications();
    }
  };

  const deleteNotification = async (id) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) {
      console.error('Error deleting notification:', error);
    } else {
      fetchNotifications();
    }
  };

  const filteredNotifications = notifications.filter(notification =>
    filter === 'all' || (filter === 'read' && notification.read) || (filter === 'unread' && !notification.read)
  );

  return (
    <div className="notifications-page">
      <Sidebar />
      <div className="notifications-content">
        <h2>Your Notifications</h2>
        <div className="notification-filter">
          <button 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'active' : ''}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('read')} 
            className={filter === 'read' ? 'active' : ''}
          >
            Read
          </button>
          <button 
            onClick={() => setFilter('unread')} 
            className={filter === 'unread' ? 'active' : ''}
          >
            Unread
          </button>
        </div>
        {filteredNotifications.length > 0 ? (
          <ul className="notifications-list">
            {filteredNotifications.map(notification => (
              <li key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                <p>{notification.message}</p>
                <div className="notification-actions">
                  {!notification.read && <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>}
                  <button onClick={() => deleteNotification(notification.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications found</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;