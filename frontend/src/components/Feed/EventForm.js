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
    const [availableSlotsError, setAvailableSlotsError] = useState("");
    const [ticketPriceError, setTicketPriceError] = useState("");
    const [deadlineError, setDeadlineError] = useState("");
    const [tasks, setTasks] = useState([{ taskName: "", description: "", assignedToEmail: "", deadline: "", budget: "" }]);
    const navigate = useNavigate();

    const handleTaskChange = (index, field, value) => {
        const newTasks = [...tasks];
        newTasks[index][field] = value;
        setTasks(newTasks);
    };

    const validateNumber = (value) => {
        return /^[0-9]*$/.test(value);
    };
    
    const validateDate = (value) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
    };
    

    const addTask = () => {
        setTasks([...tasks, { taskName: "", description: "", assignedToEmail: "", deadline: "", budget: "" }]);
    };

    const removeTask = (index) => {
        const newTasks = [...tasks];
        newTasks.splice(index, 1);
        setTasks(newTasks);
    };

    const validateDeadlines = () => {
        const eventDeadline = new Date(date);
        for (let task of tasks) {
            if (task.deadline) {
                const taskDeadline = new Date(task.deadline);
                if (taskDeadline >= eventDeadline) {
                    alert(`Task deadline for "${task.taskName}" must be before the event deadline.`);
                    return false;
                }
            }
        }
        return true;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateDeadlines()) {
            return;
        }

        try {
            const newEvent = {
                eventName,
                description,
                venue,
                date,
                eventType,
                availableSlots: eventType === "limited-entry" ? Number(availableSlots) : null,
                ticketPrice: eventType === "limited-entry" ? Number(ticketPrice) : null,
                team: eventType === "team-specific" ? team : "",
                tasks,
            };

            await axios.post("http://localhost:5000/api/events", newEvent);
            alert("Event created successfully!");
            navigate("/feed");
        } catch (error) {
            alert("Error creating event: " + error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Event Name</label>
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Venue</label>
                    <input
                        type="text"
                        placeholder="Venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
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
                                placeholder="Available Slots"
                                value={availableSlots}
                                onChange={(e) => {
                                    if (validateNumber(e.target.value)) {
                                        setAvailableSlots(e.target.value);
                                        setAvailableSlotsError("");
                                    } else {
                                        setAvailableSlotsError("What you have entered is not a number.");
                                    }
                                }}
                                style={{ borderColor: availableSlotsError ? "red" : "" }}
                            />
                            {availableSlotsError && (
                                <p className="error-message">{availableSlotsError}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Ticket Price (optional)</label>
                            <input
                                type="number"
                                placeholder="Ticket Price"
                                value={ticketPrice}
                                onChange={(e) => {
                                    if (validateNumber(e.target.value)) {
                                        setTicketPrice(e.target.value);
                                        setTicketPriceError("");
                                    } else {
                                        setTicketPriceError("What you have entered is not a number.");
                                    }
                                }}
                                style={{ borderColor: ticketPriceError ? "red" : "" }}
                            />
                            {ticketPriceError && (
                                <p className="error-message">{ticketPriceError}</p>
                            )}
                        </div>
                    </>
                )}

                {eventType === "team-specific" && (
                    <div className="form-group">
                        <label>Team</label>
                        <input
                            type="text"
                            placeholder="Team"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            required
                        />
                    </div>
                )}
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
                            value={task.assignedToEmail}
                            onChange={(e) => handleTaskChange(index, "assignedToEmail", e.target.value)}
                            required
                        />
                        <div className="optional-fields">
                        <input
                                type="date"
                                placeholder="Task Deadline"
                                value={task.deadline}
                                onChange={(e) => {
                                    if (validateDate(e.target.value)) {
                                        handleTaskChange(index, "deadline", e.target.value);
                                        setDeadlineError("");
                                    } else {
                                        setDeadlineError("What you have entered is not a date.");
                                    }
                                }}
                                style={{ borderColor: deadlineError ? "red" : "" }}
                            />
                            {deadlineError && (
                                <p className="error-message">{deadlineError}</p>
                            )}
                            <input
                                type="number"
                                placeholder="Budget"
                                value={task.budget}
                                onChange={(e) => handleTaskChange(index, "budget", e.target.value)}
                            />
                        </div>
                        <button type="button" onClick={() => removeTask(index)}>Remove Task</button>
                    </div>
                ))}
                <div className="button-group">
                    <button type="button" className="add-task" onClick={addTask}>Add Task</button>
                    <button type="submit" className="submit-event">Create Event</button>
                </div>
            </form>
        </div>
    );
}

export default EventForm;
