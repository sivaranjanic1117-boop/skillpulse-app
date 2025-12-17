import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./SkillsPage.css";

export default function SkillsPage() {
  const { dreamJob, skills, checked, handleCheck, resetProgress } = useApp();
  const navigate = useNavigate();

  const progress = useMemo(() => {
    const total = skills.length || 0;
    const done = Object.values(checked).filter(Boolean).length;
    return total ? Math.round((done / total) * 100) : 0;
  }, [skills, checked]);

  const getProgressBadge = () => {
    if (progress >= 80) return "Expert !!!";
    if (progress >= 40) return "Intermediate !!!";
    return "Beginner !!!";
  };

  if (!skills.length) {
    // If user came here directly, send them to dashboard
    return (
      <div className="page page-center">
        <div className="card">
          <h2>No skills yet</h2>
          <p className="muted">Please enter a dream job first.</p>
          <button className="btn" onClick={() => navigate("/")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ✅ When quiz button is clicked, save role + navigate
  const handleQuizStart = (level) => {
    if (dreamJob) {
      localStorage.setItem("selectedRole", dreamJob.toLowerCase());
    }
    navigate(`/quiz/${level.toLowerCase()}`);
  };

  return (
    <div className="page">
      <div className="topbar center">
        <h2 className="title">Skills for “{dreamJob || "Your Role"}”</h2>
      </div>

      <div className="container">
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="muted center">
          {progress}% complete — Badge: {getProgressBadge()}
        </p>

        <ul className="skills-list">
          {skills.map((s, idx) => (
            <li key={idx} className="skill-item">
              <label className="skill-row">
                <input
                  type="checkbox"
                  checked={checked[s.name] || false}
                  onChange={() => handleCheck(s.name)}
                />
                <span className={checked[s.name] ? "strike" : ""}>{s.name}</span>
                {s.link && (
                  <a
                    className="link"
                    href={s.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn →
                  </a>
                )}
              </label>
            </li>
          ))}
        </ul>

        <div className="row">
          <button className="btn danger" onClick={resetProgress}>
            Reset Progress
          </button>
          <div className="spacer" />
          <div className="btn-group">
            <button
              className="btn warn"
              onClick={() => handleQuizStart("Beginner")}
            >
              Beginner Quiz
            </button>
            <button
              className="btn warn"
              onClick={() => handleQuizStart("Intermediate")}
            >
              Intermediate Quiz
            </button>
            <button
              className="btn warn"
              onClick={() => handleQuizStart("Final")}
            >
              Final Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
