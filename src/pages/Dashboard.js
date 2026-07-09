import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Send, 
  Sparkles,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import "./Dashboard.css";

const QUICK_PROMPTS = [
  "How do I start roadmap?",
  "How to unlock hero badge?",
  "When do I get certificate?",
  "I failed quiz. What next?",
  "Suggest a course for React",
];

const COURSE_DATABASE = {
  react: [
    { name: "React - The Complete Guide", rating: 4.8, reviews: 1200, price: "$14.99", level: "Beginner to Advanced" },
    { name: "Advanced React Patterns", rating: 4.7, reviews: 850, price: "$12.99", level: "Intermediate" },
  ],
  python: [
    { name: "Complete Python Bootcamp", rating: 4.9, reviews: 2500, price: "$14.99", level: "Beginner" },
    { name: "Python for Data Science", rating: 4.7, reviews: 1800, price: "$12.99", level: "Intermediate" },
  ],
  javascript: [
    { name: "The Complete JavaScript Course", rating: 4.8, reviews: 1600, price: "$14.99", level: "Beginner" },
    { name: "JavaScript Advanced", rating: 4.6, reviews: 920, price: "$11.99", level: "Advanced" },
  ],
  html: [
    { name: "HTML & CSS: The Complete Guide", rating: 4.8, reviews: 2000, price: "$14.99", level: "Beginner" },
  ],
  css: [
    { name: "Advanced CSS Masterclass", rating: 4.7, reviews: 1100, price: "$12.99", level: "Intermediate" },
  ],
  nodejs: [
    { name: "Complete Node.js Developer Course", rating: 4.8, reviews: 1400, price: "$14.99", level: "Beginner to Advanced" },
  ],
  mongodb: [
    { name: "MongoDB - The Complete Developer's Guide", rating: 4.7, reviews: 980, price: "$12.99", level: "Intermediate" },
  ],
  "machine learning": [
    { name: "Machine Learning A-Z", rating: 4.8, reviews: 2100, price: "$14.99", level: "Intermediate" },
  ],
};

const suggestCourse = (skillName) => {
  const normalized = skillName.toLowerCase().trim();
  const courses = COURSE_DATABASE[normalized] || [];

  if (!courses.length) {
    return `I don't have course suggestions for "${skillName}" yet, but you can search Udemy directly. Look for courses with 4.5+ ratings and recent reviews.`;
  }

  const top = courses[0];
  return `I recommend "${top.name}" (⭐ ${top.rating} • ${top.reviews} reviews • ${top.price}). Level: ${top.level}. Search on Udemy to enroll!`;
};

const getBotReply = (text) => {
  const q = text.toLowerCase();

  if (q.includes("course") || q.includes("udemy") || q.includes("suggest")) {
    const skillMatch = Object.keys(COURSE_DATABASE).find((skill) => q.includes(skill));
    if (skillMatch) {
      return suggestCourse(skillMatch);
    }
    return "Which skill would you like a course for? (e.g., React, Python, JavaScript, Node.js, MongoDB)";
  }

  if (q.includes("roadmap") || q.includes("start")) {
    return "Enter your dream role and click Generate Roadmap. Then complete each skill course and quiz step by step.";
  }

  if (q.includes("hero") || q.includes("badge") || q.includes("treasure")) {
    return "To unlock Hero Badge, pass all skill quizzes first, then complete Hero challenge levels. Open the treasure box to reveal the badge.";
  }

  if (q.includes("certificate") || q.includes("cert")) {
    return "Certificate is available after all skill quizzes are done and at least one hero assessment level is passed.";
  }

  if (q.includes("fail") || q.includes("failed") || q.includes("retry")) {
    return "No worries. Retry the quiz and aim for 70% or above. You can keep practicing until you pass.";
  }

  if (q.includes("level") || q.includes("beginner") || q.includes("intermediate") || q.includes("advanced")) {
    return "Hero levels are sequential: Beginner -> Intermediate -> Advanced. Pass one to unlock the next.";
  }

  return "I can help with roadmap, quizzes, hero badge, certificate, or course suggestions on Udemy. Ask me anything!";
};

export default function Dashboard() {
  const {
    dreamJob,
    setDreamJob,
    generateSkills,
    user,
    skills,
    skillProgress,
    assessmentResults,
    heroBadgeLevel,
    certificate,
    skillJourneys
  } = useApp();
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I am your SkillPulse helper. Ask about roadmap, quiz retries, hero badge, or certificate.",
    },
  ]);

  const handleGenerate = () => {
    if (!dreamJob.trim()) {
      alert("Please enter your dream job!");
      return;
    }

    localStorage.setItem("selectedJob", dreamJob);

    const res = generateSkills();
    if (res.ok) navigate("/roadmap");
    else alert(res.msg);
  };

  const pushChat = (text) => {
    if (!text.trim()) return;

    const userText = text.trim();
    const botText = getBotReply(userText);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "bot", text: botText },
    ]);
    setChatInput("");
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    pushChat(chatInput);
  };

  const progressValue = (score, total) => {
    if (!total) return 0;
    return Math.round((score / total) * 100);
  };

  const skillProgressItems = useMemo(
    () =>
      skills.map((skill) => {
        const result = skillProgress?.[skill.name] || {};
        return {
          label: skill.name,
          score: result.quizScore,
          total: result.quizTotal,
          percent: progressValue(result.quizScore || 0, result.quizTotal || 0),
          status: result.quizPassed
            ? "Passed"
            : result.quizTotal
              ? "Retry required"
              : "Not started",
        };
      }),
    [skills, skillProgress]
  );

  const assessmentProgressItems = useMemo(() => {
    const levels = ["beginner", "intermediate", "advanced"];
    return levels.map((level) => {
      const result = assessmentResults?.[level] || {};
      return {
        label: `${level.charAt(0).toUpperCase()}${level.slice(1)}`,
        score: result.score,
        total: result.total,
        percent: progressValue(result.score || 0, result.total || 0),
        status: result.passed
          ? "Passed"
          : result.total
            ? "Retry required"
            : "Not started",
      };
    });
  }, [assessmentResults]);

  const enrolledCoursesCount = useMemo(() => {
    if (!skills.length) return 0;
    return skills.filter(s => skillProgress?.[s.name]?.courseStarted).length || 0;
  }, [skills, skillProgress]);

  const completedCoursesCount = useMemo(() => {
    if (!skills.length) return 0;
    return skills.filter(s => skillProgress?.[s.name]?.quizPassed).length || 0;
  }, [skills, skillProgress]);

  const learningProgressPercent = useMemo(() => {
    if (!skills.length) return 0;
    const completed = skills.filter(s => skillProgress?.[s.name]?.quizPassed).length || 0;
    return Math.round((completed / skills.length) * 100);
  }, [skills, skillProgress]);

  const certificatesEarnedCount = useMemo(() => {
    let count = certificate ? 1 : 0;
    if (skillJourneys) {
      count += Object.values(skillJourneys).filter(j => j?.certificate).length;
    }
    return count;
  }, [certificate, skillJourneys]);

  const batchName = useMemo(() => {
    const role = localStorage.getItem("selectedRole") || dreamJob || "";
    if (!role) return "NO ACTIVE BATCH";
    const formatted = role.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
    return `${formatted}-COHORT-A`;
  }, [dreamJob]);

  const passedSkillsCount = skillProgressItems.filter((item) => item.status === "Passed").length;
  const passedAssessmentsCount = assessmentProgressItems.filter((item) => item.status === "Passed").length;

  const displayName =
    user?.name ||
    (user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user?.email || "Guest");

  return (
    <div className="dashboard-container">
      {/* 🚀 Welcome Header Section */}
      <header className="dashboard-header-block">
        <div className="welcome-meta">
          <span className="welcome-pill">Enterprise Learning Dashboard</span>
          <h1 className="welcome-title">Welcome back, {displayName}!</h1>
          <p className="welcome-desc">
            Define your dream career path, select Udemy courses, and test your skills to earn certifications.
          </p>
        </div>
        
        {/* Setup / Change dream role form */}
        <div className="role-setup-panel">
          <h3>Set Career Pathway</h3>
          <div className="role-setup-form-row">
            <input
              className="input"
              type="text"
              placeholder="e.g., Python Developer"
              value={dreamJob}
              onChange={(e) => setDreamJob(e.target.value)}
            />
            <button className="btn primary" onClick={handleGenerate}>
              <Sparkles size={16} />
              <span>Generate Roadmap</span>
            </button>
          </div>
          <span className="hint">Generating a new pathway resets your current active roadmap.</span>
        </div>
      </header>

      {/* 📊 Summary Cards Grid */}
      <section className="summary-cards-grid" aria-label="Learning Metrics Overview">
        {/* Enrolled Courses */}
        <div className="summary-card">
          <div className="summary-card-header">
            <span className="summary-icon-wrapper blue">
              <BookOpen size={22} />
            </span>
            <span className="summary-card-tag">LMS Courses</span>
          </div>
          <div className="summary-card-body">
            <h2 className="summary-value">{enrolledCoursesCount} / {skills.length || 0}</h2>
            <p className="summary-label">Enrolled Pathways</p>
          </div>
          <div className="summary-card-footer">
            <span className="trend-text positive">{skills.length - enrolledCoursesCount} courses not started</span>
          </div>
        </div>

        {/* Completed Courses */}
        <div className="summary-card">
          <div className="summary-card-header">
            <span className="summary-icon-wrapper green">
              <CheckCircle2 size={22} />
            </span>
            <span className="summary-card-tag">Completed</span>
          </div>
          <div className="summary-card-body">
            <h2 className="summary-value">{completedCoursesCount}</h2>
            <p className="summary-label">Skills Validated</p>
          </div>
          <div className="summary-card-footer">
            <span className="trend-text positive">{skills.length ? `${skills.length - completedCoursesCount} left to master` : "Define your role"}</span>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="summary-card">
          <div className="summary-card-header">
            <span className="summary-icon-wrapper indigo">
              <TrendingUp size={22} />
            </span>
            <span className="summary-card-tag">Progress</span>
          </div>
          <div className="summary-card-body">
            <h2 className="summary-value">{learningProgressPercent}%</h2>
            <p className="summary-label">Curriculum Done</p>
          </div>
          <div className="summary-card-footer">
            <div className="mini-progress-bar">
              <div className="mini-progress-fill" style={{ width: `${learningProgressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Certificates Earned */}
        <div className="summary-card">
          <div className="summary-card-header">
            <span className="summary-icon-wrapper gold">
              <Award size={22} />
            </span>
            <span className="summary-card-tag">Credentials</span>
          </div>
          <div className="summary-card-body">
            <h2 className="summary-value">{certificatesEarnedCount}</h2>
            <p className="summary-label">Certificates Earned</p>
          </div>
          <div className="summary-card-footer">
            <span className="trend-text positive">Verified on blockchain</span>
          </div>
        </div>

        {/* Current Batch */}
        <div className="summary-card span-two-cols">
          <div className="summary-card-header">
            <span className="summary-icon-wrapper red">
              <Users size={22} />
            </span>
            <span className="summary-card-tag">Academic Batch</span>
          </div>
          <div className="summary-card-body">
            <h2 className="summary-value">{batchName}</h2>
            <p className="summary-label">Corporate Class Assignment</p>
          </div>
          <div className="summary-card-footer">
            <span className="status-indicator active">Cohort Active</span>
          </div>
        </div>
      </section>

      {/* 🚀 Main Progress Panels & AI Chatbot */}
      <div className="dashboard-content-split">
        {/* Progress Tracking Details */}
        <section className="progress-details-panel">
          <div className="panel-header">
            <h2>Detailed Pathway Progress</h2>
            <p>Live status tracker of your role-based skill validation steps.</p>
          </div>

          <div className="skills-progress-list">
            {skillProgressItems.length ? (
              skillProgressItems.map((item) => (
                <div key={item.label} className="progress-track-item">
                  <div className="track-info">
                    <span className="track-name">{item.label}</span>
                    <span className="track-score">
                      {item.total ? `${item.score}/${item.total} Qs` : "Unattempted"}
                    </span>
                  </div>
                  <div className="track-bar-wrapper">
                    <div className="track-bar-fill" style={{ width: `${item.percent}%` }} />
                  </div>
                  <div className="track-meta">
                    <span className={`status-badge-inline ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                    <span className="track-percent">{item.percent}% Score</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-roadmap-state">
                <HelpCircle size={36} />
                <p>No active roadmap found. Set a career pathway above to get started.</p>
              </div>
            )}
          </div>

          {/* Hero levels mini assessment indicators */}
          {skills.length > 0 && (
            <div className="hero-status-subpanel">
              <h4>Hero Badge Assessments</h4>
              <div className="hero-assessment-cards-row">
                {assessmentProgressItems.map((item) => (
                  <div key={item.label} className="hero-progress-mini-card">
                    <div className="card-top">
                      <span className="lvl-label">{item.label} Level</span>
                      <span className={`status-dot ${item.status.toLowerCase().replace(/\s+/g, '-')}`} />
                    </div>
                    <strong>{item.total ? `Passed (${item.score}/${item.total})` : "Locked"}</strong>
                    <span className="status-lbl">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* AI Learning Assistant */}
        <section className="chatbot-panel">
          <div className="panel-header">
            <div className="title-row">
              <MessageSquare size={18} className="chatbot-icon" />
              <h2>SkillPulse Assistant</h2>
            </div>
            <p>Get instant support on course recommendations and certification requirements.</p>
          </div>

          {/* Quick chip queries */}
          <div className="quick-queries-row">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="query-chip"
                onClick={() => pushChat(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="chatbot-messages-container" role="log">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-bubble ${msg.role}`}>
                <div className="avatar">
                  {msg.role === "bot" ? "🤖" : "👤"}
                </div>
                <div className="message-content">
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Typing Form */}
          <form className="chatbot-input-form" onSubmit={handleChatSubmit}>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me: Suggest a course for React..."
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" aria-label="Send message">
              <Send size={16} />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
