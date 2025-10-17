import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useStore';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import Learning from './pages/student/Learning';
import ChapterDetails from './pages/student/ChapterDetails';
import Leaderboard from './pages/student/Leaderboard';
// Removed: Community UI
import Videos from './pages/student/Videos';
import Tests from './pages/student/Tests';
import TestTaking from './pages/student/TestTaking';
import TestResult from './pages/student/TestResult';
// Removed: Chat UI
import Chatbot from './pages/student/Chatbot';
import Performance from './pages/student/Performance';
import StudentSettings from './pages/student/Settings';
import StudentProfile from './pages/student/Profile';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherStudents from './pages/teacher/Students';
import TeacherPerformance from './pages/teacher/Performance';
// Removed: Teacher Chat & Community UI
import TeacherSettings from './pages/teacher/Settings';
import TeacherProfile from './pages/teacher/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRole="student">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="learning" element={<Learning />} />
          <Route path="chapter/:chapterId" element={<ChapterDetails />} />
          <Route path="videos" element={<Videos />} />
          <Route path="tests" element={<Tests />} />
          <Route path="test/:testId" element={<TestTaking />} />
          <Route path="test-result/:testId" element={<TestResult />} />
          {/* Chat removed */}
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="performance" element={<Performance />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          {/* Community removed */}
          <Route path="settings" element={<StudentSettings />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRole="teacher">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="students" element={<TeacherStudents />} />
          {/* Teacher Chat removed */}
          <Route path="performance" element={<TeacherPerformance />} />
          {/* Teacher Community removed */}
          <Route path="settings" element={<TeacherSettings />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
