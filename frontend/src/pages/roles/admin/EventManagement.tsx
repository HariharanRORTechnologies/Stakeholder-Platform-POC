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
import { mockEventManagementData } from '../mockRoleData';

interface EventData {
  id: number;
  title: string;
  date: string;
  status: 'draft' | 'pending' | 'published';
  organizer: string;
  registrations: number;
}

export function EventManagement() {
  const [events, setEvents] = useState<EventData[]>(mockEventManagementData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [formData, setFormData] = useState<Partial<EventData>>({});

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEvents = filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleOpenDialog = (event?: EventData) => {
    if (event) {
      setEditingEvent(event);
      setFormData(event);
    } else {
      setEditingEvent(null);
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    setFormData({});
  };

  const handleSave = () => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...formData as EventData } : e));
    } else {
      const newEvent: EventData = {
        ...formData as EventData,
        id: Math.max(...events.map(e => e.id)) + 1,
      };
      setEvents([...events, newEvent]);
    }
    handleCloseDialog();
  };

  const handleDelete = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const publishedCount = events.filter(e => e.status === 'published').length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.registrations, 0);

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Event Management
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Create, edit, and publish events
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Events"
            value={events.length}
            color={THEME.success}
            change="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Published"
            value={publishedCount}
            color={THEME.primaryLight}
            change={`${Math.round((publishedCount / events.length) * 100)}% active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Registrations"
            value={totalRegistrations}
            color={THEME.info}
            change={`Avg: ${Math.round(totalRegistrations / events.length)}/event`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Pending Review"
            value={events.filter(e => e.status === 'pending').length}
            color={THEME.warning}
            change="Needs approval"
          />
        </Grid>
      </Grid>

      {/* Events List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Events
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
              Create Event
            </Button>
          </Stack>

          <TextField
            placeholder="Search by title or organizer..."
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Organizer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Registrations</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEvents.map(event => (
                  <TableRow key={event.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{event.title}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{event.date}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{event.organizer}</Typography></TableCell>
                    <TableCell>{renderStatusChip(event.status)}</TableCell>
                    <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{event.registrations}</Typography></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(event)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(event.id)}>
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
            count={filteredEvents.length}
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
          {editingEvent ? 'Edit Event' : 'Create Event'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Event Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Date"
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Organizer"
              value={formData.organizer || ''}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Status"
              select
              value={formData.status || 'draft'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              fullWidth
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
            </TextField>
            <TextField
              label="Registrations"
              type="number"
              value={formData.registrations || 0}
              onChange={(e) => setFormData({ ...formData, registrations: parseInt(e.target.value) })}
              fullWidth
              size="small"
            />
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
