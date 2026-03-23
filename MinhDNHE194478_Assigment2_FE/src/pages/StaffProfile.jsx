import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api';

const StaffProfile = () => {
  const [profile, setProfile] = useState({ accountName: '', accountEmail: '' });
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile({
        accountName: res.data.accountName || '',
        accountEmail: res.data.accountEmail || ''
      });
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error('Failed to load profile.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = { 
      accountName: profile.accountName, 
      accountEmail: profile.accountEmail, 
      accountPassword: password 
    };

    try {
      await api.put('/profile', payload);
      toast.success('Profile updated successfully');
      setPassword(''); // clear password field
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={{ maxWidth: '600px' }}>
      <Card.Body>
        <Card.Title className="mb-4">My Profile</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              required 
              value={profile.accountName} 
              onChange={e => setProfile({...profile, accountName: e.target.value})} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              required 
              value={profile.accountEmail} 
              onChange={e => setProfile({...profile, accountEmail: e.target.value})} 
              disabled // Assuming email cannot be changed
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>New Password <small>(Leave blank to keep unchanged)</small></Form.Label>
            <Form.Control 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default StaffProfile;
