import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../../styles/NotificationPanel.css";

const socket = io("http://localhost:5000");// Adjust to your backend URL if needed

function NotificationPanel({ loggedInUser }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:5000/api/tasks", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "User-Email": loggedInUser.email,
                    },
                });
                console.log("Fetched Tasks:", res.data);  // Debugging log
                setTasks(res.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();

        // WebSocket event listener for real-time task updates
        socket.on("newTask", (task) => {
            if (task.assignedToEmail === loggedInUser.email) {
                setTasks((prevTasks) => [...prevTasks, task]);
            }
        });

        // Polling fallback every 10 seconds
        const interval = setInterval(fetchTasks, 10000);

        return () => {
            socket.off("newTask"); // Cleanup WebSocket listener
            clearInterval(interval); // Cleanup polling
        };
    }, [loggedInUser]);

    return (
        <div className="notification-panel">
            {tasks.length === 0 ? (
                <p>No notifications.</p>
            ) : (
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>
                            <p><strong>{task.taskName}</strong></p>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                            <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default NotificationPanel;