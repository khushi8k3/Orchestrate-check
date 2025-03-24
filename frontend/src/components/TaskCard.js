import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskCard.css';  // ✅ Import the CSS

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/task/${task._id}`, { state: { task } });
  };

  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p><strong>Event:</strong> {task.eventName}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Progress:</strong> {task.progress}</p>
      <button onClick={handleViewDetails}>View Details</button>
    </div>
  );
};

export default TaskCard;
