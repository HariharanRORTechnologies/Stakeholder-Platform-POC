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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { User } from '../types/user.types';

interface UserTableProps {
  users: User[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onAction?: (action: string, user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onAction,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Email Verified</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Box>
                  <div style={{ fontWeight: 500 }}>{user.fullName || `${user.firstName} ${user.lastName}`}</div>
                  <div style={{ fontSize: '0.85rem', color: '#999' }}>ID: {user.id}</div>
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber || '-'}</TableCell>
              <TableCell>
                <Chip
                  label={user.isActive ? 'Active' : 'Inactive'}
                  color={user.isActive ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={user.isEmailVerified ? 'Verified' : 'Not Verified'}
                  color={user.isEmailVerified ? 'success' : 'error'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onEdit(user)}
                  title="Edit user"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(user)}
                  title="Delete user"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                {onAction && (
                  <IconButton
                    size="small"
                    onClick={() => onAction('menu', user)}
                    title="More options"
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
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
