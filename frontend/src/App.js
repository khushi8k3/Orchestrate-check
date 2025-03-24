import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EventFeed from "./components/EventFeed";
import EventForm from "./components/EventForm";
import Navbar from "./components/Navbar";
import RazorpayButton from "./components/RazorpayButton";
import DetailedEventReport from "./components/DetailedEventReport";
import ComprehensiveReport from "./components/ComprehensiveReport";
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
        <Router>
            {/* Render Navbar only if user is logged in */}
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
            </Routes>
        </Router>
    );
}

export default App;
