import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { accountEmail: email, accountPassword: password });
      const { token } = res.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

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
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group id="password" className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button disabled={loading} className="w-100 mb-3" type="submit">
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
              
              <div className="text-center">
                <p className="mb-0">
                  Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
