import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EventFeed.css";
import NotificationPanel from "./NotificationPanel";

function EventFeed({ loggedInUser }) {
    const [events, setEvents] = useState([]);

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

    // ✅ RSVP function
    const handleRSVP = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `http://localhost:5000/api/events/${eventId}/rsvp`,
                { employeeName: loggedInUser.name },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.status === 200) {
                alert("RSVP successful!");
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event._id === eventId
                            ? { ...event, availableSlots: event.availableSlots - 1, attendees: [...event.attendees, loggedInUser.name] }
                            : event
                    )
                );
            } else {
                alert("RSVP failed!");
            }
        } catch (error) {
            alert("Error during RSVP. Please try again.");
            console.error("RSVP Error:", error);
        }
    };

    return (
        <div className="event-feed-container">
            {/* Upcoming Events Section */}
            <div className="event-feed">
                <h2 className="upcoming-events-title">Upcoming Events</h2>
                <div className="event-list">
                    {events.length === 0 ? (
                        <p>No upcoming events at the moment.</p>
                    ) : (
                        events.map((event) => (
                            <div key={event._id} className="event-card">
                                <h3>{event.eventName}</h3>
                                <p>{event.description}</p>
                                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-GB")}</p>
                                <p><strong>Venue:</strong> {event.venue}</p>
                                {event.availableSlots !== null && (
                                    <p><strong>Available Slots:</strong> {event.availableSlots}</p>
                                )}
                                {event.eventType === "limited-entry" && event.ticketPrice && (
                                    <p><strong>Ticket Price:</strong> ₹{event.ticketPrice}</p>
                                )}
                                {event.eventType === "limited-entry" && (
                                    <button
                                        className="rsvp-button"
                                        onClick={() => handleRSVP(event._id)}
                                        disabled={event.attendees?.includes(loggedInUser.name) || event.availableSlots === 0}
                                    >
                                        {event.attendees?.includes(loggedInUser.name) ? "RSVP'd" : "RSVP"}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
    
            {/* Notifications Section */}
            <div className="notification-panel">
                <h2>Notifications</h2>
                <NotificationPanel loggedInUser={loggedInUser} />
            </div>
        </div>
    );
}

export default EventFeed;

