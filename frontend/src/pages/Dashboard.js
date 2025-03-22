import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import './Dashboard.css';

const Dashboard = () => {
  const { tasks, loading, error } = useContext(TaskContext);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  // ✅ Filter tasks by name, status, and event
  const filteredTasks = tasks.filter(task => 
    task.assignee.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter ? task.status === statusFilter : true) &&
    (eventFilter ? task.eventName === eventFilter : true)
  );

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="">All Events</option>
          {Array.from(new Set(tasks.map(task => task.eventName))).map(event => (
            <option key={event} value={event}>{event}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
