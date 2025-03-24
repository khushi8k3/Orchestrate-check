import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/TaskCard.css';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  return (
    <div className="task-card" onClick={() => navigate(`/tasks/${task._id}`)}>
      <h3>{task.title}</h3>
      <p><strong>Event:</strong> {task.eventName}</p>
      <p><strong>Assignee:</strong> {task.assignee.name}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Progress:</strong> {task.progress}</p>
      <button onClick={() => navigate(`/tasks/${task._id}`)}>View Details</button>
    </div>
  );
};

export default TaskCard;
