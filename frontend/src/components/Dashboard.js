import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <p>You're logged in!</p>
      <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>Logout</button>
    </div>
  );
};

export default Dashboard;

