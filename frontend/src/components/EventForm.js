import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./EventForm.css"; // Import the CSS file for styling

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState(""); // Optional event date
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [availableSlots, setAvailableSlots] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [eventType, setEventType] = useState("firm-wide");
  const [team, setTeam] = useState(""); // New state for team-specific events
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([
    { taskName: "", deadline: "", budget: "", assignedToEmail: "", description: "" }
  ]);

  useEffect(() => {
    axios.get("http://localhost:5000/employees")
      .then(response => setEmployees(response.data))
      .catch(() => alert("Failed to load employees"));
  }, []);

  const addTask = () => {
    setTasks([...tasks, { taskName: "", deadline: "", budget: "", assignedToEmail: "", description: "" }]);
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  return (
    <div className="form-container">
      <h2>Create Event</h2>
      
      <div className="form-group">
        <label>Event Name:</label>
        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Event Date (Optional):</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Venue (Optional):</label>
        <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Event Type:</label>
        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="firm-wide">Firm-wide</option>
          <option value="team-specific">Team-specific</option>
          <option value="limited">Limited</option>
        </select>
      </div>

      {eventType.toLowerCase() === "limited" && (
        <>
          <div className="form-group">
            <label>Available Slots:</label>
            <input type="number" value={availableSlots} onChange={(e) => setAvailableSlots(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Ticket Price:</label>
            <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} />
          </div>
        </>
      )}

      {eventType.toLowerCase() === "team-specific" && (
        <div className="form-group">
          <label>Team:</label>
          <input type="text" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Enter specific team" />
        </div>
      )}

      <h3>Tasks</h3>
      {tasks.map((task, index) => (
        <div key={index} className="task-container">
          <input type="text" placeholder="Task Name" value={task.taskName} onChange={(e) => handleTaskChange(index, "taskName", e.target.value)} />
          <input type="date" placeholder="Deadline (Optional)" value={task.deadline} onChange={(e) => handleTaskChange(index, "deadline", e.target.value)} />
          <input type="number" placeholder="Task Budget (Optional)" value={task.budget} onChange={(e) => handleTaskChange(index, "budget", e.target.value)} />
          <input type="text" placeholder="Task Description" value={task.description} onChange={(e) => handleTaskChange(index, "description", e.target.value)} />
          <select value={task.assignedToEmail} onChange={(e) => handleTaskChange(index, "assignedToEmail", e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(emp => <option key={emp.email} value={emp.email}>{emp.email}</option>)}
          </select>
        </div>
      ))}
      
      <div className="button-group">
        <button onClick={addTask} className="add-task">Add Task</button>
        <button className="submit-event">Submit Event</button>
      </div>

      <Link to="/" className="back-link">Back</Link>
    </div>
  );
};

export default EventForm;