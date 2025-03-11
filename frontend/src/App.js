// frontend/src/App.js

import React, { useState } from 'react';
import EventForm from './components/EventForm';
import NotificationList from './components/NotificationList';

function App() {
  // This state could be used to store notifications fetched from backend later
  const [notifications] = useState([]);

  return (
    <div className="App">
      <h1>Event Management System</h1>
      <EventForm />
      <NotificationList notifications={notifications} />
    </div>
  );
}

export default App;
