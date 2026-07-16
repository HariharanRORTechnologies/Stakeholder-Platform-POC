import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TablePagination,
  Box,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { Permission, CATEGORY_LABELS } from '../types/permission.types';

interface PermissionTableProps {
  permissions: Permission[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
  onToggleActive?: (permission: Permission) => void;
}

export const PermissionTable: React.FC<PermissionTableProps> = ({
  permissions,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Permission</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Used by Roles
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.map(permission => (
            <TableRow key={permission.id} hover>
              <TableCell>
                <Box>
                  <div style={{ fontWeight: 500 }}>{permission.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#999' }}>
                    ID: {permission.id}
                  </div>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={CATEGORY_LABELS[permission.category] || permission.category}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ maxWidth: 300 }}>
                  {permission.description || '-'}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`${permission.roleCount || 0} roles`}
                  size="small"
                  variant="filled"
                  color={permission.roleCount ? 'default' : 'default'}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={permission.isActive ? 'Active' : 'Inactive'}
                  color={permission.isActive ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit permission">
                  <IconButton size="small" onClick={() => onEdit(permission)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {permission.roleCount === 0 && (
                  <Tooltip title="Delete permission">
                    <IconButton size="small" onClick={() => onDelete(permission)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onToggleActive && (
                  <Tooltip title={permission.isActive ? 'Deactivate' : 'Activate'}>
                    <IconButton
                      size="small"
                      onClick={() => onToggleActive(permission)}
                    >
                      <BlockIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.limit}
        page={pagination.page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
      />
    </TableContainer>
  );
};
