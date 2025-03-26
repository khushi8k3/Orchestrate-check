import React, { useState, useEffect } from "react";
import RazorpayButton from "./RazorpayButton";
import "../../styles/EventFeed.css";
import NotificationPanel from "./NotificationPanel";

function EventFeed({ loggedInUser }) {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [starredEvents, setStarredEvents] = useState(new Set());
  const [filter, setFilter] = useState("All Events");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState("All Types");
  const [eventTypeDropdownOpen, setEventTypeDropdownOpen] = useState(false);

  useEffect(() => {
    if (!loggedInUser?.email) return;

    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user) return;

      try {
        const res = await fetch("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Email": user.email,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [loggedInUser?.email]);

  const toggleStar = (eventId) => {
    const newStars = new Set(starredEvents);
    newStars.has(eventId) ? newStars.delete(eventId) : newStars.add(eventId);
    setStarredEvents(newStars);
  };

  const eventYears = [...new Set(events.map(event => new Date(event.date).getFullYear()))];
  const eventTypes = [...new Set(events.map(event => event.eventType))];

  const filteredEvents = events
    .filter((event) => {
      const isStarred = starredEvents.has(event._id);
      if (filter === "RSVP'd") return event.attendees.includes(loggedInUser?.name);
      if (filter === "Starred") return isStarred;
      return true;
    })
    .filter((event) => event.eventName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((event) => selectedYear === "All Years" || new Date(event.date).getFullYear().toString() === selectedYear)
    .filter((event) => selectedEventType === "All Types" || event.eventType === selectedEventType);

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
        <div className="filter-dropdown">
          <button className="filter-button" onClick={() => setYearDropdownOpen(!yearDropdownOpen)}>
            {selectedYear} ▼
          </button>

          {yearDropdownOpen && (
            <div className="dropdown-menu">
              <div onClick={() => { setSelectedYear("All Years"); setYearDropdownOpen(false); }}>
                All Years
              </div>
              {eventYears.sort((a, b) => b - a).map((year) => (
                <div key={year} onClick={() => { setSelectedYear(year.toString()); setYearDropdownOpen(false); }}>
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Type Dropdown (Updated) */}
        <div className="filter-dropdown">
          <button className="filter-button" onClick={() => setEventTypeDropdownOpen(!eventTypeDropdownOpen)}>
            {selectedEventType} ▼
          </button>

          {eventTypeDropdownOpen && (
            <div className="dropdown-menu">
              <div onClick={() => { setSelectedEventType("Event Types"); setEventTypeDropdownOpen(false); }}>
                All Types
              </div>
              {eventTypes.map((type) => (
                <div key={type} onClick={() => { setSelectedEventType(type); setEventTypeDropdownOpen(false); }}>
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>
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
                    <h3
                      className="event-title"
                      onClick={() => setSelectedEventType(event.eventType)}
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      {event.eventName}
                    </h3>
                    <span
                      onClick={() => toggleStar(event._id)}
                      className={`star-icon ${starredEvents.has(event._id) ? "starred" : ""}`}
                      title={starredEvents.has(event._id) ? "Unstar" : "Star"}
                    >
                      {starredEvents.has(event._id) ? "⭐" : "☆"}
                    </span>
                  </div>

                  <p>{event.description}</p>
                  <p><strong>Type:</strong> {event.eventType}</p>
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
