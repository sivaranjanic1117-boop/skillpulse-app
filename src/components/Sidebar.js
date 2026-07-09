import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { 
  LayoutDashboard, 
  Route, 
  Award, 
  User, 
  Users, 
  LogOut,
  X
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLinkClick = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Sidebar Top / Brand Area */}
      <div className="sidebar-brand-wrapper">
        <div className="sidebar-brand">
          <span className="brand-logo">🚀</span>
          <div className="brand-details">
            <h2 className="brand-title">SkillPulse</h2>
            <span className="brand-subtitle">Enterprise LMS</span>
          </div>
        </div>
        {/* Mobile close button inside sidebar */}
        <button 
          className="sidebar-close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Close Navigation Menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation Menu Links */}
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={handleLinkClick}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/batches" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={handleLinkClick}
        >
          <Users size={20} />
          <span>Batch Management</span>
        </NavLink>

        <NavLink 
          to="/roadmap" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={handleLinkClick}
        >
          <Route size={20} />
          <span>Learning Pathway</span>
        </NavLink>

        <NavLink 
          to="/hero-badge" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={handleLinkClick}
        >
          <Award size={20} />
          <span>Hero Challenge</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={handleLinkClick}
        >
          <User size={20} />
          <span>User Profile</span>
        </NavLink>
      </nav>

      {/* Sidebar Footer / User Logout Section */}
      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
