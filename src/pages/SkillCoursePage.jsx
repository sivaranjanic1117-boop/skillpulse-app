import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../AppContext";
import "./SkillJourneyPages.css";

export default function SkillCoursePage() {
    const { skillName: skillNameParam } = useParams();
    const navigate = useNavigate();
    const { skills, skillProgress, isSkillUnlocked, selectSkillCourse } = useApp();

    const skillName = useMemo(() => decodeURIComponent(skillNameParam || ""), [skillNameParam]);
    const skillData = useMemo(() => skills.find((item) => item.name === skillName), [skills, skillName]);
    const progress = skillProgress?.[skillName] || {};

    if (!skillData) {
        return (
            <div className="sj-page">
                <div className="sj-card">
                    <h2>Skill not found</h2>
                    <button className="sj-btn ghost" onClick={() => navigate("/roadmap")}>Back to Roadmap</button>
                </div>
            </div>
        );
    }

    if (!isSkillUnlocked(skillName)) {
        return (
            <div className="sj-page">
                <div className="sj-card">
                    <h2>Skill is locked</h2>
                    <p>Complete and pass the previous skill first.</p>
                    <button className="sj-btn ghost" onClick={() => navigate("/roadmap")}>Back to Roadmap</button>
                </div>
            </div>
        );
    }

    const chooseCourse = (courseType) => {
        const resource = skillData.resources?.[courseType];
        if (!resource?.url) return;

        selectSkillCourse(skillName, courseType);
        window.open(resource.url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="sj-page">
            <div className="sj-card">
                <div className="sj-header">
                    <div>
                        <h1>{skillName} - Step 1</h1>
                        <p>Choose your preferred Udemy track and start learning.</p>
                    </div>
                    <button className="sj-btn ghost" onClick={() => navigate("/roadmap")}>Roadmap</button>
                </div>

                <div className="sj-grid">
                    <article className="sj-panel">
                        <h3>Free Track (Udemy)</h3>
                        <a href={skillData.resources?.free?.url} target="_blank" rel="noreferrer">{skillData.resources?.free?.label}</a>
                        <button className="sj-btn" onClick={() => chooseCourse("free")}>Choose Free</button>
                    </article>

                    <article className="sj-panel paid">
                        <h3>Paid Track (Udemy)</h3>
                        <a href={skillData.resources?.paid?.url} target="_blank" rel="noreferrer">{skillData.resources?.paid?.label}</a>
                        <button className="sj-btn" onClick={() => chooseCourse("paid")}>Choose Paid</button>
                    </article>
                </div>

                <div className="sj-status">
                    <p>Selected Course: {progress.selectedCourse ? progress.selectedCourse.toUpperCase() : "Not selected"}</p>
                </div>

                <div className="sj-actions">
                    <button
                        className="sj-btn"
                        disabled={!progress.selectedCourse}
                        onClick={() => navigate(`/learn/${encodeURIComponent(skillName)}/complete`)}
                    >
                        Continue to Step 2
                    </button>
                </div>
            </div>
        </div>
    );
}
