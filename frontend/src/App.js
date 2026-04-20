import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts - Exact path from your structure
import MainLayout from './Layouts/MainLayout';

// Pages - Exact paths from your structure
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AnomalyDetection from './pages/AnomalyDetection';
import LogMonitor from './pages/LogMonitor';
import Predict from './pages/Predict';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Auth Routes */}
        <Route path="/Login" element={<Login/>} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes with MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/anomaly-detection" element={<AnomalyDetection />} />
          <Route path="/logs" element={<LogMonitor />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/about" element={<About />} />
        </Route>
        
        {/* Redirect any unknown routes to landing page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;