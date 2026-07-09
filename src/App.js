import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./AppContext";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import LearningPage from "./pages/LearningPage";
import SkillCoursePage from "./pages/SkillCoursePage";
import SkillCompletionPage from "./pages/SkillCompletionPage";
import SkillQuizPage from "./pages/SkillQuizPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import DreamRolePage from "./pages/DreamRolePage";
import RoadmapPage from "./pages/RoadmapPage";
import HeroBadgePage from "./pages/HeroBadgePage";
import Layout from "./components/Layout";
import "./App.css";

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function JourneyHomeRedirect() {
  const { profileSetupDone, skills, allSkillQuizzesPassed } = useApp();

  if (!profileSetupDone) return <Navigate to="/setup-profile" replace />;
  if (!skills.length) return <Navigate to="/dream-role" replace />;
  if (!allSkillQuizzesPassed) return <Navigate to="/roadmap" replace />;
  return <Navigate to="/hero-badge" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<AuthForm />} />

          {/* Protected routes inside layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <JourneyHomeRedirect />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/setup-profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfileSetupPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dream-role"
            element={
              <ProtectedRoute>
                <Layout>
                  <DreamRolePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <Layout>
                  <RoadmapPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Layout>
                  <RoadmapPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:level"
            element={
              <ProtectedRoute>
                <Layout>
                  <QuizPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:skillName"
            element={
              <ProtectedRoute>
                <Layout>
                  <LearningPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:skillName/course"
            element={
              <ProtectedRoute>
                <Layout>
                  <SkillCoursePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:skillName/complete"
            element={
              <ProtectedRoute>
                <Layout>
                  <SkillCompletionPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:skillName/quiz"
            element={
              <ProtectedRoute>
                <Layout>
                  <SkillQuizPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/hero-badge"
            element={
              <ProtectedRoute>
                <Layout>
                  <HeroBadgePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Legacy routes retained for compatibility */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}
