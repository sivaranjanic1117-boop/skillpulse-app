import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./ProfileSetupPage.css";

export default function ProfileSetupPage() {
    const { user, completeProfileSetup } = useApp();
    const navigate = useNavigate();

    const initial = useMemo(
        () => ({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            dob: user?.dob || "",
            mobile: user?.mobile || "",
            profileImage: user?.profileImage || "",
        }),
        [user]
    );

    const [formData, setFormData] = useState(initial);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prev) => ({ ...prev, profileImage: String(reader.result || "") }));
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName || !formData.mobile || !formData.dob) {
            alert("Please complete all profile fields.");
            return;
        }

        completeProfileSetup(formData);
        navigate("/dream-role");
    };

    return (
        <div className="profile-setup-page">
            <div className="profile-setup-card">
                <h1>Profile Setup</h1>
                <p>Let us personalize your learning journey before we build your roadmap.</p>

                <form onSubmit={handleSubmit} className="profile-setup-form">
                    <div className="profile-image-field">
                        <div className="profile-image-preview">
                            {formData.profileImage ? <img src={formData.profileImage} alt="Profile preview" /> : <span>Upload photo</span>}
                        </div>
                        <label className="profile-image-upload">
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            Choose Profile Image
                        </label>
                    </div>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                    <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                    <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" />
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

                    <button type="submit">Save Profile & Continue</button>
                </form>
            </div>
        </div>
    );
}
