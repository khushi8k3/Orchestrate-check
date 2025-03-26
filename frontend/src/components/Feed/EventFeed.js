import React, { useState, useEffect } from "react";
import RazorpayButton from "./RazorpayButton";
import "../../styles/EventFeed.css";
import NotificationPanel from "./NotificationPanel";

function EventFeed({ loggedInUser }) {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [starredEvents, setStarredEvents] = useState(new Set());
  const [filter, setFilter] = useState("All Events");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedEventType, setSelectedEventType] = useState("All Types");

  useEffect(() => {
    if (!loggedInUser?.email) return;

    const fetchEventsAndTasks = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user) return;

      try {
        // Fetch Events
        const eventRes = await fetch("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Email": user.email,
          },
        });

        if (!eventRes.ok) throw new Error("Failed to fetch events");
        const eventData = await eventRes.json();
        console.log("Fetched Events:", eventData); // Debugging

        // Fetch Tasks
        const taskRes = await fetch("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Email": user.email,
          },
        });

        if (!taskRes.ok) throw new Error("Failed to fetch tasks");
        const taskData = await taskRes.json();
        console.log("Fetched Tasks:", taskData); // Debugging

        setEvents(eventData);
        setTasks(taskData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEventsAndTasks();
  }, [loggedInUser?.email]);

  const toggleStar = (eventId) => {
    const newStars = new Set(starredEvents);
    newStars.has(eventId) ? newStars.delete(eventId) : newStars.add(eventId);
    setStarredEvents(newStars);
  };

  // Ensure event ID matches task eventID (convert both to strings)
  const isEventCompleted = (eventId) => {
    const eventTasks = tasks.filter((task) => task.eventID?.toString() === eventId?.toString());
    return eventTasks.length > 0 && eventTasks.every((task) => task.status === "Completed");
  };

  const filteredEvents = events
    .filter((event) => isEventCompleted(event._id)) // Only show completed events
    .filter((event) => {
      const isStarred = starredEvents.has(event._id);
      if (filter === "RSVP'd") {
        return event.attendees.includes(loggedInUser?.name);
      }
      if (filter === "Starred") {
        return isStarred;
      }
      return true;
    })
    .filter((event) => event.eventName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((event) => 
      selectedYear === "All Years" || new Date(event.date).getFullYear().toString() === selectedYear
    )
    .filter((event) => 
      selectedEventType === "All Types" || event.eventType === selectedEventType
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sorting latest events first

  return (
    <div className="event-feed-container">
      {/* Search & Filter Section */}
      <div className="filter-search-container">
        <input
          type="text"
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Filter Dropdown */}
        <div className="filter-dropdown">
          <button className="filter-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {filter} ▼
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              {["All Events", "RSVP'd", "Starred"].map((option) => (
                <div key={option} onClick={() => { setFilter(option); setDropdownOpen(false); }}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Year Selection Dropdown */}
        <select className="filter-dropdown" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="All Years">All Years</option>
          {[...new Set(events.map(event => new Date(event.date).getFullYear().toString()))].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Event Type Selection Dropdown */}
        <select className="filter-dropdown" value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)}>
          <option value="All Types">All Event Types</option>
          {[...new Set(events.map(event => event.eventType))].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Layout Wrapper */}
      <div className="content-wrapper">
        {/* Event Feed */}
        <div className="event-feed">
          <h2 className="upcoming-events-title">Upcoming Events</h2>
          <div className="event-list">
            {filteredEvents.length === 0 ? (
              <p>No matching events found.</p>
            ) : (
              filteredEvents.map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-header">
                    <h3 className="event-title">{event.eventName}</h3>
                    <span
                      onClick={() => toggleStar(event._id)}
                      className={`star-icon ${starredEvents.has(event._id) ? "starred" : ""}`}
                      title={starredEvents.has(event._id) ? "Unstar" : "Star"}
                    >
                      {starredEvents.has(event._id) ? "⭐" : "☆"}
                    </span>
                  </div>

                  <p>{event.description}</p>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-GB")}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>

                  {/* Show available slots and ticket price for limited-entry events */}
                  {event.eventType === "limited-entry" && (
                    <>
                      {event.availableSlots !== null && (
                        <p><strong>Available Slots:</strong> {event.availableSlots}</p>
                      )}
                      {event.ticketPrice !== undefined && (
                        <p><strong>Ticket Price:</strong> ₹{event.ticketPrice}</p>
                      )}
                    </>
                  )}

                  {/* Show team for team-specific events */}
                  {event.eventType === "team-specific" && (
                    <p><strong>Team:</strong> {event.team}</p>
                  )}

                  {event.eventType === "limited-entry" && (
                    event.attendees.includes(loggedInUser?.name) ? (
                      <button disabled className="rsvp-button">RSVP’d</button>
                    ) : (
                      <RazorpayButton event={event} loggedInUser={loggedInUser} />
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notification Panel */}
        <div className="notification-panel">
          <h2>Notifications</h2>
          <NotificationPanel loggedInUser={loggedInUser} />
        </div>
      </div>
    </div>
  );
}

export default EventFeed;
