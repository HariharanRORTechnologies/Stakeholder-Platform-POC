import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { selectEvent } from '../features/mockData/store/eventsSlice';
import { showToast } from '../features/mockData/store/uiSlice';
import { Event } from '../features/mockData/store/eventsSlice';

function EventCard({ event }: { event: Event }) {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = () => {
    dispatch(selectEvent(event));
    setDialogOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={event.imageUrl}
          alt={event.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip label={event.eventType} size="small" color="primary" variant="outlined" />
            <Chip
              label={event.status}
              size="small"
              color={event.status === 'published' ? 'success' : 'default'}
            />
          </Stack>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            {event.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {event.description.substring(0, 80)}...
          </Typography>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Registrations
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {event.registrations}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Rating
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {event.avgRating}★
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<ViewIcon />}
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>{event.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  DESCRIPTION
                </Typography>
                <Typography variant="body2">{event.description}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  LOCATION
                </Typography>
                <Typography variant="body2">{event.location}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  DATE & TIME
                </Typography>
                <Typography variant="body2">
                  {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleTimeString()}
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    MAX CAPACITY
                  </Typography>
                  <Typography variant="body2">{event.maxCapacity}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    BUDGET
                  </Typography>
                  <Typography variant="body2">${event.budget.toLocaleString()}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip label={event.eventType} color="primary" size="small" />
                <Chip label={event.status} size="small" />
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained">Edit Event</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function EventsPage() {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.mockEvents.items);
  const currentRole = useSelector((state: RootState) => state.ui.currentRole);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState(0);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || event.eventType === selectedType;
    return matchesSearch && matchesType;
  });

  const eventTypes = Array.from(new Set(events.map(e => e.eventType)));

  const handleCreateEvent = () => {
    dispatch(showToast({
      message: 'Create Event form would open here',
      type: 'info',
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Events
        </Typography>
        {['admin', 'manager', 'organizer'].includes(currentRole) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateEvent}>
            Create Event
          </Button>
        )}
      </Stack>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Stack spacing={2}>
          <TextField
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip
              label="All Types"
              onClick={() => setSelectedType(null)}
              variant={selectedType === null ? 'filled' : 'outlined'}
              color="primary"
            />
            {eventTypes.map((type) => (
              <Chip
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                onClick={() => setSelectedType(type)}
                variant={selectedType === type ? 'filled' : 'outlined'}
                color="primary"
              />
            ))}
          </Stack>
        </Stack>
      </Card>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onChange={(_, newValue) => setViewMode(newValue)} sx={{ mb: 2 }}>
        <Tab label="Grid View" />
        <Tab label="List View" />
      </Tabs>

      {/* Grid View */}
      {viewMode === 0 && (
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* List View */}
      {viewMode === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Registrations
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Rating
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {event.location}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={event.eventType} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(event.startDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{event.registrations}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {event.avgRating}★
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={event.status}
                      size="small"
                      color={event.status === 'published' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      <Button size="small" startIcon={<ViewIcon />}>
                        View
                      </Button>
                      {['admin', 'organizer'].includes(currentRole) && (
                        <>
                          <Button size="small" startIcon={<EditIcon />}>
                            Edit
                          </Button>
                          <Button size="small" startIcon={<DeleteIcon />} color="error">
                            Delete
                          </Button>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
