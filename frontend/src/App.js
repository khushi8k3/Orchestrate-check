import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EventFeed from "./components/EventFeed";

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Load user from localStorage on page load
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("rememberMe");
        setLoggedInUser(null);
    };

    // Auto-logout after 10 minutes of inactivity if user hasn't chosen "Remember Me"
    useEffect(() => {
        if (loggedInUser && localStorage.getItem("rememberMe") !== "true") {
            let timer = setTimeout(() => {
                alert("You have been logged out due to inactivity.");
                handleLogout();
            }, 10 * 60 * 1000); // 10 minutes

            const resetTimer = () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    alert("You have been logged out due to inactivity.");
                    handleLogout();
                }, 10 * 60 * 1000);
            };

            window.addEventListener("mousemove", resetTimer);
            window.addEventListener("keydown", resetTimer);
            window.addEventListener("click", resetTimer);

            return () => {
                window.removeEventListener("mousemove", resetTimer);
                window.removeEventListener("keydown", resetTimer);
                window.removeEventListener("click", resetTimer);
                clearTimeout(timer);
            };
        }
    }, [loggedInUser]);

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={
                        loggedInUser ? (
                            <Navigate to="/feed" replace />
                        ) : (
                            <Login setLoggedInUser={setLoggedInUser} />
                        )
                    } 
                />
                <Route 
                    path="/feed" 
                    element={
                        loggedInUser ? (
                            <EventFeed loggedInUser={loggedInUser} handleLogout={handleLogout} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;


