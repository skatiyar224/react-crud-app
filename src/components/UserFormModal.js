// src/components/UserFormModal.js

import React, { useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const UserFormModal = ({ show, handleClose, onSubmit, user }) => {
  // Define validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required.')
      .min(3, 'Name must be at least 3 characters.'),
    email: Yup.string()
      .required('Email is required.')
      .email('Invalid email format.'),
    phone: Yup.string()
      .required('Phone number is required.')
      .matches(/^[0-9\-+\s()]*$/, 'Phone number is not valid.'),
    username: Yup.string()
      .required('Username is required.')
      .min(3, 'Username must be at least 3 characters.'),
    address: Yup.object({
      street: Yup.string().required('Street is required.'),
      city: Yup.string().required('City is required.'),
    }),
    company: Yup.string()
      .optional()
      .min(3, 'Company name must be at least 3 characters.'),
    website: Yup.string()
      .optional()
      .url('Website must be a valid URL.'),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      username: '',
      address: {
        street: '',
        city: '',
      },
      company: '',
      website: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (user) {
          // Update user
          const response = await axios.put(
            `https://jsonplaceholder.typicode.com/users/${user.id}`,
            values
          );
          onSubmit(response.data);
          toast.success('User updated successfully!');
        } else {
          // Create new user
          // Generate unique ID
          const newUser = { ...values, id: uuidv4() };
          const response = await axios.post(
            'https://jsonplaceholder.typicode.com/users',
            newUser
          );
          onSubmit(response.data);
          toast.success('User created successfully!');
        }
        setSubmitting(false);
        handleClose();
      } catch (error) {
        toast.error('Failed to submit the form.');
        setSubmitting(false);
      }
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || '',
        address: {
          street: user.address ? user.address.street : '',
          city: user.address ? user.address.city : '',
        },
        company: user.company ? user.company.name : '',
        website: user.website || '',
      });
    } else {
      formik.resetForm();
      // Auto-fill username for new users
      formik.setFieldValue('username', 'USER-');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{user ? 'Edit User' : 'Add User'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          {/* Name Field */}
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Email Field */}
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.email && formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Phone Field */}
          <Form.Group controlId="formPhone" className="mb-3">
            <Form.Label>Phone *</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.phone && formik.errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.phone}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Username Field */}
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username *</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              isInvalid={formik.touched.username && formik.errors.username}
              readOnly={!!user} // Make read-only if editing
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Address Fields */}
          <Form.Group controlId="formAddress" className="mb-3">
            <Form.Label>Address *</Form.Label>
            <Form.Control
              type="text"
              name="address.street"
              placeholder="Street"
              value={formik.values.address.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.address?.street && formik.errors.address?.street
              }
              className="mb-2"
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.address?.street}
            </Form.Control.Feedback>
            <Form.Control
              type="text"
              name="address.city"
              placeholder="City"
              value={formik.values.address.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.address?.city && formik.errors.address?.city
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.address?.city}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Company Name Field */}
          <Form.Group controlId="formCompany" className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              name="company"
              placeholder="Enter company name"
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.company && formik.errors.company}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.company}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Website Field */}
          <Form.Group controlId="formWebsite" className="mb-3">
            <Form.Label>Website</Form.Label>
            <Form.Control
              type="text"
              name="website"
              placeholder="Enter website URL"
              value={formik.values.website}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.website && formik.errors.website}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.website}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Submitting...' : user ? 'Update User' : 'Create User'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserFormModal;
