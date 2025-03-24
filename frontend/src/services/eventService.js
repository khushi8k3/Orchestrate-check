import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

export const getAllEvents = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createEvent = async (event) => {
  const res = await axios.post(API_URL, event);
  return res.data;
};

export const deleteEvent = async (eventId) => {
  await axios.delete(`${API_URL}/${eventId}`);
};

export const getEmployeeEvents = async (email) => {
  const res = await axios.get(`${API_URL}/employee/${email}`);
  return res.data;
};
