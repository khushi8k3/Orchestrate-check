import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Keep the CSS import for styling
import App from './App';
import reportWebVitals from './reportWebVitals'; // Keep the reportWebVitals import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Log performance metrics
reportWebVitals(console.log);
