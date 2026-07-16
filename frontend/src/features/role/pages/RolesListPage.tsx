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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useRoles } from '../hooks/useRoles';
import { RoleTable } from '../components/RoleTable';
import { RoleForm } from '../components/RoleForm';
import { Role, RoleListFilters } from '../types/role.types';

export const RolesListPage: React.FC = () => {
  const {
    roles,
    loading,
    error,
    pagination,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    deactivateRole,
    activateRole,
    clearError,
  } = useRoles();

  const [filters, setFilters] = useState<RoleListFilters>({
    page: 1,
    limit: 20,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoles(filters);
  }, [filters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({
      ...prev,
      searchTerm: value,
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

  const handleOpenForm = (role?: Role) => {
    setSelectedRole(role);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedRole(undefined);
  };

  const handleSubmitForm = async (data: any) => {
    try {
      if (selectedRole) {
        await updateRole(selectedRole.id, data);
      } else {
        await createRole(data);
      }
      handleCloseForm();
      fetchRoles(filters);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (roleToDelete) {
      try {
        await deleteRole(roleToDelete.id);
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
        fetchRoles(filters);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleToggleActive = async (role: Role) => {
    try {
      if (role.isActive) {
        await deactivateRole(role.id);
      } else {
        await activateRole(role.id);
      }
      fetchRoles(filters);
    } catch (err) {
      console.error('Toggle active failed:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Role Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage roles, permissions, and access levels
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Create Role
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search roles by name or description..."
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          size="small"
        />
      </Box>

      <RoleTable
        roles={roles}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onEdit={role => handleOpenForm(role)}
        onDelete={handleDeleteClick}
        onToggleActive={handleToggleActive}
      />

      <RoleForm
        open={formOpen}
        role={selectedRole}
        loading={loading}
        onSubmit={handleSubmitForm}
        onClose={handleCloseForm}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the role <strong>{roleToDelete?.name}</strong>?
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
