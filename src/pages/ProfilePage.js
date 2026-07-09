import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, setUser, certificate, roleName, dreamJob, skills, skillProgress, assessmentResults, heroBadgeLevel } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "",
  });

  const navigate = useNavigate();

  const completedCoursesCount = useMemo(
    () => (skills || []).filter((skill) => skillProgress?.[skill.name]?.quizPassed).length,
    [skills, skillProgress]
  );

  const passedAssessmentsCount = useMemo(
    () => Object.values(assessmentResults || {}).filter((attempt) => attempt?.passed).length,
    [assessmentResults]
  );

  const profileName =
    user?.name ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.email || "Learner");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, profileImage: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setUser({ ...user, ...formData });
    setEditMode(false);
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>

        <div className="profile-layout">
          <aside className="profile-identity-panel">
            <div className="profile-avatar-block">
              <div className="profile-avatar-preview">
                {formData.profileImage ? <img src={formData.profileImage} alt="Profile preview" /> : <span>{profileName.slice(0, 1).toUpperCase()}</span>}
              </div>
              <label className="profile-avatar-upload">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                Upload Profile Image
              </label>
            </div>

            <div className="profile-meta-grid">
              <div className="profile-meta-item">
                <span>Name</span>
                <span>{profileName}</span>
              </div>
              <div className="profile-meta-item">
                <span>Role</span>
                <span>{roleName || dreamJob || "Not set"}</span>
              </div>
              <div className="profile-meta-item">
                <span>Completed Courses</span>
                <span>{completedCoursesCount}</span>
              </div>
              <div className="profile-meta-item">
                <span>Certificates</span>
                <span>{certificate ? 1 : 0}</span>
              </div>
              <div className="profile-meta-item">
                <span>Hero Badge</span>
                <span>{heroBadgeLevel ? heroBadgeLevel.toUpperCase() : "Pending"}</span>
              </div>
            </div>
          </aside>

          <section className="profile-details-panel">
            {editMode ? (
              <>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <div className="profile-actions-row">
                  <button onClick={handleSave}>Save Changes</button>
                  <button onClick={() => setEditMode(false)} className="logout-btn">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="profile-actions-row">
                  <button onClick={() => setEditMode(true)}>Edit Profile</button>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>

                <div className="achievement-grid">
                  <div className="achievement-card">
                    <strong>{completedCoursesCount}</strong>
                    Completed courses
                  </div>
                  <div className="achievement-card">
                    <strong>{passedAssessmentsCount}</strong>
                    Passed assessments
                  </div>
                  <div className="achievement-card">
                    <strong>{certificate ? "Issued" : "Pending"}</strong>
                    Certificate status
                  </div>
                </div>

                <div className="certificate-card">
                  <h3>Completion Certificate</h3>
                  {certificate ? (
                    <>
                      <p>
                        <strong>Certificate ID:</strong> {certificate.id}
                      </p>
                      <p>
                        <strong>Learner:</strong> {certificate.learnerName}
                      </p>
                      <p>
                        <strong>Role:</strong> {certificate.roleName}
                      </p>
                      <p>
                        <strong>Issued On:</strong> {new Date(certificate.issuedAt).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p>
                      Complete all skill quizzes and pass at least one assessment level for {roleName || dreamJob || "your selected role"} to unlock your certificate at your completed level.
                    </p>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
