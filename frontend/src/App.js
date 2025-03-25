import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EventFeed from "./components/Feed/EventFeed";
import EventForm from "./components/Feed/EventForm";
import Navbar from "./components/Feed/Navbar";
import RazorpayButton from "./components/Feed/RazorpayButton";
import DetailedEventReport from "./components/Reports/DetailedEventReport";
import ComprehensiveReport from "./components/Reports/ComprehensiveReport";
import Dashboard from "./components/Event Creator Tasks/Dashboard";
import TaskDetails from "./components/Event Creator Tasks/TaskDetails";
import DashboardAssignee from "./components/Assignee Tasks/Dashboard_Assignee";
import TaskDetailsAssignee from "./components/Assignee Tasks/TaskDetails_Assignee";
import { TaskProvider } from "./components/Assignee Tasks/TaskContext_Assignee";
import { TaskContextProvider } from "./components/Event Creator Tasks/TaskContext";
import "./styles/App.css";

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [view, setView] = useState("detailed");

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
        // ✅ Wrap your whole app in context providers
        <TaskContextProvider>
            <TaskProvider>
                <Router>
                    {loggedInUser && <Navbar handleLogout={handleLogout} userRole={loggedInUser?.role} />}
                    <Routes>
                        {/* Login and Feed */}
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

                        {/* Event Creation and Reports */}
                        <Route
                            path="/create-event"
                            element={loggedInUser ? <EventForm /> : <Navigate to="/" replace />}
                        />
                        <Route
                            path="/reports"
                            element={loggedInUser ? (
                                <div className="app-container">
                                    <h1>Event Reports Dashboard</h1>
                                    <div className="toggle-buttons">
                                        <button
                                            onClick={() => setView('detailed')}
                                            className={view === 'detailed' ? 'active' : ''}
                                        >
                                            Detailed Report
                                        </button>
                                        <button
                                            onClick={() => setView('comprehensive')}
                                            className={view === 'comprehensive' ? 'active' : ''}
                                        >
                                            Comprehensive Report
                                        </button>
                                    </div>
                                    {view === 'detailed' ? <DetailedEventReport /> : <ComprehensiveReport />}
                                </div>
                            ) : <Navigate to="/" replace />}
                        />

                        {/* Event Creator Tasks */}
                        <Route
                            path="/manage-events"
                            element={loggedInUser ? <Dashboard /> : <Navigate to="/" replace />}
                        />
                        <Route
                            path="/admin/:id"
                            element={loggedInUser ? <TaskDetails /> : <Navigate to="/" replace />}
                        />

                        {/* Assignee Tasks */}
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
