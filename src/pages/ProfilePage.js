import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, setUser } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser({ ...user, ...formData });
    setEditMode(false);
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>

        {editMode ? (
          <>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p>
              <strong>First Name:</strong> {user?.firstName || "N/A"}
            </p>
            <p>
              <strong>Last Name:</strong> {user?.lastName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
