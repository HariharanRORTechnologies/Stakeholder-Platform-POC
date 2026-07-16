import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Admin', status: 'active', joinDate: '2025-01-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Event Organizer', status: 'active', joinDate: '2025-03-20' },
  { id: 3, name: 'Mike Davis', email: 'mike@company.com', role: 'Employee', status: 'active', joinDate: '2025-05-10' },
  { id: 4, name: 'Emma Wilson', email: 'emma@company.com', role: 'Division Manager', status: 'inactive', joinDate: '2025-06-01' },
  { id: 5, name: 'Alex Brown', email: 'alex@company.com', role: 'Support', status: 'active', joinDate: '2025-07-05' },
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({});
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...formData as User } : u));
    } else {
      const newUser: User = {
        ...formData as User,
        id: Math.max(...users.map(u => u.id)) + 1,
      };
      setUsers([...users, newUser]);
    }
    handleCloseDialog();
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        User Management
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Create, edit, and manage user accounts
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Users"
            value={users.length}
            color={THEME.success}
            change={`+${Math.floor(users.length * 0.1)} this month`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Active Users"
            value={users.filter(u => u.status === 'active').length}
            color={THEME.primaryLight}
            change={`${Math.round((users.filter(u => u.status === 'active').length / users.length) * 100)}% of total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Inactive Users"
            value={users.filter(u => u.status === 'inactive').length}
            color={THEME.warning}
            change="Needs review"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="New This Month"
            value={Math.floor(users.length * 0.15)}
            color={THEME.info}
            change="Recently added"
          />
        </Grid>
      </Grid>

      {/* User List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Users
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: THEME.primary,
                '&:hover': { backgroundColor: THEME.primaryDark }
              }}
            >
              Add User
            </Button>
          </Stack>

          <TextField
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Join Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map(user => (
                  <TableRow key={user.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{user.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{user.email}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{user.role}</Typography></TableCell>
                    <TableCell>{renderStatusChip(user.status)}</TableCell>
                    <TableCell><Typography variant="caption">{user.joinDate}</Typography></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(user)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(user.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Role"
              select
              value={formData.role || ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              fullWidth
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Event Organizer">Event Organizer</option>
              <option value="Employee">Employee</option>
              <option value="Division Manager">Division Manager</option>
              <option value="Support">Support</option>
            </TextField>
            <TextField
              label="Status"
              select
              value={formData.status || 'active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              fullWidth
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: THEME.primary, '&:hover': { backgroundColor: THEME.primaryDark } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
