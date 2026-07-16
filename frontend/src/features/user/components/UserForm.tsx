import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user.types';

interface UserFormProps {
  open: boolean;
  user?: User;
  loading: boolean;
  error?: string;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onClose: () => void;
  title?: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  open,
  user,
  loading,
  error,
  onSubmit,
  onClose,
  title,
}) => {
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    departmentId: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        departmentId: user.departmentId || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        departmentId: '',
      });
    }
  }, [user, open]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!user && !formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!user && !formData.password) {
      errors.password = 'Password is required for new users';
    } else if (!user && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.phoneNumber && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number format';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev: any) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async () => {
    setLocalError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = user
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
          }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            departmentId: formData.departmentId ? parseInt(formData.departmentId) : undefined,
          };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {title || (user ? 'Edit User' : 'Create New User')}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={!!validationErrors.firstName}
            helperText={validationErrors.firstName}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={!!validationErrors.lastName}
            helperText={validationErrors.lastName}
            disabled={loading}
          />

          {!user && (
            <>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                disabled={loading}
              />
            </>
          )}

          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            error={!!validationErrors.phoneNumber}
            helperText={validationErrors.phoneNumber}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Department ID"
            name="departmentId"
            type="number"
            value={formData.departmentId}
            onChange={handleInputChange}
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          {user ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
