import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AppNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let role = null;
  let email = null;
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      let roleInt = decoded.role;
      role = roleInt === 1 ? 'ROLE_ADMIN' : (roleInt === 2 ? 'ROLE_STAFF' : null);
      email = decoded.sub; // Assuming subject is email
    } catch (e) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">FUNewsSystem</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home (Public)</Nav.Link>
            {role === 'ROLE_ADMIN' && (
              <Nav.Link as={Link} to="/admin/accounts">Dashboard (Admin)</Nav.Link>
            )}
            {role === 'ROLE_STAFF' && (
              <Nav.Link as={Link} to="/staff/">Dashboard (Staff)</Nav.Link>
            )}
          </Nav>
          <Nav>
            {token ? (
              <>
                <Navbar.Text className="me-3">Signed in as: {email}</Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout} size="sm">Logout</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
