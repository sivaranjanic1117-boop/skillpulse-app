import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ✅ Load user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [dreamJob, setDreamJob] = useState("");
  const [skills, setSkills] = useState([]);
  const [checked, setChecked] = useState({});

  // ✅ Sync user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // ✅ Skill generator for all roles
  const generateSkills = () => {
    if (!dreamJob.trim()) return { ok: false, msg: "Please enter a dream job" };

    const job = dreamJob.toLowerCase();
    let generatedSkills = [];

    if (job.includes("ai engineer")) {
      generatedSkills = [
        { name: "Python" },
        { name: "Machine Learning" },
        { name: "Deep Learning" },
        { name: "TensorFlow" },
        { name: "OpenCV" },
        { name: "Data Preprocessing" },
        { name: "Neural Networks" },
      ];
    } else if (job.includes("frontend developer")) {
      generatedSkills = [
        { name: "HTML" },
        { name: "CSS" },
        { name: "JavaScript" },
        { name: "React" },
        { name: "Responsive Design" },
        { name: "Version Control (Git)" },
        { name: "UI/UX Principles" },
      ];
    } else if (job.includes("backend developer") && job.includes("node")) {
      generatedSkills = [
        { name: "Node.js" },
        { name: "Express.js" },
        { name: "MongoDB" },
        { name: "RESTful APIs" },
        { name: "Authentication & JWT" },
        { name: "Database Design" },
      ];
    } else if (job.includes("backend developer") && job.includes("java")) {
      generatedSkills = [
        { name: "Java" },
        { name: "Spring Boot" },
        { name: "MySQL" },
        { name: "REST APIs" },
        { name: "Hibernate" },
        { name: "Microservices" },
      ];
    } else if (job.includes("backend developer")) {
      generatedSkills = [
        { name: "Node.js" },
        { name: "Databases (SQL & NoSQL)" },
        { name: "API Design" },
        { name: "Server Management" },
        { name: "Authentication" },
        { name: "Error Handling" },
      ];
    } else if (job.includes("full stack developer") && job.includes("mern")) {
      generatedSkills = [
        { name: "MongoDB" },
        { name: "Express.js" },
        { name: "React" },
        { name: "Node.js" },
        { name: "Redux" },
        { name: "REST APIs" },
        { name: "Deployment (Vercel/Render)" },
      ];
    } else if (job.includes("full stack developer")) {
      generatedSkills = [
        { name: "Frontend (HTML, CSS, JS)" },
        { name: "React or Angular" },
        { name: "Backend (Node.js/Java/Python)" },
        { name: "Databases" },
        { name: "APIs & Authentication" },
        { name: "Version Control" },
        { name: "Deployment" },
      ];
    } else if (job.includes("ui/ux designer")) {
      generatedSkills = [
        { name: "Figma" },
        { name: "Adobe XD" },
        { name: "Wireframing" },
        { name: "Prototyping" },
        { name: "Color Theory" },
        { name: "Typography" },
        { name: "User Research" },
      ];
    } else if (job.includes("ml engineer")) {
      generatedSkills = [
        { name: "Python" },
        { name: "Machine Learning Algorithms" },
        { name: "Data Cleaning" },
        { name: "TensorFlow / PyTorch" },
        { name: "Model Evaluation" },
        { name: "MLOps" },
      ];
    } else if (job.includes("data scientist") && job.includes("ai")) {
      generatedSkills = [
        { name: "Python" },
        { name: "Pandas & NumPy" },
        { name: "Machine Learning" },
        { name: "Deep Learning" },
        { name: "Data Visualization" },
        { name: "Model Deployment" },
      ];
    } else if (job.includes("data scientist")) {
      generatedSkills = [
        { name: "Python / R" },
        { name: "Data Cleaning" },
        { name: "Feature Engineering" },
        { name: "ML Algorithms" },
        { name: "Statistics" },
        { name: "Visualization (Matplotlib, Seaborn)" },
      ];
    } else if (job.includes("data analyst")) {
      generatedSkills = [
        { name: "Excel" },
        { name: "SQL" },
        { name: "Python (Pandas, NumPy)" },
        { name: "Data Visualization (Power BI / Tableau)" },
        { name: "Data Cleaning" },
        { name: "Statistics" },
      ];
    } else if (job.includes("react developer")) {
      generatedSkills = [
        { name: "React.js" },
        { name: "JSX" },
        { name: "React Router" },
        { name: "State Management (Redux)" },
        { name: "Hooks" },
        { name: "Context API" },
        { name: "REST APIs" },
      ];
    } else if (job.includes("python developer")) {
      generatedSkills = [
        { name: "Core Python" },
        { name: "OOPs Concepts" },
        { name: "Django / Flask" },
        { name: "REST APIs" },
        { name: "Database (SQLite/MySQL)" },
        { name: "Error Handling" },
      ];
    } else if (job.includes("java developer")) {
      generatedSkills = [
        { name: "Core Java" },
        { name: "OOPs" },
        { name: "Spring Boot" },
        { name: "JDBC & Hibernate" },
        { name: "REST APIs" },
        { name: "Maven" },
      ];
    } else if (job.includes("cloud engineer")) {
      generatedSkills = [
        { name: "AWS / Azure / GCP" },
        { name: "Cloud Networking" },
        { name: "Linux" },
        { name: "CI/CD" },
        { name: "Terraform" },
        { name: "Docker & Kubernetes" },
      ];
    } else if (job.includes("software developer")) {
      generatedSkills = [
        { name: "Programming (C++, Java, Python)" },
        { name: "Data Structures" },
        { name: "Algorithms" },
        { name: "Version Control" },
        { name: "Problem Solving" },
        { name: "System Design Basics" },
      ];
    } else if (job.includes("web developer")) {
      generatedSkills = [
        { name: "HTML" },
        { name: "CSS" },
        { name: "JavaScript" },
        { name: "React / Angular" },
        { name: "Responsive Design" },
        { name: "APIs" },
      ];
    } else {
      generatedSkills = [
        { name: "Problem Solving" },
        { name: "Communication" },
        { name: "Adaptability" },
        { name: "Teamwork" },
      ];
    }

    // ✅ Save in localStorage
    localStorage.setItem("dreamJob", dreamJob);
    localStorage.setItem("skills", JSON.stringify(generatedSkills));

    setSkills(generatedSkills);

    // Reset checkbox states
    const initialChecked = {};
    generatedSkills.forEach((s) => (initialChecked[s.name] = false));
    setChecked(initialChecked);

    return { ok: true };
  };

  const handleCheck = (skillName) => {
    setChecked((prev) => ({ ...prev, [skillName]: !prev[skillName] }));
  };

  const resetProgress = () => {
    const reset = {};
    skills.forEach((s) => (reset[s.name] = false));
    setChecked(reset);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        dreamJob,
        setDreamJob,
        skills,
        checked,
        generateSkills,
        handleCheck,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
