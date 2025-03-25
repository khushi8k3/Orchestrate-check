// context/TaskContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchTasks, fetchTaskById } from './taskService';

export const TaskContext = createContext();

export const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
      console.log("Fetched tasks successfully:", data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed since fetchTasks is a fixed function

  //  Monitor tasks for changes
  useEffect(() => {
    console.log("Tasks updated:", tasks);
  }, [tasks])

  // Fetch task details by ID
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
  }, [loadTasks]);

  return (
    <TaskContext.Provider value={{ tasks, loading, error, loadTasks, getTaskById }}>
      {children}
    </TaskContext.Provider>
  );
};
