// src/components/UserDetail.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserDetail = () => {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch user details on component mount
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user details.');
      setLoading(false);
      toast.error('Failed to fetch user details.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-4">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        &larr; Back
      </Button>
      <Card>
        <Card.Header>
          <h3>{user.name}</h3>
        </Card.Header>
        <Card.Body>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Website:</strong>{' '}
            {user.website ? (
              <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p>
            <strong>Address:</strong>{' '}
            {user.address ? `${user.address.street}, ${user.address.city}` : 'N/A'}
          </p>
          <p>
            <strong>Company:</strong> {user.company ? user.company.name : 'N/A'}
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserDetail;
