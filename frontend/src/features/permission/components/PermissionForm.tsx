import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Permission, CreatePermissionRequest, UpdatePermissionRequest, PERMISSION_CATEGORIES, CATEGORY_LABELS } from '../types/permission.types';

interface PermissionFormProps {
  open: boolean;
  permission?: Permission;
  categories: string[];
  loading: boolean;
  error?: string;
  onSubmit: (data: CreatePermissionRequest | UpdatePermissionRequest) => Promise<void>;
  onClose: () => void;
  title?: string;
}

export const PermissionForm: React.FC<PermissionFormProps> = ({
  open,
  permission,
  categories,
  loading,
  error,
  onSubmit,
  onClose,
  title,
}) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    category: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name,
        description: permission.description || '',
        category: permission.category,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
      });
    }
    setValidationErrors({});
    setLocalError(null);
  }, [permission, open]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Permission name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Permission name must be at least 3 characters';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: any) => {
    const target = e.target as any;
    const { name, value } = target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
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
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  const categoryOptions = categories.length > 0 ? categories : PERMISSION_CATEGORIES;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {title || (permission ? 'Edit Permission' : 'Create New Permission')}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Permission Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!validationErrors.name}
            helperText={validationErrors.name || 'e.g., users.create'}
            disabled={loading}
            placeholder="e.g., users.create"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={loading}
            multiline
            rows={3}
            placeholder="What does this permission allow?"
          />

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
              label="Category"
            >
              {categoryOptions.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat] || cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          {permission ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
