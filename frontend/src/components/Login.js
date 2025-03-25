import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Ensure this path is correct

const Login = ({ setLoggedInUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // ✅ Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/feed");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password,
          });
      
          const user = res.data.user;
          const token = res.data.token;
      
          if (!user || !token) {
            throw new Error("Invalid response from server");
          }
      
          // Store user email, token, and user data in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userEmail", res.data.user.email);
      
          // Set token in Axios for further requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
          setLoggedInUser(user);
          navigate("/feed");
        } catch (err) {
          alert(err.response?.data?.message || "Login failed. Please try again.");
        }
      };

    return (
        <div className="login-wrapper">
            {/* Left Side: Full-Height Gradient with Icon/Illustration */}
            <div className="login-graphic">
                <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                    alt="Login Illustration"
                />
            </div>

            {/* Right Side: Login Form */}
            <div className="login-form-container">
                <h2>Login</h2>
                <p className="subtitle">Let’s Get Started</p>

                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
