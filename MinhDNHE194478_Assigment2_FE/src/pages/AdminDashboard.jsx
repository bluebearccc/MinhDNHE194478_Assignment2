import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api';

const AdminDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form State
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountRole, setAccountRole] = useState(1); // 1: Admin, 2: Staff
  const [accountPassword, setAccountPassword] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async (search = '') => {
    try {
      const url = search ? `/admin/accounts?search=${search}` : '/admin/accounts';
      const res = await api.get(url);
      setAccounts(res.data);
    } catch (err) {
      toast.error('Failed to load accounts.');
      if (err.response && err.response.status === 401) {
        // Handle unauthorized if necessary
      }
    }
  };

  const handleShowModal = (account = null) => {
    setCurrentAccount(account);
    if (account) {
      setAccountName(account.accountName);
      setAccountEmail(account.accountEmail);
      setAccountRole(account.accountRole);
      setAccountPassword(''); // Do not load password
    } else {
      setAccountName('');
      setAccountEmail('');
      setAccountRole(2);
      setAccountPassword('');
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = { accountName, accountEmail, accountRole, accountPassword };

    try {
      if (currentAccount) {
        await api.put(`/admin/accounts/${currentAccount.accountId}`, payload);
        toast.success('Account updated successfully');
      } else {
        await api.post('/admin/accounts', payload);
        toast.success('Account created successfully');
      }
      handleCloseModal();
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await api.delete(`/admin/accounts/${id}`);
        toast.success('Account deleted successfully');
        fetchAccounts();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete account. It may be linked to news articles.');
      }
    }
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.accountEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const currentItems = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard - Accounts</h2>
        <div className="d-flex gap-2">
          <Form.Control 
            type="text" 
            placeholder="Search accounts..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button variant="primary" style={{ whiteSpace: 'nowrap' }} onClick={() => handleShowModal()}>Add Account</Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(acc => (
            <tr key={acc.accountId}>
              <td>{acc.accountId}</td>
              <td>{acc.accountName}</td>
              <td>{acc.accountEmail}</td>
              <td>{acc.accountRole === 1 ? 'Admin' : 'Staff'}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(acc)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(acc.accountId)}>Delete</Button>
              </td>
            </tr>
          ))}
          {filteredAccounts.length === 0 && (
            <tr><td colSpan="5" className="text-center">No accounts found.</td></tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
        </Pagination>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentAccount ? 'Edit Account' : 'Add Account'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Account Name</Form.Label>
              <Form.Control type="text" required value={accountName} onChange={e => setAccountName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required value={accountEmail} onChange={e => setAccountEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select value={accountRole} onChange={e => setAccountRole(Number(e.target.value))}>
                <option value={1}>Admin</option>
                <option value={2}>Staff</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password {currentAccount && <small>(Leave blank to keep unchanged)</small>}</Form.Label>
              <Form.Control 
                type="password" 
                required={!currentAccount} 
                value={accountPassword} 
                onChange={e => setAccountPassword(e.target.value)} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </Container>
  );
};

export default AdminDashboard;
