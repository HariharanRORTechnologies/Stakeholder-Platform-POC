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
import SendIcon from '@mui/icons-material/Send';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockRegistrationData } from '../mockRoleData';

interface Registration {
  id: number;
  name: string;
  email: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  ticketType: string;
}

export function RegistrationManagement() {
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrationData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReg, setEditingReg] = useState<Registration | null>(null);
  const [formData, setFormData] = useState<Partial<Registration>>({});

  const filteredRegs = registrations.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRegs = filteredRegs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleOpenDialog = (reg?: Registration) => {
    if (reg) {
      setEditingReg(reg);
      setFormData(reg);
    } else {
      setEditingReg(null);
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReg(null);
    setFormData({});
  };

  const handleSave = () => {
    if (editingReg) {
      setRegistrations(registrations.map(r => r.id === editingReg.id ? { ...formData as Registration } : r));
    } else {
      const newReg: Registration = {
        ...formData as Registration,
        id: Math.max(...registrations.map(r => r.id)) + 1,
      };
      setRegistrations([...registrations, newReg]);
    }
    handleCloseDialog();
  };

  const handleDelete = (regId: number) => {
    setRegistrations(registrations.filter(r => r.id !== regId));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const confirmedCount = registrations.filter(r => r.status === 'confirmed').length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Registration Management
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        View and manage event registrations
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Registrations"
            value={registrations.length}
            color={THEME.success}
            change="For current event"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Confirmed"
            value={confirmedCount}
            color={THEME.primaryLight}
            change={`${Math.round((confirmedCount / registrations.length) * 100)}% confirmed`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Pending"
            value={pendingCount}
            color={THEME.warning}
            change="Awaiting confirmation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Capacity"
            value={`${confirmedCount}/300`}
            color={THEME.info}
            change={`${Math.round((confirmedCount / 300) * 100)}% full`}
          />
        </Grid>
      </Grid>

      {/* Registrations List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Registrations
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                sx={{
                  backgroundColor: THEME.primaryLight,
                  '&:hover': { backgroundColor: THEME.success }
                }}
              >
                Send Email
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  backgroundColor: THEME.primary,
                  '&:hover': { backgroundColor: THEME.primaryDark }
                }}
              >
                Add Registration
              </Button>
            </Stack>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Registration Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ticket Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRegs.map(reg => (
                  <TableRow key={reg.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{reg.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{reg.email}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="textSecondary">{reg.registrationDate}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{reg.ticketType}</Typography></TableCell>
                    <TableCell>{renderStatusChip(reg.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(reg)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(reg.id)}>
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
            count={filteredRegs.length}
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
          {editingReg ? 'Edit Registration' : 'Add Registration'}
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
              label="Ticket Type"
              select
              value={formData.ticketType || ''}
              onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
              fullWidth
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="">Select Type</option>
              <option value="Standard">Standard</option>
              <option value="VIP">VIP</option>
              <option value="Student">Student</option>
            </TextField>
            <TextField
              label="Status"
              select
              value={formData.status || 'pending'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              fullWidth
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
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
