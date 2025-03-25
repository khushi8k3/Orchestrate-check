import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../utils/socket"; 
import "../../styles/NotificationPanel.css";

function NotificationPanel({ loggedInUser }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found. Please log in again.");
                return;
            }
            try {
                const res = await axios.get("http://localhost:5000/api/tasks/assigned", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "user-email": loggedInUser.email,
                    },
                });
                console.log("Fetched Assigned Tasks:", res.data);
                setTasks(res.data);
            } catch (error) {
                console.error("Error fetching assigned tasks:", error);
            }
        };

        fetchTasks();

        // WebSocket for real-time updates
        socket.on("newTask", (task) => {
            if (task.assignee === loggedInUser.email) {
                console.log("🔄 New Task Received:", task);
                setTasks((prevTasks) => {
                    const isDuplicate = prevTasks.some((prevTask) => prevTask._id === task._id);
                    return isDuplicate ? prevTasks : [...prevTasks, task];
                });
            }
        });

        socket.on("newComment", (commentData) => {
            const { taskId, author, message } = commentData;
            console.log("💬 New Comment Received:", commentData);

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId
                        ? { ...task, comments: [...(task.comments || []), { author, message }] }
                        : task
                )
            );
        });

        socket.on("newEvent", (eventData) => {
            console.log("📢 New Event Notification:", eventData);
            
            if (eventData.eventType === "firm-wide" || eventData.team === loggedInUser.team) {
                setTasks((prevTasks) => {
                    const isDuplicate = prevTasks.some((prevTask) => prevTask._id === eventData._id);
                    return isDuplicate ? prevTasks : [...prevTasks, eventData];
                });
            }
        });

        return () => {
            socket.off("newTask");
            socket.off("newComment");
            socket.off("newEvent");
        };
    }, [loggedInUser.email, loggedInUser.team]);

    return (
        <div className="notification-panel">
            {tasks.length === 0 ? (
                <p>No notifications.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id || Math.random()}>
                            <p><strong>{task.taskName || task.eventName}</strong></p>
                            <p>{task.description || "New Event Available!"}</p>
                            {task.status && <p>Status: {task.status}</p>}
                            {task.deadline && <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default NotificationPanel;
