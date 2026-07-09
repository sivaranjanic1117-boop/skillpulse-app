import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./DreamRolePage.css";

export default function DreamRolePage() {
    const { profileSetupDone, dreamJob, setDreamJob, generateSkills } = useApp();
    const navigate = useNavigate();

    if (!profileSetupDone) {
        return (
            <div className="dream-role-page">
                <div className="dream-role-card">
                    <h2>Complete profile setup first</h2>
                    <button onClick={() => navigate("/setup-profile")}>Go To Profile Setup</button>
                </div>
            </div>
        );
    }

    const handleGenerate = () => {
        const res = generateSkills();
        if (!res.ok) {
            alert(res.msg);
            return;
        }
        navigate("/roadmap");
    };

    return (
        <div className="dream-role-page">
            <div className="dream-role-card">
                <h1>Choose Your Dream Role</h1>
                <p>Enter your target role to generate a professional roadmap.</p>

                <div className="dream-role-row">
                    <input
                        type="text"
                        value={dreamJob}
                        onChange={(e) => setDreamJob(e.target.value)}
                        placeholder="e.g., Frontend Developer"
                    />
                    <button onClick={handleGenerate}>Generate Roadmap</button>
                </div>
            </div>
        </div>
    );
}
