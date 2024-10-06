// src/components/ConfirmDeleteModal.js

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ConfirmDeleteModal = ({ show, handleClose, onConfirm, user }) => {
  const handleDelete = async () => {
    try {
      await onConfirm();
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete user.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <p>
            Are you sure you want to delete <strong>{user.name}</strong>?
          </p>
        ) : (
          <p>Are you sure you want to delete this user?</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
