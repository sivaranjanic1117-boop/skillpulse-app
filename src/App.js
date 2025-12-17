import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./AppContext";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import SkillsPage from "./pages/SkillsPage";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout";
import "./App.css";

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
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
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Layout>
                  <SkillsPage />
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
