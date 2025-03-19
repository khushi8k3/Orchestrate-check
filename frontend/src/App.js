import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EventFeed from "./components/EventFeed";
import EventForm from "./components/EventForm";
import Navbar from "./components/Navbar";  // Import Navbar
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
        <Router>
            {/* Keep Navbar constant on all pages */}
            <Navbar handleLogout={handleLogout} userRole={loggedInUser?.role} /> 
            <Routes>
                <Route
                    path="/"
                    element={loggedInUser ? <Navigate to="/feed" replace /> : <Login setLoggedInUser={setLoggedInUser} />}
                />
                <Route
                    path="/feed"
                    element={loggedInUser ? <EventFeed loggedInUser={loggedInUser} /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/create-event"
                    element={loggedInUser ? <EventForm /> : <Navigate to="/" replace />}
                />
            </Routes>
        </Router>
    );
}

export default App;

