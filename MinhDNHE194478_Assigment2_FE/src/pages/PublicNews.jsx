import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, Pagination } from 'react-bootstrap';
import api from '../api';

const PublicNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/news');
      setNews(res.data);
    } catch (err) {
      setError('Failed to fetch news. Please later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const filteredNews = news.filter(item => 
    item.newsTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.createdBy?.accountName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentItems = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Latest News</h2>
        <Form.Control 
          type="text" 
          placeholder="Search news..." 
          style={{ width: '300px' }} 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      {filteredNews.length === 0 ? (
        <Alert variant="info">No active news available matching your search.</Alert>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4 mb-4">
            {currentItems.map((item) => (
              <Col key={item.newsArticleId}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{item.newsTitle}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Category: {item.category?.categoryName} <br/>
                      <small>Author: {item.createdBy?.accountName}</small>
                  </Card.Subtitle>
                  <Card.Text>
                    {item.newsContent.length > 150 
                      ? `${item.newsContent.substring(0, 150)}...` 
                      : item.newsContent}
                  </Card.Text>
                  <div>
                    {item.tags && item.tags.map(tag => (
                      <Badge bg="secondary" className="me-1" key={tag.tagId}>{tag.tagName}</Badge>
                    ))}
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Published: {new Date(item.createdDate).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
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
        </>
      )}
    </Container>
  );
};

export default PublicNews;
