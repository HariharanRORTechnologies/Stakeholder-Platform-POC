import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateRegistration, cancelRegistration } from '../features/mockData/store/registrationsSlice';
import { showToast } from '../features/mockData/store/uiSlice';

export function RegistrationsPage() {
  const dispatch = useDispatch();
  const registrations = useSelector((state: RootState) => state.mockRegistrations.items);
  const events = useSelector((state: RootState) => state.mockEvents.items);
  const currentRole = useSelector((state: RootState) => state.ui.currentRole);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});

  const eventMap = new Map(events.map(e => [e.id, e]));

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = reg.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || reg.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditClick = (registration: any) => {
    setEditData({ ...registration });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    dispatch(updateRegistration(editData));
    dispatch(showToast({
      message: 'Registration updated successfully',
      type: 'success',
    }));
    setEditDialogOpen(false);
  };

  const handleCancelClick = (registrationId: number) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      dispatch(cancelRegistration(registrationId));
      dispatch(showToast({
        message: 'Registration cancelled',
        type: 'warning',
      }));
    }
  };

  const handleExport = () => {
    dispatch(showToast({
      message: 'Exporting registrations as CSV...',
      type: 'info',
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Registrations
        </Typography>
        {['admin', 'manager', 'organizer'].includes(currentRole) && (
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export
          </Button>
        )}
      </Stack>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Card>

      {/* Stats */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Registrations
            </Typography>
            <Typography variant="h5">{registrations.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Confirmed
            </Typography>
            <Typography variant="h5">
              {registrations.filter(r => r.status === 'confirmed').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Checked In
            </Typography>
            <Typography variant="h5">
              {registrations.filter(r => r.checkedInAt).length}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Attendee</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Registered</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Checked In</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRegistrations.map((registration) => {
              const event = eventMap.get(registration.eventId);
              return (
                <TableRow key={registration.id} hover>
                  <TableCell>
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {registration.userName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {registration.userEmail}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{event?.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(registration.registrationDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {registration.checkedInAt ? new Date(registration.checkedInAt).toLocaleString() : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={registration.status}
                      size="small"
                      color={
                        registration.status === 'confirmed'
                          ? 'success'
                          : registration.status === 'cancelled'
                          ? 'error'
                          : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      {['admin', 'manager', 'organizer'].includes(currentRole) && (
                        <>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(registration)}
                          >
                            Edit
                          </Button>
                          {registration.status !== 'cancelled' && (
                            <Button
                              size="small"
                              startIcon={<DeleteIcon />}
                              color="error"
                              onClick={() => handleCancelClick(registration.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Registration</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={editData.status || ''}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              multiline
              rows={3}
              fullWidth
              value={editData.notes || ''}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
