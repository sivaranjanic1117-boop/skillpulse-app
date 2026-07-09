import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import quizDatabase from "../data/quizDatabase";
import { Rocket, TrendingUp, Trophy } from "lucide-react";
import { useApp } from "../AppContext";
import "./QuizPage.css";

export default function QuizPage(props) {
  const { level: routeLevel } = useParams();
  const { completeAssessment } = useApp();
  const roleProp = props.role;
  const roleFromStorage =
    typeof window !== "undefined" ? localStorage.getItem("selectedRole") : null;
  const role = roleProp || roleFromStorage || "AI Engineer";

  const normalizeLevel = (incomingLevel) => {
    const raw = (incomingLevel || "beginner").toLowerCase();
    if (raw === "final") return "advanced";
    return raw;
  };

  const [level, setLevel] = useState(normalizeLevel(routeLevel));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const normalizedRole = useMemo(() => {
    const keys = Object.keys(quizDatabase);
    const found = keys.find((k) => k.toLowerCase() === role.toLowerCase());
    return found || role;
  }, [role]);

  const questions = quizDatabase?.[normalizedRole]?.[level] || [];

  const handleAnswer = (option) => {
    if (!questions.length) return;

    let nextScore = score;
    if (option === questions[idx].answer) {
      nextScore = score + 1;
      setScore(nextScore);
    }

    const nextIndex = idx + 1;
    if (nextIndex < questions.length) {
      setIdx(nextIndex);
    } else {
      completeAssessment(level, nextScore, questions.length);
      setFinished(true);
    }
  };

  // ✅ Restart quiz
  const resetRun = () => {
    setIdx(0);
    setScore(0);
    setFinished(false);
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    resetRun();
  };

  if (!questions.length) {
    return (
      <div className="quiz-container">
        <h2 className="quiz-title">
          No quiz found for <span className="accent">{role}</span>
        </h2>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">
        {normalizedRole} — {level.toUpperCase()} Quiz
      </h1>

      {!finished ? (
        <div className="question-box">
          <p className="question-number">
            Question {idx + 1} / {questions.length}
          </p>
          <h3 className="question-text">{questions[idx].question}</h3>

          <div className="option-buttons">
            {questions[idx].options.map((opt, i) => (
              <button key={i} className="option-btn" onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="result-box">
          <h2>🎉 Quiz Completed!</h2>
          <p>
            Your Score: {score} / {questions.length}
          </p>
          <p>
            Status: {score / questions.length >= 0.7 ? "Passed" : "Retry required (minimum 70%)"}
          </p>
          <button onClick={resetRun} className="level-btn active">
            Retry
          </button>

        </div>
      )}

      {/* ✅ Level Buttons (same background design) */}
      <div className="level-buttons">
        <button
          className={`level-btn ${level === "beginner" ? "active" : ""}`}
          onClick={() => handleLevelChange("beginner")}
        >
          <Rocket size={18} className="icon" /> Beginner
        </button>
        <button
          className={`level-btn ${level === "intermediate" ? "active" : ""}`}
          onClick={() => handleLevelChange("intermediate")}
        >
          <TrendingUp size={18} className="icon" /> Intermediate
        </button>
        <button
          className={`level-btn ${level === "advanced" ? "active" : ""}`}
          onClick={() => handleLevelChange("advanced")}
        >
          <Trophy size={18} className="icon" /> Advanced
        </button>
      </div>
    </div>
  );
}
