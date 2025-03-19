import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import "../styles/Navbar.css";

function Navbar({ handleLogout, userRole }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // Toggle menu open/close
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Handle navigation and close menu
    const handleNavigation = (path) => {
        navigate(path);
        setMenuOpen(false); // Close menu after selecting an option
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
                    {userRole === "admin" && (
                        <button onClick={() => handleNavigation("/create-event")}>Create Event</button>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}

export default Navbar;
