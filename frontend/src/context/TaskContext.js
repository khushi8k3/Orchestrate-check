import React, { createContext, useState, useEffect } from 'react';
import { fetchTasks, fetchTaskById } from '../services/taskService';

export const TaskContext = createContext();

export const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch all tasks
  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch task details by ID
  const getTaskById = async (id) => {
    try {
      const task = await fetchTaskById(id);
      return task;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, loading, error, loadTasks, getTaskById }}>
      {children}
    </TaskContext.Provider>
  );
};
