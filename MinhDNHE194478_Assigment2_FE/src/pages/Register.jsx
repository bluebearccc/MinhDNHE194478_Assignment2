import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength (optional)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/register', { 
        accountName: name, 
        accountEmail: email, 
        accountPassword: password 
      });
      
      const { token } = res.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      // Redirect based on role (same as login)
      if (role === 1) {
        navigate('/admin/accounts');
      } else if (role === 2) {
        navigate('/staff/categories');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data) {
        // Handle validation errors
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.values(errorData).flat();
          setError(errorMessages.join(', '));
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Create Account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleRegister}>
              <Form.Group id="name" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </Form.Group>
              
              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group id="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                    <Form.Text className="text-muted">
                      At least 6 characters
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group id="confirmPassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      required 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Button disabled={loading} className="w-100 mb-3" type="submit" variant="primary">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              
              <div className="text-center">
                <p className="mb-0">
                  Already have an account? <Link to="/login">Log In</Link>
                </p>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Register;