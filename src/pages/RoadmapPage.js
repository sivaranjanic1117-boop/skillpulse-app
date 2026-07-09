import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./RoadmapPage.css";

export default function RoadmapPage() {
    const { profileSetupDone, roleName, dreamJob, skills, currentSkillIndex, skillProgress, allSkillQuizzesPassed } = useApp();
    const navigate = useNavigate();

    if (!profileSetupDone) {
        return (
            <div className="roadmap-page">
                <div className="roadmap-card">
                    <h2>Complete profile setup first</h2>
                    <button onClick={() => navigate("/setup-profile")}>Go To Profile Setup</button>
                </div>
            </div>
        );
    }

    if (!skills.length) {
        return (
            <div className="roadmap-page">
                <div className="roadmap-card">
                    <h2>No roadmap yet</h2>
                    <button onClick={() => navigate("/dream-role")}>Go To Dream Role</button>
                </div>
            </div>
        );
    }

    return (
        <div className="roadmap-page">
            <div className="roadmap-card">
                <h1>{roleName || dreamJob} Roadmap</h1>
                <p>Follow each step in order, complete the course and pass the quiz to unlock the next skill.</p>

                <div className="path-wrap">
                    {skills.map((skill, index) => {
                        const unlocked = index <= currentSkillIndex;
                        const passed = Boolean(skillProgress?.[skill.name]?.quizPassed);
                        const inProgress = unlocked && !passed;

                        return (
                            <div key={skill.name} className="path-step">
                                <button
                                    className={`step-node ${passed ? "passed" : ""} ${inProgress ? "in-progress" : ""}`}
                                    disabled={!unlocked}
                                    onClick={() => navigate(`/learn/${encodeURIComponent(skill.name)}`)}
                                >
                                    {passed ? "✓" : index + 1}
                                </button>
                                <div className="step-info">
                                    <h3>{skill.name}</h3>
                                    <p>{passed ? "Completed" : unlocked ? "Ready to learn" : "Locked"}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="roadmap-footer">
                    <button disabled={!allSkillQuizzesPassed} onClick={() => navigate("/hero-badge")}>Unlock Hero Badge Challenge</button>
                    {!allSkillQuizzesPassed && <p>Complete all skill quizzes to unlock the hero challenge.</p>}
                </div>
            </div>
        </div>
    );
}
