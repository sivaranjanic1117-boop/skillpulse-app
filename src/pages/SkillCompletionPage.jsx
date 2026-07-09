import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../AppContext";
import "./SkillJourneyPages.css";

export default function SkillCompletionPage() {
    const { skillName: skillNameParam } = useParams();
    const navigate = useNavigate();
    const { skills, skillProgress, isSkillUnlocked, markSkillCourseCompleted } = useApp();

    const skillName = useMemo(() => decodeURIComponent(skillNameParam || ""), [skillNameParam]);
    const skillData = useMemo(() => skills.find((item) => item.name === skillName), [skills, skillName]);
    const progress = skillProgress?.[skillName] || {};

    if (!skillData || !isSkillUnlocked(skillName)) {
        return (
            <div className="sj-page">
                <div className="sj-card">
                    <h2>Skill is unavailable</h2>
                    <button className="sj-btn ghost" onClick={() => navigate("/roadmap")}>Back to Roadmap</button>
                </div>
            </div>
        );
    }

    const handleMarkComplete = () => {
        const res = markSkillCourseCompleted(skillName);
        if (!res.ok) {
            alert(res.msg);
            return;
        }
        alert("Course completion saved. Proceed to quiz.");
        navigate(`/learn/${encodeURIComponent(skillName)}/quiz`);
    };

    return (
        <div className="sj-page">
            <div className="sj-card">
                <div className="sj-header">
                    <div>
                        <h1>{skillName} - Step 2</h1>
                        <p>Confirm your course completion to unlock the skill quiz.</p>
                    </div>
                    <button className="sj-btn ghost" onClick={() => navigate(`/learn/${encodeURIComponent(skillName)}/course`)}>Back</button>
                </div>

                <div className="sj-status">
                    <p>Selected Track: {progress.selectedCourse ? progress.selectedCourse.toUpperCase() : "Not selected"}</p>
                    <p>Course Started: {progress.courseStarted ? "Yes" : "No"}</p>
                    <p>Course Completed: {progress.courseCompleted ? "Yes" : "No"}</p>
                </div>

                <div className="sj-actions">
                    <button className="sj-btn" onClick={handleMarkComplete}>Mark Course as Completed</button>
                    <button
                        className="sj-btn ghost"
                        disabled={!progress.courseCompleted}
                        onClick={() => navigate(`/learn/${encodeURIComponent(skillName)}/quiz`)}
                    >
                        Continue to Step 3 (Quiz)
                    </button>
                </div>
            </div>
        </div>
    );
}
