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
import { Role, CreateRoleRequest, UpdateRoleRequest, ROLE_LEVEL_LABELS } from '../types/role.types';

interface RoleFormProps {
  open: boolean;
  role?: Role;
  loading: boolean;
  error?: string;
  onSubmit: (data: CreateRoleRequest | UpdateRoleRequest) => Promise<void>;
  onClose: () => void;
  title?: string;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  open,
  role,
  loading,
  error,
  onSubmit,
  onClose,
  title,
}) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    level: 5,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description || '',
        level: role.level,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        level: 5,
      });
    }
    setValidationErrors({});
    setLocalError(null);
  }, [role, open]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Role name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Role name must be at least 2 characters';
    }

    if (!formData.level || formData.level < 1 || formData.level > 10) {
      errors.level = 'Role level must be between 1 and 10';
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
      const submitData = role
        ? {
            name: formData.name,
            description: formData.description,
            level: parseInt(formData.level),
          }
        : {
            name: formData.name,
            description: formData.description,
            level: parseInt(formData.level),
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
        {title || (role ? 'Edit Role' : 'Create New Role')}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Role Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            disabled={loading || (role?.isSystem)}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={loading || (role?.isSystem)}
            multiline
            rows={3}
          />

          <FormControl fullWidth>
            <InputLabel>Level</InputLabel>
            <Select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              disabled={loading || (role?.isSystem)}
              label="Level"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <MenuItem key={level} value={level}>
                  {level} - {ROLE_LEVEL_LABELS[level] || 'Custom'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {role?.isSystem && (
            <Alert severity="info">
              System roles cannot be edited. This role is managed by the system.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || (role?.isSystem)}
        >
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          {role ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
