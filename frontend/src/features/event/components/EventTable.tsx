import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Event, EVENT_TYPE_COLORS, EVENT_STATUS_COLORS } from '../types/event.types';

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: number) => void;
  onPublish: (eventId: number) => void;
}

export function EventTable({ events, onEdit, onDelete, onPublish }: EventTableProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedEventId, setSelectedEventId] = React.useState<number | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, eventId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };

  const handleEdit = (event: Event) => {
    onEdit(event);
    handleMenuClose();
  };

  const handleDelete = (eventId: number) => {
    onDelete(eventId);
    handleMenuClose();
  };

  const handlePublish = (eventId: number) => {
    onPublish(eventId);
    handleMenuClose();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{event.title}</TableCell>
                <TableCell>
                  <Chip
                    label={event.eventType}
                    size="small"
                    sx={{
                      backgroundColor: EVENT_TYPE_COLORS[event.eventType] || '#ccc',
                      color: '#fff',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={event.status}
                    size="small"
                    sx={{
                      backgroundColor: EVENT_STATUS_COLORS[event.status] || '#ccc',
                      color: '#fff',
                    }}
                  />
                </TableCell>
                <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{event.maxCapacity}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, event.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleMenuClose}
      >
        {selectedEventId && (
          <>
            <MenuItem onClick={() => handleEdit(events.find(e => e.id === selectedEventId)!)}>
              Edit
            </MenuItem>
            {events.find(e => e.id === selectedEventId)?.status === 'draft' && (
              <MenuItem onClick={() => handlePublish(selectedEventId)}>
                Publish
              </MenuItem>
            )}
            <MenuItem onClick={() => handleDelete(selectedEventId)} sx={{ color: 'error.main' }}>
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
