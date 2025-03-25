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

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            try {
                const res = await fetch("http://localhost:5000/api/events", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "User-Email": user.email,
                    },
                });
                const data = await res.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, []);

    // Toggle Star Event
    const toggleStar = (eventId) => {
        const newStars = new Set(starredEvents);
        if (newStars.has(eventId)) {
            newStars.delete(eventId);
        } else {
            newStars.add(eventId);
        }
        setStarredEvents(newStars);
    };

    // Filter Events
    const filteredEvents = events.filter((event) => {
        const isStarred = starredEvents.has(event._id);
        if (filter === "RSVP'd") {
            return event.attendees.includes(loggedInUser.name);
        }
        if (filter === "Starred") {
            return isStarred;
        }
        return true;
    }).filter((event) =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                <div className="filter-dropdown">
                    <button 
                        className="filter-button" 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {filter} ▼
                    </button>

                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <div onClick={() => { setFilter("All Events"); setDropdownOpen(false); }}>All Events</div>
                            <div onClick={() => { setFilter("RSVP'd"); setDropdownOpen(false); }}>RSVP'd</div>
                            <div onClick={() => { setFilter("Starred"); setDropdownOpen(false); }}>Starred</div>
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

                                    {event.availableSlots !== null && (
                                        <p><strong>Available Slots:</strong> {event.availableSlots}</p>
                                    )}

                                    {event.ticketPrice !== undefined && (
                                        <p><strong>Ticket Price:</strong> ₹{event.ticketPrice}</p>
                                    )}

                                    {event.eventType === "limited-entry" && (
                                        event.attendees.includes(loggedInUser.name) ? (
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



