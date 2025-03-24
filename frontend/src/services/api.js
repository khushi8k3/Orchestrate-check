import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';  // Backend URL

export const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};
