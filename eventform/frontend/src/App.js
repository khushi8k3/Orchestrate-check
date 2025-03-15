import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [budget, setBudget] = useState("");
  const [eventType, setEventType] = useState("Firm-wide");
  const [ticketPrice, setTicketPrice] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [rsvpPeople, setRsvpPeople] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([{ name: "", deadline: "", budget: "", assignedTo: "" }]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/employees")
      .then(response => setEmployees(response.data)) // Add this line to update state
      .catch(() => alert("Failed to load employees"));
  }, []);
  

  const addTask = () => {
    setTasks([...tasks, { name: "", deadline: "", budget: "", assignedTo: "" }]);
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async () => {
    if (!eventName || !eventDate || !budget) {
      alert("Event Name, Date, and Budget are required!");
      return;
    }
    if (tasks.length === 0) {
      alert("At least one task is required");
      return;
    }

    const totalTaskBudget = tasks.reduce((sum, task) => sum + Number(task.budget || 0), 0);
    if (totalTaskBudget > Number(budget)) {
      alert("Total task budget exceeds the event budget!");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/events", {
        name: eventName,
        date: eventDate,
        budget: Number(budget),
        eventType,
        ticketPrice: Number(ticketPrice) || 0,
        maxPeople: Number(maxPeople) || 0,
        rsvpPeople,
        tasks,
      });
      alert("Event Created Successfully!");
    } catch (err) {
      alert("Error creating event");
    }
  };

  return (
    <div className="container">
      <h2>Create Event</h2>
      
      <label>Event Name:</label>
      <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />

      <label>Event Date:</label>
      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />

      <label>Budget (in Rs):</label>
      <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />

      <label>Event Type:</label>
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="Firm-wide">Firm-wide</option>
        <option value="Team-specific">Team-specific</option>
        <option value="Limited">Limited Entry (Payment-Based)</option>
      </select>

      {eventType === "Limited" && (
        <>
          <label>Ticket Price:</label>
          <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} />

          <label>Max People Allowed:</label>
          <input type="number" value={maxPeople} onChange={(e) => setMaxPeople(e.target.value)} />
        </>
      )}

      <h3>RSVP People</h3>
      <select multiple value={rsvpPeople} onChange={(e) => setRsvpPeople([...e.target.selectedOptions].map(o => o.value))}>
        {employees.map(emp => <option key={emp.email} value={emp.email}>{emp.email}</option>)}
      </select>

      <h3>Tasks</h3>
      {tasks.map((task, index) => (
        <div key={index} className="task-container">
          <input type="text" placeholder="Task Name" value={task.name} onChange={(e) => handleTaskChange(index, "name", e.target.value)} />
          <input type="date" value={task.deadline} onChange={(e) => handleTaskChange(index, "deadline", e.target.value)} />
          <input type="number" placeholder="Task Budget" value={task.budget} onChange={(e) => handleTaskChange(index, "budget", e.target.value)} />
          <select value={task.assignedTo} onChange={(e) => handleTaskChange(index, "assignedTo", e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(emp => <option key={emp.email} value={emp.email}>{emp.email}</option>)}
          </select>
        </div>
      ))}
      <button onClick={addTask}>Add Task</button>
      <button onClick={handleSubmit}>Submit Event</button>
      <Link to="/">Back</Link>
    </div>
  );
};

export default EventForm;
