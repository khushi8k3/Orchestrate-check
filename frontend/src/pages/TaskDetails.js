import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TaskDetails.css'; 

const TaskDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { task } = location.state || {};

  if (!task) {
    return <div>No task found</div>;
  }

  return (
    <div className="task-details">
      <h1>{task.title}</h1>
      <p><strong>Event:</strong> {task.eventName}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Assigned To:</strong> {task.assignee.name} ({task.assignee.email})</p>
      <p><strong>Assigned By:</strong> {task.assigner.name} ({task.assigner.email})</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Progress:</strong> {task.progress}</p>
      <button onClick={() => navigate('/')}>Back to Dashboard</button>
    </div>
  );
};

export default TaskDetails;
