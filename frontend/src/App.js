import React, { useState } from 'react';
import DetailedEventReport from './components/DetailedEventReport';
import ComprehensiveReport from './components/ComprehensiveReport';
import './App.css';

const App = () => {
  const [view, setView] = useState('detailed'); // 'detailed' or 'comprehensive'

  return (
    <div className="app-container">
      <h1>Event Reports Dashboard</h1>
      <div className="toggle-buttons">
        <button onClick={() => setView('detailed')} className={view === 'detailed' ? 'active' : ''}>Detailed Report</button>
        <button onClick={() => setView('comprehensive')} className={view === 'comprehensive' ? 'active' : ''}>Comprehensive Report</button>
      </div>
      {view === 'detailed' ? <DetailedEventReport /> : <ComprehensiveReport />}
    </div>
  );
};

export default App;
