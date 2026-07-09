import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const ASSESSMENT_LEVELS = ["beginner", "intermediate", "advanced"];

const makeInitialSkillJourney = () => ({
  levels: {
    beginner: { completed: false, assessment: null },
    intermediate: { completed: false, assessment: null },
    advanced: { completed: false, assessment: null },
  },
  certificate: null,
});

const ROLE_CATALOG = [
  {
    match: (job) => job.includes("ai engineer"),
    roleName: "AI Engineer",
    skills: [
      { name: "Python" },
      { name: "Machine Learning" },
      { name: "Deep Learning" },
      { name: "TensorFlow" },
      { name: "OpenCV" },
      { name: "Data Preprocessing" },
      { name: "Neural Networks" },
    ],
  },
  {
    match: (job) => job.includes("frontend developer"),
    roleName: "Frontend Developer",
    skills: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "React" },
      { name: "Responsive Design" },
      { name: "Version Control (Git)" },
      { name: "UI/UX Principles" },
    ],
  },
  {
    match: (job) => job.includes("backend developer") && job.includes("node"),
    roleName: "Backend Developer",
    skills: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "MongoDB" },
      { name: "RESTful APIs" },
      { name: "Authentication & JWT" },
      { name: "Database Design" },
    ],
  },
  {
    match: (job) => job.includes("backend developer") && job.includes("java"),
    roleName: "Backend Developer",
    skills: [
      { name: "Java" },
      { name: "Spring Boot" },
      { name: "MySQL" },
      { name: "REST APIs" },
      { name: "Hibernate" },
      { name: "Microservices" },
    ],
  },
  {
    match: (job) => job.includes("backend developer"),
    roleName: "Backend Developer",
    skills: [
      { name: "Node.js" },
      { name: "Databases (SQL & NoSQL)" },
      { name: "API Design" },
      { name: "Server Management" },
      { name: "Authentication" },
      { name: "Error Handling" },
    ],
  },
  {
    match: (job) => job.includes("full stack developer") && job.includes("mern"),
    roleName: "Full Stack Developer",
    skills: [
      { name: "MongoDB" },
      { name: "Express.js" },
      { name: "React" },
      { name: "Node.js" },
      { name: "Redux" },
      { name: "REST APIs" },
      { name: "Deployment (Vercel/Render)" },
    ],
  },
  {
    match: (job) => job.includes("full stack developer"),
    roleName: "Full Stack Developer",
    skills: [
      { name: "Frontend (HTML, CSS, JS)" },
      { name: "React or Angular" },
      { name: "Backend (Node.js/Java/Python)" },
      { name: "Databases" },
      { name: "APIs & Authentication" },
      { name: "Version Control" },
      { name: "Deployment" },
    ],
  },
  {
    match: (job) => job.includes("ui/ux designer"),
    roleName: "UI/UX Designer",
    skills: [
      { name: "Figma" },
      { name: "Adobe XD" },
      { name: "Wireframing" },
      { name: "Prototyping" },
      { name: "Color Theory" },
      { name: "Typography" },
      { name: "User Research" },
    ],
  },
  {
    match: (job) => job.includes("ml engineer"),
    roleName: "ML Engineer",
    skills: [
      { name: "Python" },
      { name: "Machine Learning Algorithms" },
      { name: "Data Cleaning" },
      { name: "TensorFlow / PyTorch" },
      { name: "Model Evaluation" },
      { name: "MLOps" },
    ],
  },
  {
    match: (job) => job.includes("data scientist") && job.includes("ai"),
    roleName: "AI - Data Scientist",
    skills: [
      { name: "Python" },
      { name: "Pandas & NumPy" },
      { name: "Machine Learning" },
      { name: "Deep Learning" },
      { name: "Data Visualization" },
      { name: "Model Deployment" },
    ],
  },
  {
    match: (job) => job.includes("data scientist"),
    roleName: "Data Scientist",
    skills: [
      { name: "Python / R" },
      { name: "Data Cleaning" },
      { name: "Feature Engineering" },
      { name: "ML Algorithms" },
      { name: "Statistics" },
      { name: "Visualization (Matplotlib, Seaborn)" },
    ],
  },
  {
    match: (job) => job.includes("data analyst"),
    roleName: "Data Analyst",
    skills: [
      { name: "Excel" },
      { name: "SQL" },
      { name: "Python (Pandas, NumPy)" },
      { name: "Data Visualization (Power BI / Tableau)" },
      { name: "Data Cleaning" },
      { name: "Statistics" },
    ],
  },
  {
    match: (job) => job.includes("react developer"),
    roleName: "React Developer",
    skills: [
      { name: "React.js" },
      { name: "JSX" },
      { name: "React Router" },
      { name: "State Management (Redux)" },
      { name: "Hooks" },
      { name: "Context API" },
      { name: "REST APIs" },
    ],
  },
  {
    match: (job) => job.includes("python developer"),
    roleName: "Python Developer",
    skills: [
      { name: "Core Python" },
      { name: "OOPs Concepts" },
      { name: "Django / Flask" },
      { name: "REST APIs" },
      { name: "Database (SQLite/MySQL)" },
      { name: "Error Handling" },
    ],
  },
  {
    match: (job) => job.includes("java developer"),
    roleName: "Java Developer",
    skills: [
      { name: "Core Java" },
      { name: "OOPs" },
      { name: "Spring Boot" },
      { name: "JDBC & Hibernate" },
      { name: "REST APIs" },
      { name: "Maven" },
    ],
  },
  {
    match: (job) => job.includes("cloud engineer"),
    roleName: "Cloud Engineer",
    skills: [
      { name: "AWS / Azure / GCP" },
      { name: "Cloud Networking" },
      { name: "Linux" },
      { name: "CI/CD" },
      { name: "Terraform" },
      { name: "Docker & Kubernetes" },
    ],
  },
  {
    match: (job) => job.includes("software developer"),
    roleName: "Software Developer",
    skills: [
      { name: "Programming (C++, Java, Python)" },
      { name: "Data Structures" },
      { name: "Algorithms" },
      { name: "Version Control" },
      { name: "Problem Solving" },
      { name: "System Design Basics" },
    ],
  },
  {
    match: (job) => job.includes("web developer"),
    roleName: "Web Developer",
    skills: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "React / Angular" },
      { name: "Responsive Design" },
      { name: "APIs" },
    ],
  },
  {
    match: () => true,
    roleName: "Software Developer",
    skills: [
      { name: "Problem Solving" },
      { name: "Communication" },
      { name: "Adaptability" },
      { name: "Teamwork" },
    ],
  },
];

const getLearningResources = (skillName) => {
  const query = encodeURIComponent(skillName);
  return {
    free: {
      label: `Free: ${skillName} on Udemy`,
      url: `https://www.udemy.com/courses/search/?q=${query}&price=price-free`,
    },
    paid: {
      label: `Paid: ${skillName} on Udemy`,
      url: `https://www.udemy.com/courses/search/?q=${query}&price=price-paid`,
    },
  };
};

const withResources = (skills) =>
  skills.map((skill) => ({
    ...skill,
    resources: getLearningResources(skill.name),
  }));

const makeInitialChecked = (skillsList) => {
  const initialChecked = {};
  skillsList.forEach((skill) => {
    initialChecked[skill.name] = false;
  });
  return initialChecked;
};

const getRoleConfig = (jobValue) => {
  const normalized = (jobValue || "").toLowerCase();
  return ROLE_CATALOG.find((entry) => entry.match(normalized)) || ROLE_CATALOG.at(-1);
};

const hasPassedAllAssessments = (results) =>
  ASSESSMENT_LEVELS.every((level) => Boolean(results?.[level]?.passed));

const hasPassedAnyAssessment = (results) =>
  ASSESSMENT_LEVELS.some((level) => Boolean(results?.[level]?.passed));

const hasCompletedAllSkillLevels = (journey) =>
  ASSESSMENT_LEVELS.every((level) => Boolean(journey?.levels?.[level]?.completed));

const canAccessSkillLevel = (journey, level) => {
  if (level === "beginner") return true;
  if (level === "intermediate") return Boolean(journey?.levels?.beginner?.completed);
  if (level === "advanced") return Boolean(journey?.levels?.intermediate?.completed);
  return false;
};

const makeInitialSkillProgress = (skillsList) => {
  const initial = {};
  (skillsList || []).forEach((skill) => {
    initial[skill.name] = {
      selectedCourse: null,
      courseStarted: false,
      courseCompleted: false,
      quizPassed: false,
      quizScore: null,
      quizTotal: null,
    };
  });
  return initial;
};

const getHeroBadgeLevel = (assessmentResults) => {
  if (assessmentResults?.advanced?.passed) return "gold";
  if (assessmentResults?.intermediate?.passed) return "silver";
  if (assessmentResults?.beginner?.passed) return "bronze";
  return null;
};

const getHighestPassedLevel = (assessmentResults) => {
  if (assessmentResults?.advanced?.passed) return "advanced";
  if (assessmentResults?.intermediate?.passed) return "intermediate";
  if (assessmentResults?.beginner?.passed) return "beginner";
  return "none";
};

const canAttemptHeroLevel = (assessmentResults, level) => {
  if (level === "beginner") return true;
  if (level === "intermediate") return Boolean(assessmentResults?.beginner?.passed);
  if (level === "advanced") return Boolean(assessmentResults?.intermediate?.passed);
  return false;
};

export const AppProvider = ({ children }) => {
  // ✅ Load user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [dreamJob, setDreamJob] = useState(() => localStorage.getItem("dreamJob") || "");
  const [roleName, setRoleName] = useState(() => localStorage.getItem("roleName") || "");
  const [skills, setSkills] = useState(() => {
    const savedSkills = localStorage.getItem("skills");
    if (!savedSkills) return [];

    try {
      return withResources(JSON.parse(savedSkills));
    } catch {
      return [];
    }
  });
  const [checked, setChecked] = useState(() => {
    const savedChecked = localStorage.getItem("checked");
    if (!savedChecked) return {};
    try {
      return JSON.parse(savedChecked);
    } catch {
      return {};
    }
  });
  const [assessmentResults, setAssessmentResults] = useState(() => {
    const saved = localStorage.getItem("assessmentResults");
    if (!saved) return {};
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  });
  const [certificate, setCertificate] = useState(() => {
    const saved = localStorage.getItem("certificate");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [skillJourneys, setSkillJourneys] = useState(() => {
    const saved = localStorage.getItem("skillJourneys");
    if (!saved) return {};
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  });
  const [profileSetupDone, setProfileSetupDone] = useState(() => localStorage.getItem("profileSetupDone") === "true");
  const [currentSkillIndex, setCurrentSkillIndex] = useState(() => Number(localStorage.getItem("currentSkillIndex") || 0));
  const [skillProgress, setSkillProgress] = useState(() => {
    const saved = localStorage.getItem("skillProgress");
    if (!saved) return {};
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  });
  const [treasureState, setTreasureState] = useState(() => {
    const saved = localStorage.getItem("treasureState");
    if (!saved) return { tapCount: 0, opened: false };
    try {
      return JSON.parse(saved);
    } catch {
      return { tapCount: 0, opened: false };
    }
  });

  // ✅ Sync user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("dreamJob", dreamJob || "");
  }, [dreamJob]);

  useEffect(() => {
    localStorage.setItem("roleName", roleName || "");
  }, [roleName]);

  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem("checked", JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem("assessmentResults", JSON.stringify(assessmentResults));
  }, [assessmentResults]);

  useEffect(() => {
    if (certificate) localStorage.setItem("certificate", JSON.stringify(certificate));
    else localStorage.removeItem("certificate");
  }, [certificate]);

  useEffect(() => {
    localStorage.setItem("skillJourneys", JSON.stringify(skillJourneys));
  }, [skillJourneys]);

  useEffect(() => {
    localStorage.setItem("profileSetupDone", String(profileSetupDone));
  }, [profileSetupDone]);

  useEffect(() => {
    localStorage.setItem("currentSkillIndex", String(currentSkillIndex));
  }, [currentSkillIndex]);

  useEffect(() => {
    localStorage.setItem("skillProgress", JSON.stringify(skillProgress));
  }, [skillProgress]);

  useEffect(() => {
    localStorage.setItem("treasureState", JSON.stringify(treasureState));
  }, [treasureState]);

  // ✅ Skill generator for all roles
  const generateSkills = () => {
    if (!dreamJob.trim()) return { ok: false, msg: "Please enter a dream job" };

    const roleConfig = getRoleConfig(dreamJob);
    const generatedSkills = withResources(roleConfig.skills);

    setRoleName(roleConfig.roleName);
    setSkills(generatedSkills);
    setChecked(makeInitialChecked(generatedSkills));
    setAssessmentResults({});
    setCertificate(null);
    setSkillJourneys({});
    setCurrentSkillIndex(0);
    setSkillProgress(makeInitialSkillProgress(generatedSkills));
    setTreasureState({ tapCount: 0, opened: false });

    localStorage.setItem("selectedRole", roleConfig.roleName);

    return { ok: true };
  };

  const handleCheck = (skillName) => {
    setChecked((prev) => ({ ...prev, [skillName]: !prev[skillName] }));
  };

  const resetProgress = () => {
    setChecked(makeInitialChecked(skills));
    setAssessmentResults({});
    setCertificate(null);
    setSkillJourneys({});
    setCurrentSkillIndex(0);
    setSkillProgress(makeInitialSkillProgress(skills));
    setTreasureState({ tapCount: 0, opened: false });
  };

  const completeProfileSetup = (profileData) => {
    const mergedUser = { ...user, ...profileData };
    if (!mergedUser.name) {
      mergedUser.name = `${mergedUser.firstName || ""} ${mergedUser.lastName || ""}`.trim();
    }

    setUser(mergedUser);
    setProfileSetupDone(true);

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = allUsers.map((u) => (u.email === mergedUser.email ? mergedUser : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    return { ok: true };
  };

  const selectSkillCourse = (skillName, courseType) => {
    setSkillProgress((prev) => ({
      ...prev,
      [skillName]: {
        ...(prev[skillName] || {}),
        selectedCourse: courseType,
        courseStarted: true,
      },
    }));
  };

  const markSkillCourseCompleted = (skillName) => {
    if (!skillProgress?.[skillName]?.selectedCourse) {
      return { ok: false, msg: "Choose a free or paid Udemy course first." };
    }

    setSkillProgress((prev) => ({
      ...prev,
      [skillName]: {
        ...(prev[skillName] || {}),
        courseCompleted: true,
      },
    }));

    return { ok: true };
  };

  const isSkillUnlocked = (skillName) => {
    const idx = skills.findIndex((s) => s.name === skillName);
    return idx >= 0 && idx <= currentSkillIndex;
  };

  const submitSkillQuiz = ({ skillName, score, total }) => {
    const progress = skillProgress[skillName];
    if (!progress?.courseCompleted) {
      return { ok: false, passed: false, msg: "Complete the selected course first." };
    }

    const passed = total > 0 && score / total >= 0.7;
    const skillIdx = skills.findIndex((s) => s.name === skillName);

    setSkillProgress((prev) => ({
      ...prev,
      [skillName]: {
        ...(prev[skillName] || {}),
        quizPassed: passed,
        quizScore: score,
        quizTotal: total,
      },
    }));

    if (!passed) return { ok: true, passed: false };

    setChecked((prev) => ({ ...prev, [skillName]: true }));
    if (skillIdx === currentSkillIndex) {
      setCurrentSkillIndex((prev) => Math.min(prev + 1, Math.max(skills.length - 1, 0)));
    }

    return { ok: true, passed: true };
  };

  const getSkillJourney = (skillName) => {
    if (!skillName) return makeInitialSkillJourney();
    return skillJourneys[skillName] || makeInitialSkillJourney();
  };

  const completeSkillLevelAssessment = ({ skillName, level, score, total }) => {
    const normalizedLevel = (level || "").toLowerCase();
    const passed = total > 0 && score / total >= 0.7;

    let result = { passed, unlockedNext: false };

    setSkillJourneys((prev) => {
      const currentJourney = prev[skillName] || makeInitialSkillJourney();
      if (!canAccessSkillLevel(currentJourney, normalizedLevel)) {
        result = { passed: false, unlockedNext: false, blocked: true };
        return prev;
      }

      const updatedJourney = {
        ...currentJourney,
        levels: {
          ...currentJourney.levels,
          [normalizedLevel]: {
            completed: passed,
            assessment: {
              passed,
              score,
              total,
              completedAt: new Date().toISOString(),
            },
          },
        },
      };

      result = {
        passed,
        unlockedNext:
          (normalizedLevel === "beginner" && updatedJourney.levels.intermediate.completed === false) ||
          (normalizedLevel === "intermediate" && updatedJourney.levels.advanced.completed === false),
      };

      return { ...prev, [skillName]: updatedJourney };
    });

    if (passed && normalizedLevel === "advanced") {
      setChecked((prev) => ({ ...prev, [skillName]: true }));
    }

    return result;
  };

  const issueSkillCertificate = (skillName) => {
    if (!skillName) return { ok: false, msg: "Skill not found." };

    const journey = skillJourneys[skillName] || makeInitialSkillJourney();
    if (!hasCompletedAllSkillLevels(journey)) {
      return { ok: false, msg: "Complete Beginner, Intermediate, and Advanced levels first." };
    }

    const learnerName =
      user?.name ||
      (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.email || "Learner");

    const generatedCertificate = {
      id: `SKILL-CERT-${Date.now()}`,
      learnerName,
      roleName: roleName || dreamJob,
      skillName,
      profileImage: user?.profileImage || null,
      issuedAt: new Date().toISOString(),
    };

    setSkillJourneys((prev) => ({
      ...prev,
      [skillName]: {
        ...(prev[skillName] || makeInitialSkillJourney()),
        certificate: generatedCertificate,
      },
    }));

    return { ok: true, certificate: generatedCertificate };
  };

  const completeAssessment = (level, score, total) => {
    const normalizedLevel = (level || "").toLowerCase();
    if (!canAttemptHeroLevel(assessmentResults, normalizedLevel)) {
      return false;
    }

    const passed = total > 0 && score / total >= 0.7;

    setAssessmentResults((prev) => ({
      ...prev,
      [normalizedLevel]: {
        passed,
        score,
        total,
        completedAt: new Date().toISOString(),
      },
    }));

    return passed;
  };

  const allSkillsCompleted = skills.length > 0 && skills.every((skill) => checked[skill.name]);
  const allAssessmentsPassed = hasPassedAllAssessments(assessmentResults);
  const hasAnyAssessmentPassed = hasPassedAnyAssessment(assessmentResults);
  const heroBadgeLevel = getHeroBadgeLevel(assessmentResults);
  const allSkillQuizzesPassed =
    skills.length > 0 &&
    skills.every((skill) => Boolean(skillProgress?.[skill.name]?.quizPassed));
  const canIssueCertificate = allSkillQuizzesPassed && hasAnyAssessmentPassed;

  const tapTreasure = () => {
    if (!canIssueCertificate && !certificate) {
      return { opened: false, tapCount: treasureState.tapCount };
    }

    const nextTap = treasureState.tapCount + 1;
    const opened = nextTap >= 2;
    const nextState = { tapCount: nextTap, opened };
    setTreasureState(nextState);
    return nextState;
  };

  const resetTreasure = () => setTreasureState({ tapCount: 0, opened: false });

  const issueCertificate = () => {
    if (!canIssueCertificate) {
      return { ok: false, msg: "Complete all skill quizzes and pass at least one assessment level first." };
    }

    const learnerName =
      user?.name ||
      (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.email || "Learner");

    const generatedCertificate = {
      id: `CERT-${Date.now()}`,
      learnerName,
      roleName: roleName || dreamJob,
      badgeAwarded: getHeroBadgeLevel(assessmentResults),
      highestLevelPassed: getHighestPassedLevel(assessmentResults),
      profileImage: user?.profileImage || null,
      issuedAt: new Date().toISOString(),
    };

    setCertificate(generatedCertificate);
    return { ok: true, certificate: generatedCertificate };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        dreamJob,
        setDreamJob,
        roleName,
        skills,
        checked,
        assessmentResults,
        certificate,
        skillJourneys,
        profileSetupDone,
        currentSkillIndex,
        skillProgress,
        treasureState,
        allSkillsCompleted,
        allAssessmentsPassed,
        hasAnyAssessmentPassed,
        allSkillQuizzesPassed,
        heroBadgeLevel,
        canIssueCertificate,
        assessmentLevels: ASSESSMENT_LEVELS,
        generateSkills,
        completeProfileSetup,
        handleCheck,
        resetProgress,
        selectSkillCourse,
        markSkillCourseCompleted,
        submitSkillQuiz,
        isSkillUnlocked,
        completeAssessment,
        issueCertificate,
        canAttemptHeroLevel,
        tapTreasure,
        resetTreasure,
        getSkillJourney,
        completeSkillLevelAssessment,
        issueSkillCertificate,
        canAccessSkillLevel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
