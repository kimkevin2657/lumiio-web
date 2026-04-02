import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manufacturer" element={<Navigate to="/manufacturer/login" replace />} />
        <Route path="/manufacturer/login" element={<SuperAdminLogin />} />
        <Route path="/manufacturer/dashboard" element={<SuperAdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;