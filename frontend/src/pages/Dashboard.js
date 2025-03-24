import React, { useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import './Dashboard.css'; 

const Dashboard = () => {
  const { tasks, fetchTasks } = useContext(TaskContext);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); 

  return (
    <div className="dashboard">
      <h1>Assigned Tasks</h1>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

