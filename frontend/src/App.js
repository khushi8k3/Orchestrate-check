import React from 'react';
import EventFeed from './components/EventFeed';
import './App.css';

const loggedInUser = { name: 'John Doe', team: 'IT' };

function App() {
  return (
    <div className="App">
      <h1>📅 Event Feed</h1>
      <EventFeed loggedInUser={loggedInUser} />
    </div>
  );
}

export default App;
