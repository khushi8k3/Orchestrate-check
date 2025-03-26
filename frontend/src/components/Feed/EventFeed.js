import React, { useState, useEffect } from "react";
import RazorpayButton from "./RazorpayButton";
import "../../styles/EventFeed.css";
import NotificationPanel from "./NotificationPanel";

function EventFeed({ loggedInUser }) {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [starredEvents, setStarredEvents] = useState(new Set());
  const [selectedFilter, setSelectedFilter] = useState("All Events");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedEventType, setSelectedEventType] = useState("All Types");

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

  // ✅ Filtering Logic
  const filteredEvents = events
    .filter((event) => {
      const isStarred = starredEvents.has(event._id);

      if (selectedFilter === "RSVP'd") {
        return event.attendees.includes(loggedInUser?.name);
      }

      if (selectedFilter === "Starred") {
        return isStarred;
      }

      return true; // For "All Events"
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

      {/* 🔥 Inline Filter & Search Section */}
      <div className="filter-search-inline">

        {/* 🔍 Search Bar */}
        <input
          type="text"
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Inline Filters beside search bar */}
        <select
          className="filter-dropdown"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="All Events">All Events</option>
          <option value="RSVP'd">RSVP'd</option>
          <option value="Starred">Starred</option>
        </select>

        <select
          className="filter-dropdown"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="All Years">All Years</option>
          {[...new Set(events.map(event => new Date(event.date).getFullYear().toString()))].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          className="filter-dropdown"
          value={selectedEventType}
          onChange={(e) => setSelectedEventType(e.target.value)}
        >
          <option value="All Types">All Event Types</option>
          {[...new Set(events.map(event => event.eventType))].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* ✅ Upcoming Events Title Above the Events */}
      <h2 className="section-title">Upcoming Events</h2>

      {/* 🔥 Layout Wrapper */}
      <div className="content-wrapper">

        {/* 📅 Event Feed */}
        <div className="event-feed">
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

        {/* 🔔 Notification Panel beside events */}
        <div className="notification-panel">
          <h2>Notifications</h2>
          <NotificationPanel loggedInUser={loggedInUser} />
        </div>
      </div>
    </div>
  );
}

export default EventFeed;
