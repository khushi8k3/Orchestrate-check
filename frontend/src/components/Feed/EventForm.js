import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/EventForm.css";

function EventForm() {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [eventType, setEventType] = useState("firm-wide");
  const [availableSlots, setAvailableSlots] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [team, setTeam] = useState("");
  const [tasks, setTasks] = useState([{ taskName: "", description: "", assignee: "", deadline: "", budget: "" }]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate number fields
  const validateNumber = (value) => /^[0-9]*$/.test(value);

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { taskName: "", description: "", assignee: "", deadline: "", budget: "" }]);
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const validateDeadlines = () => {
    const eventDeadline = new Date(date);
    for (const task of tasks) {
      if (task.deadline) {
        const taskDeadline = new Date(task.deadline);
        if (taskDeadline >= eventDeadline) {
          alert(`Task deadline for "${task.taskName}" must be before the event date.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDeadlines()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication error. Please log in again.");
      navigate("/login");
      return;
    }

    const formattedTasks = tasks.map(task => ({
      taskName: task.taskName,
      description: task.description,
      assignee: task.assignee,
      deadline: task.deadline,
      budget: task.budget ? Number(task.budget) : 0,
    }));

    const newEvent = {
      eventName,
      description,
      venue,
      date,
      eventType,
      availableSlots: eventType === "limited-entry" ? Number(availableSlots) : null,
      ticketPrice: eventType === "limited-entry" ? Number(ticketPrice) : null,
      team: eventType === "team-specific" ? team : "",
      tasks: formattedTasks,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events",
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Event created successfully!");
      console.log("Event Response:", response.data);
      navigate("/feed");
    } catch (error) {
      console.error("Error creating event:", error);
      const errorMessage = error.response?.data?.error || error.message;
      setErrors({ message: errorMessage });
      alert(`Error creating event: ${errorMessage}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Event</h2>
      {errors.message && <p className="error-message">Error: {errors.message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name</label>
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Venue</label>
          <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Event Type</label>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option value="firm-wide">Firm-Wide</option>
            <option value="limited-entry">Limited Entry</option>
            <option value="team-specific">Team-Specific</option>
          </select>
        </div>

        {eventType === "limited-entry" && (
          <>
            <div className="form-group">
              <label>Available Slots</label>
              <input
                type="number"
                value={availableSlots}
                onChange={(e) => {
                  if (validateNumber(e.target.value)) {
                    setAvailableSlots(e.target.value);
                  } else {
                    alert("Please enter a valid number for Available Slots.");
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label>Ticket Price</label>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => {
                  if (validateNumber(e.target.value)) {
                    setTicketPrice(e.target.value);
                  } else {
                    alert("Please enter a valid number for Ticket Price.");
                  }
                }}
              />
            </div>
          </>
        )}

        {eventType === "team-specific" && (
          <div className="form-group">
            <label>Team</label>
            <input type="text" value={team} onChange={(e) => setTeam(e.target.value)} required />
          </div>
        )}

        {/* Tasks Section */}
        <h3>Tasks</h3>
        {tasks.map((task, index) => (
          <div key={index} className="task-container">
            <input
              type="text"
              placeholder="Task Name"
              value={task.taskName}
              onChange={(e) => handleTaskChange(index, "taskName", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={task.description}
              onChange={(e) => handleTaskChange(index, "description", e.target.value)}
            />
            <input
              type="email"
              placeholder="Assigned To (Email)"
              value={task.assignee}
              onChange={(e) => handleTaskChange(index, "assignee", e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Task Deadline"
              value={task.deadline}
              onChange={(e) => handleTaskChange(index, "deadline", e.target.value)}
            />
            <input
              type="number"
              placeholder="Budget"
              value={task.budget}
              onChange={(e) => handleTaskChange(index, "budget", e.target.value)}
            />
            <button type="button" onClick={() => removeTask(index)}>Remove Task</button>
          </div>
        ))}
        <button type="button" onClick={addTask}>Add Task</button>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventForm;
