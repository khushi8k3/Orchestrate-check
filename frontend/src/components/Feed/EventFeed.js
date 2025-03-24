import React, { useState, useEffect } from "react";
import RazorpayButton from "./RazorpayButton";
import "../../styles/EventFeed.css";
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

    return (
        <div className="event-feed-container">
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
                                
                                {/* Show ticket price only if defined */}
                                {event.ticketPrice !== undefined && (
                                    <p><strong>Ticket Price:</strong> ₹{event.ticketPrice}</p>
                                )}

                                {/* RSVP or Payment Button (Only for Limited-Entry Events) */}
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

            <div className="notification-panel">
                <h2>Notifications</h2>
                <NotificationPanel loggedInUser={loggedInUser} />
            </div>
        </div>
    );
}

export default EventFeed;
