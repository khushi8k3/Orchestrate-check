import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/EmployeeCalendar.css";  // Import the styled calendar

const localizer = momentLocalizer(moment);

const EmployeeCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEmployeeEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/events");
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEmployeeEvents();
    }, []);

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
            />
        </div>
    );
};

export default EmployeeCalendar;

