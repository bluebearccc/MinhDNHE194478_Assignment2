import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api';

const StaffNews = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);

  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsStatus, setNewsStatus] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [tagNames, setTagNames] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await api.get('/staff/news');
      setNews(res.data);
    } catch (err) {
      toast.error('Failed to load news articles.');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/staff/categories');
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to load categories.');
    }
  };

  const handleShowModal = (article = null) => {
    setCurrentNews(article);
    if (article) {
      setNewsTitle(article.newsTitle);
      setNewsContent(article.newsContent);
      setNewsStatus(article.newsStatus);
      setCategoryId(article.categoryId || '');
      setTagNames(article.tags ? article.tags.map(t => t.tagName).join(', ') : '');
    } else {
      setNewsTitle('');
      setNewsContent('');
      setNewsStatus(true);
      setCategoryId('');
      setTagNames('');
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
      newsTitle,
      headline: newsTitle, // If API requires headline
      newsContent,
      newsSource: 'Internal',
      newsStatus,
      categoryId: parseInt(categoryId),
      tagNames: tagNames.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      if (currentNews) {
        await api.put(`/staff/news/${currentNews.newsArticleId}`, payload);
        toast.success('News updated successfully');
      } else {
        await api.post('/staff/news', payload);
        toast.success('News created successfully');
      }
      handleCloseModal();
      fetchNews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save news article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(`/staff/news/${id}`);
        toast.success('Article deleted successfully');
        fetchNews();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete article.');
      }
    }
  };

  const filteredNews = news.filter(item => 
    item.newsTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.createdBy?.accountName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentItems = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>News Articles Management</h4>
        <div className="d-flex gap-2">
          <Form.Control 
            type="text" 
            placeholder="Search news..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button variant="primary" style={{ whiteSpace: 'nowrap' }} onClick={() => handleShowModal()}>Add News</Button>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.newsArticleId}>
              <td>{item.newsArticleId}</td>
              <td>{item.newsTitle}</td>
              <td>{item.category?.categoryName}</td>
              <td>{item.createdBy?.accountName}</td>
              <td>{item.newsStatus ? 'Active' : 'Inactive'}</td>
              <td>
                {item.tags && item.tags.map(t => <Badge key={t.tagId} bg="info" className="me-1">{t.tagName}</Badge>)}
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(item)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.newsArticleId)}>Delete</Button>
              </td>
            </tr>
          ))}
          {filteredNews.length === 0 && (
            <tr><td colSpan="7" className="text-center">No news articles found.</td></tr>
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

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentNews ? 'Edit News Article' : 'Add News Article'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" required value={newsTitle} onChange={e => setNewsTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select required value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">Select Categories...</option>
                {categories.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={5} required value={newsContent} onChange={e => setNewsContent(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control type="text" placeholder="e.g. Technology, Education" value={tagNames} onChange={e => setTagNames(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Active Status" checked={newsStatus} onChange={e => setNewsStatus(e.target.checked)} />
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

export default StaffNews;
