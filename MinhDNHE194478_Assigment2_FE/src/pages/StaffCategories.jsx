import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api';

const StaffCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/staff/categories');
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to load categories.');
    }
  };

  const handleShowModal = (category = null) => {
    setCurrentCategory(category);
    if (category) {
      setCategoryName(category.categoryName);
      setCategoryDescription(category.categoryDescription);
      setParentCategoryId(category.parentCategoryId || '');
      setIsActive(category.isActive);
    } else {
      setCategoryName('');
      setCategoryDescription('');
      setParentCategoryId('');
      setIsActive(true);
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = { 
      categoryName, 
      categoryDescription, 
      parentCategoryId: parentCategoryId ? Number(parentCategoryId) : null,
      isActive
    };

    try {
      if (currentCategory) {
        await api.put(`/staff/categories/${currentCategory.categoryId}`, payload);
        toast.success('Category updated successfully');
      } else {
        await api.post('/staff/categories', payload);
        toast.success('Category created successfully');
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/staff/categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Cannot delete category as it may contain news articles.');
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.categoryDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const currentItems = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Category Management</h4>
        <div className="d-flex gap-2">
          <Form.Control 
            type="text" 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button variant="primary" style={{ whiteSpace: 'nowrap' }} onClick={() => handleShowModal()}>Add Category</Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(cat => (
            <tr key={cat.categoryId}>
              <td>{cat.categoryId}</td>
              <td>{cat.categoryName}</td>
              <td>{cat.categoryDescription}</td>
              <td>{cat.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(cat)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(cat.categoryId)}>Delete</Button>
              </td>
            </tr>
          ))}
          {filteredCategories.length === 0 && (
            <tr><td colSpan="5" className="text-center">No categories found.</td></tr>
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
          <Modal.Title>{currentCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control type="text" required value={categoryName} onChange={e => setCategoryName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category Description</Form.Label>
              <Form.Control as="textarea" rows={3} required value={categoryDescription} onChange={e => setCategoryDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parent Category ID (Optional)</Form.Label>
              <Form.Control type="number" value={parentCategoryId} onChange={e => setParentCategoryId(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Active" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
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
    </div>
  );
};

export default StaffCategories;
