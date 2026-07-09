import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./SkillsPage.css";

export default function SkillsPage() {
  const {
    dreamJob,
    roleName,
    skills,
    checked,
    handleCheck,
    resetProgress,
    assessmentResults,
    allSkillsCompleted,
    allAssessmentsPassed,
    hasAnyAssessmentPassed,
    canIssueCertificate,
    issueCertificate,
    certificate,
  } = useApp();
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

  const getAssessmentLabel = (level) => {
    const attempt = assessmentResults?.[level];
    if (!attempt) return "Pending";
    return attempt.passed ? `Passed (${attempt.score}/${attempt.total})` : `Retry Required (${attempt.score}/${attempt.total})`;
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

  const handleQuizStart = (level) => {
    if (roleName) localStorage.setItem("selectedRole", roleName);
    navigate(`/quiz/${level.toLowerCase()}`);
  };

  const handleIssueCertificate = () => {
    const result = issueCertificate();
    if (!result.ok) {
      alert(result.msg);
      return;
    }
    alert("Certificate generated successfully. You can view it on your profile page.");
  };

  return (
    <div className="skills-page">
      <div className="topbar center">
        <h2 className="title">Skills for “{roleName || dreamJob || "Your Role"}”</h2>
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
              <div className="skill-row">
                <div className="skill-main">
                  <input
                    type="checkbox"
                    checked={checked[s.name] || false}
                    onChange={() => handleCheck(s.name)}
                  />
                  <span className={checked[s.name] ? "strike" : ""}>{s.name}</span>
                </div>
                <div className="resource-links">
                  {s.resources?.free && (
                    <a
                      className="link"
                      href={s.resources.free.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.resources.free.label}
                    </a>
                  )}
                  {s.resources?.paid && (
                    <a
                      className="link paid"
                      href={s.resources.paid.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.resources.paid.label}
                    </a>
                  )}
                  <button
                    className="btn learn"
                    onClick={() => navigate(`/learn/${encodeURIComponent(s.name)}`)}
                  >
                    Learn This Skill
                  </button>
                </div>
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
              </div>
            </li>
          ))}
        </ul>

        <div className="assessment-card">
          <h3>Assessments</h3>
          <p className="muted">Pass each level with 70% or higher to validate your learning.</p>
          <div className="assessment-grid">
            <p>Beginner: {getAssessmentLabel("beginner")}</p>
            <p>Intermediate: {getAssessmentLabel("intermediate")}</p>
            <p>Advanced: {getAssessmentLabel("advanced")}</p>
          </div>
          <p className="muted">
            Skills completed: {allSkillsCompleted ? "Yes" : "No"} | Any assessment passed: {hasAnyAssessmentPassed ? "Yes" : "No"} | All levels passed: {allAssessmentsPassed ? "Yes" : "No"}
          </p>
          {certificate ? (
            <p className="success-text">Certificate issued. Visit your profile to view details.</p>
          ) : (
            <button className="btn success" onClick={handleIssueCertificate} disabled={!canIssueCertificate}>
              Generate Level Completion Certificate
            </button>
          )}
        </div>

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
              Advanced Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
