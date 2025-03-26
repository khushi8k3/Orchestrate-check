import React from "react";
import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import ReportsHome from "./ReportsHome";
import ComprehensiveReport from "./ComprehensiveReport";
import DetailedEventReport from "./DetailedEventReport";
import "../../styles/ReportsPage.css";

const ReportsPage = () => {
    const location = useLocation(); // Track route changes

    return (
        <div className="reports-container">
            {/* Sidebar Navigation */}
            <nav className="reports-sidebar">
                <h2>Reports</h2>
                <ul>
                    <li>
                        <NavLink to="/reports/home" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/reports/comprehensive" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>Comprehensive Reports</NavLink>
                    </li>
                    <li>
                        <NavLink to="/reports/detailed" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>Detailed Reports</NavLink>
                    </li>
                </ul>
            </nav>

            {/* Reports Content */}
            <div className="reports-content">
                <Routes key={location.pathname}>
                    <Route path="home" element={<ReportsHome />} />
                    <Route path="comprehensive" element={<ComprehensiveReport />} />
                    <Route path="detailed" element={<DetailedEventReport />} />
                    <Route path="*" element={<Navigate to="/reports/home" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default ReportsPage;
