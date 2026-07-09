import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../AppContext";
import "./SkillJourneyPages.css";

const buildSkillQuiz = (skillName) => [
    {
        question: `What is the best way to begin learning ${skillName}?`,
        options: [
            "Understand core concepts and practice basics",
            "Skip fundamentals and start with advanced topics",
            "Avoid exercises and only watch videos",
            "Memorize answers without projects",
        ],
        answer: "Understand core concepts and practice basics",
    },
    {
        question: `How do you validate your ${skillName} progress?`,
        options: [
            "Complete practical tasks and pass assessments",
            "Only open course links",
            "Read summaries without implementation",
            "Skip testing",
        ],
        answer: "Complete practical tasks and pass assessments",
    },
    {
        question: `What helps you retain ${skillName} knowledge better?`,
        options: [
            "Consistent practice with real examples",
            "One-time learning session only",
            "Avoid revising mistakes",
            "Do not apply concepts",
        ],
        answer: "Consistent practice with real examples",
    },
    {
        question: `When should the next skill unlock in SkillPulse?`,
        options: [
            "After passing the current skill quiz",
            "Immediately after selecting a course",
            "After opening any link",
            "Without completing the course",
        ],
        answer: "After passing the current skill quiz",
    },
];

export default function SkillQuizPage() {
    const { skillName: skillNameParam } = useParams();
    const navigate = useNavigate();
    const { skills, skillProgress, isSkillUnlocked, submitSkillQuiz, allSkillQuizzesPassed } = useApp();

    const skillName = useMemo(() => decodeURIComponent(skillNameParam || ""), [skillNameParam]);
    const skillData = useMemo(() => skills.find((item) => item.name === skillName), [skills, skillName]);
    const progress = skillProgress?.[skillName] || {};

    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const quizQuestions = useMemo(() => buildSkillQuiz(skillName || "this skill"), [skillName]);

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

    const resetQuiz = () => {
        setIdx(0);
        setScore(0);
        setFinished(false);
    };

    const handleAnswer = (option) => {
        let nextScore = score;
        if (option === quizQuestions[idx].answer) {
            nextScore += 1;
            setScore(nextScore);
        }

        const next = idx + 1;
        if (next < quizQuestions.length) {
            setIdx(next);
            return;
        }

        const result = submitSkillQuiz({
            skillName,
            score: nextScore,
            total: quizQuestions.length,
        });

        setFinished(true);

        if (!result.ok) {
            alert(result.msg);
            return;
        }

        if (!result.passed) {
            alert("You need 70% or higher to pass and unlock the next skill.");
            return;
        }

        alert("Great job. Skill passed and next skill unlocked.");
    };

    return (
        <div className="sj-page">
            <div className="sj-card">
                <div className="sj-header">
                    <div>
                        <h1>{skillName} - Step 3</h1>
                        <p>Pass with at least 70% to unlock the next skill.</p>
                    </div>
                    <button className="sj-btn ghost" onClick={() => navigate(`/learn/${encodeURIComponent(skillName)}/complete`)}>Back</button>
                </div>

                <div className="sj-status">
                    <p>Course Completed: {progress.courseCompleted ? "Yes" : "No"}</p>
                    <p>Quiz Status: {progress.quizPassed ? `Passed (${progress.quizScore}/${progress.quizTotal})` : "Pending"}</p>
                </div>

                {!finished ? (
                    <section className="sj-quiz">
                        <p>Question {idx + 1} of {quizQuestions.length}</p>
                        <h3>{quizQuestions[idx].question}</h3>
                        <div className="sj-options">
                            {quizQuestions[idx].options.map((option) => (
                                <button key={option} className="sj-btn" onClick={() => handleAnswer(option)}>{option}</button>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className="sj-quiz">
                        <p>Score: {score}/{quizQuestions.length}</p>
                        <p>{score / quizQuestions.length >= 0.7 ? "Passed. Next skill unlocked." : "Not passed. Retry this quiz."}</p>
                        <div className="sj-actions">
                            <button className="sj-btn" onClick={resetQuiz}>Retry Quiz</button>
                            <button className="sj-btn ghost" onClick={() => navigate("/roadmap")}>Back to Roadmap</button>
                            <button className="sj-btn ghost" disabled={!allSkillQuizzesPassed} onClick={() => navigate("/hero-badge")}>Go Hero Challenge</button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
