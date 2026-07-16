import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEvents } from '../hooks/useEvents';
import { EventForm } from '../components/EventForm';
import { EventTable } from '../components/EventTable';
import { EVENT_TYPES, EVENT_STATUSES, CreateEventRequest, UpdateEventRequest, Event } from '../types/event.types';

export function EventsListPage() {
  const {
    events,
    loading,
    error,
    pagination,
    filters,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    publishEvent,
    setFilters,
  } = useEvents();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getEvents(pagination.page, pagination.limit, filters);
  }, [filters, pagination.page, pagination.limit]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  const handleTypeFilter = (value: string) => {
    setSelectedType(value);
    setFilters({ ...filters, eventType: value || undefined });
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    setFilters({ ...filters, status: value || undefined });
  };

  const handleCreateClick = () => {
    setEditingEvent(undefined);
    setFormOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateEventRequest | UpdateEventRequest) => {
    setSubmitting(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, data as UpdateEventRequest);
      } else {
        await createEvent(data as CreateEventRequest);
      }
      setFormOpen(false);
      setEditingEvent(undefined);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handlePublishClick = async (eventId: number) => {
    try {
      await publishEvent(eventId);
    } catch (error) {
      console.error('Publish error:', error);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    getEvents(newPage, pagination.limit, filters);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={selectedType}
                  onChange={(e) => handleTypeFilter(e.target.value)}
                  label="Event Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {EVENT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {EVENT_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateClick}
              >
                New Event
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <EventTable
            events={events}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onPublish={handlePublishClick}
          />

          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <EventForm
        open={formOpen}
        event={editingEvent}
        onClose={() => {
          setFormOpen(false);
          setEditingEvent(undefined);
        }}
        onSubmit={handleFormSubmit}
        loading={submitting}
      />
    </Box>
  );
}
