import React, { useState, useMemo } from "react";
import { useApp } from "../AppContext";
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  GraduationCap, 
  CheckCircle, 
  Play, 
  ChevronRight 
} from "lucide-react";
import "./BatchesPage.css";

const MOCK_BATCHES = [
  {
    id: "B-2026-A1",
    name: "Enterprise Full Stack Cohort - Q3",
    courseName: "Full Stack Developer Pathway",
    duration: "12 Weeks",
    startDate: "2026-07-01",
    status: "In Progress",
    studentCount: 45
  },
  {
    id: "B-2026-B3",
    name: "AI & Deep Learning Fast-Track B3",
    courseName: "AI Engineer Pathway",
    duration: "8 Weeks",
    startDate: "2026-06-15",
    status: "In Progress",
    studentCount: 32
  },
  {
    id: "B-2026-C2",
    name: "Backend Node.js Systems Group B",
    courseName: "Node.js Developer Pathway",
    duration: "10 Weeks",
    startDate: "2026-05-10",
    status: "Completed",
    studentCount: 28
  },
  {
    id: "B-2026-D4",
    name: "Java Microservices Corporate Onboarding",
    courseName: "Java Developer Pathway",
    duration: "14 Weeks",
    startDate: "2026-08-01",
    status: "Upcoming",
    studentCount: 50
  },
  {
    id: "B-2026-E1",
    name: "React Developer Advanced Core A",
    courseName: "React Developer Pathway",
    duration: "6 Weeks",
    startDate: "2026-07-15",
    status: "Upcoming",
    studentCount: 35
  }
];

export default function BatchesPage() {
  const { roleName, dreamJob } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const currentRole = roleName || dreamJob || "";

  // Dynamically inject user's active batch if role is defined
  const userBatch = useMemo(() => {
    if (!currentRole) return null;
    const formatted = currentRole.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
    return {
      id: "B-2026-USER",
      name: `${formatted}-COHORT-A`,
      courseName: `${currentRole} Curriculum Pathway`,
      duration: "12 Weeks",
      startDate: "2026-07-01",
      status: "In Progress",
      studentCount: 24,
      isUserBatch: true
    };
  }, [currentRole]);

  // Combine static mock batches with user batch (if present)
  const allBatches = useMemo(() => {
    if (userBatch) {
      // Filter out duplicate role IDs
      const others = MOCK_BATCHES.filter(
        b => b.courseName.toLowerCase() !== userBatch.courseName.toLowerCase()
      );
      return [userBatch, ...others];
    }
    return MOCK_BATCHES;
  }, [userBatch]);

  // Handle Search and Filter operations
  const filteredBatches = useMemo(() => {
    return allBatches.filter((batch) => {
      const matchesSearch = 
        batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = statusFilter === "All" || batch.status === statusFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [allBatches, searchTerm, statusFilter]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed": return "status-completed";
      case "In Progress": return "status-progress";
      case "Upcoming": return "status-upcoming";
      default: return "";
    }
  };

  return (
    <div className="batches-container">
      {/* Page Title & Intro */}
      <header className="batches-header">
        <div className="header-meta">
          <span className="welcome-pill">Academic Operations</span>
          <h1 className="title">Cohort & Batch Management</h1>
          <p className="muted">Track student registration cohorts, program schedules, and corporate enrollment pools.</p>
        </div>
      </header>

      {/* 🌟 Active Assigned Batch Card */}
      {userBatch && (
        <section className="user-batch-banner" aria-label="Assigned Cohort Info">
          <div className="banner-glowing-glow" />
          <div className="banner-content">
            <div className="banner-badge">YOUR ENROLLED BATCH</div>
            <h2>{userBatch.name}</h2>
            <div className="banner-details-row">
              <span className="banner-detail-item">
                <GraduationCap size={16} />
                <span>{userBatch.courseName}</span>
              </span>
              <span className="banner-detail-item">
                <Calendar size={16} />
                <span>Starts: {new Date(userBatch.startDate).toLocaleDateString()}</span>
              </span>
              <span className="banner-detail-item">
                <Clock size={16} />
                <span>Duration: {userBatch.duration}</span>
              </span>
              <span className="banner-detail-item">
                <Users size={16} />
                <span>{userBatch.studentCount} peers enrolled</span>
              </span>
            </div>
          </div>
          <div className="banner-actions">
            <span className="status-badge-inline passed">Cohort Active</span>
          </div>
        </section>
      )}

      {/* Search and Filters panel */}
      <section className="filters-bar" aria-label="Filters">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            className="input search-input"
            type="text"
            placeholder="Search by cohort name or pathway..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-chips">
          {["All", "In Progress", "Upcoming", "Completed"].map((filter) => (
            <button
              key={filter}
              className={`filter-chip ${statusFilter === filter ? "active" : ""}`}
              onClick={() => setStatusFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Batches Table and Cards Deck */}
      <section className="batches-view-wrapper" aria-label="Cohort List">
        <div className="batches-table-wrapper">
          <table className="batches-table">
            <thead>
              <tr>
                <th>Cohort / Batch Name</th>
                <th>Curriculum Pathway</th>
                <th>Start Date</th>
                <th>Duration</th>
                <th>Class Size</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => (
                  <tr key={batch.id} className={batch.isUserBatch ? "user-row" : ""}>
                    <td className="cohort-cell">
                      <div className="cohort-name-block">
                        <strong>{batch.name}</strong>
                        <span className="cohort-id">{batch.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="pathway-text">{batch.courseName}</span>
                    </td>
                    <td>
                      <div className="date-block">
                        <Calendar size={14} />
                        <span>{new Date(batch.startDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="duration-block">
                        <Clock size={14} />
                        <span>{batch.duration}</span>
                      </div>
                    </td>
                    <td>
                      <div className="students-block">
                        <Users size={14} />
                        <span>{batch.studentCount} students</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge-custom ${getStatusClass(batch.status)}`}>
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="table-empty-row">
                    No batches match the search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Responsive Mobile Cards Grid */}
        <div className="batches-cards-grid">
          {filteredBatches.length > 0 ? (
            filteredBatches.map((batch) => (
              <div 
                key={batch.id} 
                className={`batch-mobile-card ${batch.isUserBatch ? "user-card" : ""}`}
              >
                <div className="card-header-row">
                  <span className="batch-id-tag">{batch.id}</span>
                  <span className={`status-badge-custom ${getStatusClass(batch.status)}`}>
                    {batch.status}
                  </span>
                </div>
                <h3>{batch.name}</h3>
                <p className="course-name">{batch.courseName}</p>
                <div className="meta-footer">
                  <span>
                    <Calendar size={14} />
                    {new Date(batch.startDate).toLocaleDateString()}
                  </span>
                  <span>
                    <Clock size={14} />
                    {batch.duration}
                  </span>
                  <span>
                    <Users size={14} />
                    {batch.studentCount} peers
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="mobile-empty-state">No batches match the search filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}
