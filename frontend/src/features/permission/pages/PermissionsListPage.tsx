import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionTable } from '../components/PermissionTable';
import { PermissionForm } from '../components/PermissionForm';
import { Permission, PermissionListFilters, CATEGORY_LABELS } from '../types/permission.types';

export const PermissionsListPage: React.FC = () => {
  const {
    permissions,
    loading,
    error,
    pagination,
    categories,
    fetchPermissions,
    fetchCategories,
    createPermission,
    updatePermission,
    deletePermission,
    deactivatePermission,
    activatePermission,
    clearError,
  } = usePermissions();

  const [filters, setFilters] = useState<PermissionListFilters>({
    page: 1,
    limit: 50,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchCategories();
    fetchPermissions(filters);
  }, [filters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({
      ...prev,
      searchTerm: value,
      page: 1,
    }));
  };

  const handleCategoryFilter = (value: string) => {
    setSelectedCategory(value);
    setFilters(prev => ({
      ...prev,
      category: value || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleRowsPerPageChange = (limit: number) => {
    setFilters(prev => ({
      ...prev,
      limit,
      page: 1,
    }));
  };

  const handleOpenForm = (permission?: Permission) => {
    setSelectedPermission(permission);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedPermission(undefined);
  };

  const handleSubmitForm = async (data: any) => {
    try {
      if (selectedPermission) {
        await updatePermission(selectedPermission.id, data);
      } else {
        await createPermission(data);
      }
      handleCloseForm();
      fetchPermissions(filters);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteClick = (permission: Permission) => {
    setPermissionToDelete(permission);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (permissionToDelete) {
      try {
        await deletePermission(permissionToDelete.id);
        setDeleteDialogOpen(false);
        setPermissionToDelete(null);
        fetchPermissions(filters);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleToggleActive = async (permission: Permission) => {
    try {
      if (permission.isActive) {
        await deactivatePermission(permission.id);
      } else {
        await activatePermission(permission.id);
      }
      fetchPermissions(filters);
    } catch (err) {
      console.error('Toggle active failed:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Permission Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage system permissions and access control
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Create Permission
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search permissions by name or description..."
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          size="small"
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={e => handleCategoryFilter(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat] || cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <PermissionTable
        permissions={permissions}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onEdit={permission => handleOpenForm(permission)}
        onDelete={handleDeleteClick}
        onToggleActive={handleToggleActive}
      />

      <PermissionForm
        open={formOpen}
        permission={selectedPermission}
        categories={categories}
        loading={loading}
        onSubmit={handleSubmitForm}
        onClose={handleCloseForm}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Permission</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the permission <strong>{permissionToDelete?.name}</strong>?
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
