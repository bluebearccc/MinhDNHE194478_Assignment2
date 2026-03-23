import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import StaffCategories from './StaffCategories';
import StaffNews from './StaffNews';
import StaffProfile from './StaffProfile';
import StaffHistory from './StaffHistory';

const StaffDashboard = () => {
  const location = useLocation();

  return (
    <Container>
      <h2 className="mb-4">Staff Dashboard</h2>
      <Nav variant="tabs" className="mb-4" activeKey={location.pathname}>
        <Nav.Item>
          <Nav.Link as={Link} to="/staff/categories" eventKey="/staff/categories">Categories</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/staff/news" eventKey="/staff/news">News Articles</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/staff/history" eventKey="/staff/history">My History</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/staff/profile" eventKey="/staff/profile">Profile</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="tab-content">
        <Routes>
          <Route path="/" element={<Navigate to="categories" replace />} />
          <Route path="categories" element={<StaffCategories />} />
          <Route path="news" element={<StaffNews />} />
          <Route path="history" element={<StaffHistory />} />
          <Route path="profile" element={<StaffProfile />} />
        </Routes>
      </div>
    </Container>
  );
};

export default StaffDashboard;
