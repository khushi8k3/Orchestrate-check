import React, { createContext, useState } from 'react';
import { fetchTasks } from '../services/api';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasksData = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks: fetchTasksData }}>
      {children}
    </TaskContext.Provider>
  );
};

