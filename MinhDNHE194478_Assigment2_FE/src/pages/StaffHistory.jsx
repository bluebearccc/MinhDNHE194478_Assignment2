import React, { useState, useEffect } from 'react';
import { Table, Badge, Form, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const StaffHistory = () => {
  const [news, setNews] = useState([]);
  const [myEmail, setMyEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setMyEmail(decoded.sub);
    }
    fetchMyNews();
  }, []);

  const fetchMyNews = async () => {
    try {
      const res = await api.get('/profile/history');
      setNews(res.data);
    } catch (err) {
      toast.error('Failed to load news history.');
    }
  };

  const filteredNews = news.filter(item => 
    item.newsTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentItems = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">My News History</h4>
        <Form.Control 
          type="text" 
          placeholder="Search..." 
          style={{ width: '250px' }} 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.newsArticleId}>
              <td>{item.newsTitle}</td>
              <td>{item.category?.categoryName}</td>
              <td>{item.newsStatus ? 'Active' : 'Inactive'}</td>
              <td>
                {item.tags && item.tags.map(t => <Badge key={t.tagId} bg="info" className="me-1">{t.tagName}</Badge>)}
              </td>
              <td>{new Date(item.createdDate).toLocaleString()}</td>
            </tr>
          ))}
          {filteredNews.length === 0 && (
            <tr><td colSpan="5" className="text-center">No history available.</td></tr>
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
    </div>
  );
};

export default StaffHistory;
