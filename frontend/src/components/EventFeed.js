import React, { useEffect, useState } from "react";

function EventFeed({ loggedInUser, handleLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/events", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched events:", data);
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  const handleRSVP = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeName: loggedInUser.name }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        // Update event state without reloading
        setEvents(
          events.map((event) =>
            event._id === eventId
              ? { ...event, availableSlots: result.availableSlots, attendees: [...event.attendees, loggedInUser.name] }
              : event
          )
        );
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Failed to RSVP:", error);
    }
  };

  if (loading) return <p>Loading events...</p>;

  // Filtering logic with normalization for team-specific events
  const filteredEvents = events.filter((event) => {
    const eventType = event.eventType?.toLowerCase().trim() || "";
    const eventTeam = event.team?.toLowerCase().trim() || "";
    const userTeam = loggedInUser.team?.toLowerCase().trim() || "";

    console.log(
      `Event: "${event.eventName}", Type: "${eventType}", Event Team: "${eventTeam}", User Team: "${userTeam}"`
    );

    return (
      eventType === "firm-wide" ||
      eventType === "limited-entry" ||
      (eventType === "team-specific" && eventTeam === userTeam) // Ensures only matching teams are displayed
    );
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>📅 Event Feed</h2>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        filteredEvents.map((event) => (
          <div key={event._id} style={styles.card}>
            <h3 style={styles.title}>{event.eventName}</h3>
            <p>{event.description}</p>
            <p>
              <strong>Venue:</strong> {event.venue}
            </p>
            <p>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Type:</strong> {event.eventType}
            </p>

            {event.eventType.toLowerCase() === "limited-entry" && (
              <p style={styles.seats}>
                🎟️ Available Seats: {event.availableSlots ?? "N/A"}
              </p>
            )}

            {event.eventType.toLowerCase() === "limited-entry" &&
              event.availableSlots > 0 && (
                <button style={styles.rsvpButton} onClick={() => handleRSVP(event._id)}>
                  RSVP
                </button>
              )}

            {event.eventType.toLowerCase() === "limited-entry" &&
              event.availableSlots === 0 && (
                <button style={styles.rsvpButton} disabled>
                  Event Full
                </button>
              )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#f3f8f5",
    borderRadius: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  headerTitle: {
    margin: 0,
    fontSize: "24px",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "15px",
  },
  title: {
    color: "#007bff",
    marginBottom: "5px",
  },
  seats: {
    color: "red",
    fontWeight: "bold",
  },
  rsvpButton: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
  },
};

export default EventFeed;
