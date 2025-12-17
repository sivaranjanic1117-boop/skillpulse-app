import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { dreamJob, setDreamJob, generateSkills, user } = useApp();
  const navigate = useNavigate();

  const handleGenerate = () => {
  if (!dreamJob.trim()) {
    alert("Please enter your dream job!");
    return;
  }

  localStorage.setItem("selectedJob", dreamJob);

  const res = generateSkills();
  if (res.ok) navigate("/skills");
  else alert(res.msg);
};

  const displayName =
  user?.name ||
  (user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email || "Guest");

  return (
    <div className="page page-center">
      <div className="card card-lg">
        <h1 className="title">🚀 SkillPulse</h1>
        <p className="muted">
          Welcome <strong>{displayName}</strong>! Tell us your dream role to build a skill roadmap.
        </p>

        <div className="form-row">
          <input
            className="input"
            type="text"
            placeholder="e.g., Web Developer"
            value={dreamJob}
            onChange={(e) => setDreamJob(e.target.value)}
          />
          <button className="btn primary" onClick={handleGenerate}>
            Generate Roadmap
          </button>
        </div>

        <p className="hint">
          You can change this later. We’ll save your progress automatically.
        </p>
      </div>
    </div>
  );
}
