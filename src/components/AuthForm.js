import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./AuthForm.css";

export default function AuthForm() {
  const { setUser } = useApp();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    mobile: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all required fields!");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (isSignup) {

      if (storedUsers.some((u) => u.email === formData.email)) {
        alert("User already exists! Please login.");
        setIsSignup(false);
        return;
      }

      // ✅ Combine first + last name properly
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      // ✅ Create new user object
      const newUser = {
        ...formData,
        name: fullName, // save as 'name' for easy use in Dashboard
      };

      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("profileSetupDone", "false");
      setUser(newUser);

      alert("Signup successful! Redirecting to dashboard...");
      navigate("/");
    } else {
      // ✅ Login flow
      const existingUser = storedUsers.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (!existingUser) {
        alert("Invalid email or password!");
        return;
      }

      // ✅ Set user and persist it
      setUser(existingUser);
      localStorage.setItem("user", JSON.stringify(existingUser));
      localStorage.setItem("profileSetupDone", "false");
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{isSignup ? "Create Account" : "Welcome"}</h2>
        <p className="login-subtitle">
          {isSignup
            ? "Sign up to get started with SkillPulse."
            : "Sign in to continue SkillPulse."}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // 👁️ Eye closed icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="white"
                  className="eye-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3
                       0 .592-.17 1.14-.46 1.6M12 15a3 3 0 01-3-3 3 3 0
                       013-3m9.364 3.364A9.96 9.96 0 0021 12c-2.5-3.5-6-6-9-6
                       -1.312 0-2.57.3-3.72.84M4.22 4.22A9.96 9.96 0 003
                       12c2.5 3.5 6 6 9 6 1.312 0 2.57-.3 3.72-.84"
                  />
                </svg>
              ) : (
                // 👁️ Eye open icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="white"
                  className="eye-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0
                       8.268 2.943 9.542 7-.732 4.057-4.523 7-9.542
                       7-5.019 0-8.81-2.943-9.542-7z"
                  />
                  <circle cx="12" cy="12" r="3" fill="white" />
                </svg>
              )}
            </span>
          </div>

          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>

        <p className="signup-text">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsSignup(false)}>Login</span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setIsSignup(true)}>Sign Up</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
