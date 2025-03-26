import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; 
import "../../styles/Navbar.css";

function Navbar({ handleLogout, userRole }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleNavigation = (path) => {
        if (path === "/feed") {
            navigate(path, { replace: true }); // Clears history when going to Home
        } else {
            navigate(path);
            setTimeout(() => {
                window.history.replaceState(null, "", "/feed"); // Replace current history with feed
            }, 50);
        }
        setMenuOpen(false);
    };
    
    return (
        <div className="navbar">
            <h2 className="logo">Orchestrate</h2>

            {/* Hamburger Icon */}
            <div className="hamburger-menu" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>

            {/* Dropdown Menu */}
            {menuOpen && (
                <div className="nav-dropdown">
                    <button onClick={() => handleNavigation("/feed")}>Home</button>
                    
                    {/* Allow "Create Event" only for Admins & Managers */}
                    {(userRole === "admin" || userRole === "manager") && (
                        <button onClick={() => handleNavigation("/create-event")}>Create Event</button>
                    )}

                    <button onClick={() => handleNavigation("/reports")}>See Reports</button>
                    <button onClick={() => handleNavigation("/pending-tasks")}>See Your Tasks</button>
                    
                    {/* Allow "Manage Events" only for Admins & Managers */}
                    {(userRole === "admin" || userRole === "manager") && (
                        <button onClick={() => handleNavigation("/manage-events")}>Manage Your Events</button>
                    )}

                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}

export default Navbar;
