// Dashboard_Assignee.js
import React, { useContext, useEffect} from 'react';
import { TaskContext } from './TaskContext_Assignee';
import TaskCard from './TaskCard_Assignee';
import socket from '../../utils/socket';
import '../../styles/Dashboard_Assignee.css'; 

const DashboardAssignee = () => {
  const { tasks, fetchTasks } = useContext(TaskContext);

  useEffect(() => {
    fetchTasks();

    const handleTaskUpdate = (updatedTask) => {
      console.log('Task updated in real-time:', updatedTask);
      fetchTasks();
    };

    socket.on('taskUpdated', handleTaskUpdate);

    return () => {
      socket.off('taskUpdated', handleTaskUpdate);
    };
  }, [fetchTasks]);

  return (
    <div className="dashboard">
      <h1>Your Assigned Tasks</h1>
      <div className="task-list">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map(task => <TaskCard key={task._id} task={task} />)
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default DashboardAssignee;