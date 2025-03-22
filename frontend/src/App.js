import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TaskContextProvider } from './context/TaskContext';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';


const App = () => {
  return (
    <TaskContextProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
          </Routes>
        </div>
      </Router>
    </TaskContextProvider>
  );
};

export default App;

