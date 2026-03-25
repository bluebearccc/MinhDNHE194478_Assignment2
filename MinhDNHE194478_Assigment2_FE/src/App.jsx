import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicNews from './pages/PublicNews';
import { jwtDecode } from 'jwt-decode';

// Placeholder imports for dashboards
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const decoded = jwtDecode(token);
    const roleInt = decoded.role;
    const roleStr = roleInt === 1 ? 'ROLE_ADMIN' : (roleInt === 2 ? 'ROLE_STAFF' : null);
    
    if (requiredRole && requiredRole !== roleStr) {
      return <Navigate to="/" replace />;
    }
    return children;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <AppNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<PublicNews />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/staff/*" 
            element={
              <ProtectedRoute requiredRole="ROLE_STAFF">
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
