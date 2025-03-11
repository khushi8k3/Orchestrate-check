// frontend/src/components/EventForm.js

import React, { useState } from 'react';
import axios from 'axios';

function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [tasks, setTasks] = useState([
    { title: '', assignedTo: '' } // initially one empty task
  ]);

  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const newTasks = [...tasks];
    newTasks[index][name] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { title: '', assignedTo: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare event data; note that assignedTo should be a valid user ID from your database.
    const eventData = {
      title,
      description,
      date,
      tasks
    };

    try {
      const response = await axios.post('http://localhost:5000/api/events', eventData);
      alert(response.data.message);
      // Optionally, clear form or update UI based on response.
    } catch (error) {
      console.error(error);
      alert('Error creating event');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Event</h2>
      <div>
        <label>Title: </label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description: </label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Date: </label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div>
        <h3>Tasks</h3>
        {tasks.map((task, index) => (
          <div key={index}>
            <label>Task Title: </label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={e => handleTaskChange(index, e)}
              required
            />
            <label>Assigned To (User Email): </label>
            <input
              type="text"
              name="assignedTo"
              value={task.assignedTo}
              onChange={e => handleTaskChange(index, e)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addTask}>Add Task</button>
      </div>
      <button type="submit">Create Event</button>
    </form>
  );
}

export default EventForm;
