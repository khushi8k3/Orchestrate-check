import React, { useEffect, useState } from 'react';

function EventFeed({ loggedInUser }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => console.error('Error fetching events:', err));
  }, []);

  const handleRSVP = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeName: loggedInUser.name })
      });
      if (response.ok) {
        alert('RSVP successful!');
        setEvents(events.map(event =>
          event._id === eventId
            ? { ...event, availableSpots: event.availableSpots - 1 }
            : event
        ));
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      console.error('Failed to RSVP:', error);
    }
  };

  if (loading) return <p>Loading events...</p>;

  const filteredEvents = events.filter(event => {
    if (event.type === 'Firm-Wide') return true;
    if (event.type === 'Limited-Entry') return true;
    if (event.type === 'Team-Specific' && event.team === loggedInUser.team) return true;
    return false;
  });

  return (
    <div>
      {filteredEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        filteredEvents.map((event) => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Type: {event.type}</p>

            {event.type === 'Limited-Entry' && (
              <p>🎟️ Available Seats: {event.availableSpots}</p>
            )}

            {event.type === 'Limited-Entry' && event.availableSpots > 0 && (
              <button className="rsvp-btn" onClick={() => handleRSVP(event._id)}>
                RSVP
              </button>
            )}
            {event.type === 'Limited-Entry' && event.availableSpots === 0 && (
              <button className="rsvp-btn" disabled>
                Event Full
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default EventFeed;
