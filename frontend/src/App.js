import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EventFeed from "./components/Feed/EventFeed";
import EventForm from "./components/Feed/EventForm";
import Navbar from "./components/Feed/Navbar";
import RazorpayButton from "./components/Feed/RazorpayButton";
import ReportsPage from "./components/Reports/ReportsPage"; // New sidebar-based reports page
import Dashboard from "./components/Event Creator Tasks/Dashboard";
import TaskDetails from "./components/Event Creator Tasks/TaskDetails";
import DashboardAssignee from "./components/Assignee Tasks/Dashboard_Assignee";
import TaskDetailsAssignee from "./components/Assignee Tasks/TaskDetails_Assignee";
import { TaskProvider } from "./components/Assignee Tasks/TaskContext_Assignee";
import { TaskContextProvider } from "./components/Event Creator Tasks/TaskContext";
import "./styles/App.css";

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoggedInUser(null);
    };

    return (
        <TaskContextProvider>
            <TaskProvider>
                <Router>
                    {loggedInUser && <Navbar handleLogout={handleLogout} userRole={loggedInUser?.role} />}
                    <Routes>
                        <Route
                            path="/"
                            element={loggedInUser ? <Navigate to="/feed" replace /> : <Login setLoggedInUser={setLoggedInUser} />}
                        />

                        <Route
                            path="/feed"
                            element={loggedInUser ? (
                                <div>
                                    <EventFeed loggedInUser={loggedInUser} />
                                    <h2>Pay to RSVP for the event</h2>
                                    <RazorpayButton amount={100} />
                                </div>
                            ) : <Navigate to="/" replace />}
                        />

                        <Route
                            path="/create-event"
                            element={loggedInUser ? <EventForm /> : <Navigate to="/" replace />}
                        />

                        {/* Reports Page with Sidebar */}
                        <Route
                            path="/reports/*"
                            element={loggedInUser ? <ReportsPage /> : <Navigate to="/" replace />}
                        />

                        <Route
                            path="/manage-events"
                            element={loggedInUser ? <Dashboard /> : <Navigate to="/" replace />}
                        />

                        <Route
                            path="/admin/:id"
                            element={loggedInUser ? <TaskDetails /> : <Navigate to="/" replace />}
                        />

                        <Route
                            path="/pending-tasks"
                            element={loggedInUser ? <DashboardAssignee /> : <Navigate to="/" replace />}
                        />

                        <Route
                            path="/tasks/:id"
                            element={loggedInUser ? <TaskDetailsAssignee /> : <Navigate to="/" replace />}
                        />
                    </Routes>
                </Router>
            </TaskProvider>
        </TaskContextProvider>
    );
}

export default App;
