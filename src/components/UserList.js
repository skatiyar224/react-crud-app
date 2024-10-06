// src/components/UserList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import UserFormModal from './UserFormModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * UserList Component
 * Displays a list of users in a table with options to add, edit, and delete users.
 */
const UserList = () => {
  // State variables
  const [users, setUsers] = useState([]); // List of users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message
  const [showFormModal, setShowFormModal] = useState(false); // Toggle UserFormModal
  const [currentUser, setCurrentUser] = useState(null); // User being edited
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Toggle ConfirmDeleteModal
  const [userToDelete, setUserToDelete] = useState(null); // User to be deleted

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Fetches the list of users from the API.
   */
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users.');
      setLoading(false);
      toast.error('Failed to fetch users.');
    }
  };

  /**
   * Handles form submission for creating or updating a user.
   * @param {Object} userData - The user data from the form.
   */
  const handleFormSubmit = (userData) => {
    if (currentUser) {
      // Update existing user
      setUsers(users.map((u) => (u.id === userData.id ? userData : u)));
      toast.success('User updated successfully!');
    } else {
      // Create new user
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const newUser = {
        ...userData,
        id: newId,
        username: `USER-${userData.name.replace(/\s+/g, '').toUpperCase()}`,
      };
      setUsers([...users, newUser]); // Append to the end
      toast.success('User created successfully!');
    }
  };

  /**
   * Opens the UserFormModal for adding a new user.
   */
  const handleAddUser = () => {
    setCurrentUser(null);
    setShowFormModal(true);
  };

  /**
   * Opens the UserFormModal for editing an existing user.
   * @param {Object} user - The user to be edited.
   */
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowFormModal(true);
  };

  /**
   * Opens the ConfirmDeleteModal for deleting a user.
   * @param {Object} user - The user to be deleted.
   */
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  /**
   * Confirms the deletion of a user.
   */
  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${userToDelete.id}`);
      // Remove user from state
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      toast.success('User deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete user.');
    }
  };

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Display error message if data fetching fails
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      <Button variant="primary" onClick={handleAddUser} className="mb-3">
        Add User
      </Button>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Address</th>
            <th>Company</th>
            <th style={{ minWidth: '150px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className={index % 2 === 0 ? 'table-light' : 'table-secondary'}>
              <td>{user.id}</td>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                {user.website ? (
                  <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                {user.address ? `${user.address.street}, ${user.address.city}` : 'N/A'}
              </td>
              <td>{user.company ? user.company.name : 'N/A'}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditUser(user)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">
                No users available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* User Form Modal */}
      <UserFormModal
        show={showFormModal}
        handleClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        user={currentUser}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteUser}
        user={userToDelete}
      />
    </div>
  );
};

export default UserList;
