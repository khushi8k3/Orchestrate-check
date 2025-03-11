// frontend/src/components/NotificationList.js

import React from 'react';

function NotificationList({ notifications }) {
  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>
              {notif.message} - {new Date(notif.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationList;
