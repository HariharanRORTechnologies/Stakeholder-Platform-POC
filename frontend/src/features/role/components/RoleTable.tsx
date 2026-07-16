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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { Role, ROLE_LEVEL_LABELS } from '../types/role.types';

interface RoleTableProps {
  roles: Role[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onToggleActive?: (role: Role) => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
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
            <TableCell sx={{ fontWeight: 600 }}>Role Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Permissions
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Users
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map(role => (
            <TableRow key={role.id} hover>
              <TableCell>
                <Box>
                  <div style={{ fontWeight: 500 }}>{role.name}</div>
                  {role.description && (
                    <div style={{ fontSize: '0.85rem', color: '#999' }}>
                      {role.description}
                    </div>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={`${role.level} - ${ROLE_LEVEL_LABELS[role.level] || 'Custom'}`}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`${role.permissionCount || 0} permissions`}
                  size="small"
                  variant="filled"
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`${role.userCount || 0} users`}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={role.isActive ? 'Active' : 'Inactive'}
                  color={role.isActive ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
                {role.isSystem && (
                  <Chip
                    label="System"
                    size="small"
                    sx={{ ml: 1 }}
                    variant="filled"
                  />
                )}
              </TableCell>
              <TableCell align="right">
                {!role.isSystem && (
                  <>
                    <Tooltip title="Edit role">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(role)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {role.userCount === 0 && (
                      <Tooltip title="Delete role">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(role)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onToggleActive && (
                      <Tooltip title={role.isActive ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => onToggleActive(role)}
                        >
                          <BlockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
                {role.isSystem && (
                  <Tooltip title="System role - read only">
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>
                      Read only
                    </span>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
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
