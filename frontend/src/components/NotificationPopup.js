import React from "react";
import "./NotificationPopup.css";

const NotificationPopup = ({ onClose, tasks, events, notifications }) => {
  return (
    <div className="notification-popup">
      <div className="notification-header">
        <h3>Welcome back!</h3>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
      <div className="notification-body">
        {tasks.length > 0 || events.length > 0 ? (
          <>
            <p>Today you have:</p>
            {events.length > 0 && (
              <div>
                <h4>Events:</h4>
                <ul>
                  {events.map((event) => (
                    <li key={event.id}>{event.title}</li>
                  ))}
                </ul>
              </div>
            )}
            {tasks.length > 0 && (
              <div>
                <h4>Tasks:</h4>
                <ul>
                  {tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p>No tasks or events for today!</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
