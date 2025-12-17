import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./Sidebar.css";

export default function Sidebar() {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // clear user
    navigate("/login"); // redirect to login
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">SkillPulse</h2>
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        <NavLink to="/skills" className={({ isActive }) => isActive ? "active" : ""}>Skills</NavLink>
        <NavLink to="/quiz/beginner" className={({ isActive }) => isActive ? "active" : ""}>Quiz</NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
