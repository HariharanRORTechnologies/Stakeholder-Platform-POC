import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getThemeAwareColors } from '../utils/themeColors';

interface Attendee {
  id: number;
  name: string;
  email: string;
  phone: string;
  event: string;
  status: 'checked-in' | 'registered' | 'cancelled';
  registrationDate: string;
  ticketType: string;
}

const mockAttendees: Attendee[] = [
  { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1-555-0101', event: 'Annual Conference 2026', status: 'checked-in', registrationDate: '2026-07-01', ticketType: 'VIP' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1-555-0102', event: 'Tech Workshop', status: 'registered', registrationDate: '2026-07-05', ticketType: 'Standard' },
  { id: 3, name: 'Mike Davis', email: 'mike@example.com', phone: '+1-555-0103', event: 'Networking Event', status: 'checked-in', registrationDate: '2026-07-03', ticketType: 'Standard' },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', phone: '+1-555-0104', event: 'Leadership Seminar', status: 'checked-in', registrationDate: '2026-07-02', ticketType: 'Premium' },
  { id: 5, name: 'Alex Brown', email: 'alex@example.com', phone: '+1-555-0105', event: 'Annual Conference 2026', status: 'cancelled', registrationDate: '2026-06-28', ticketType: 'Standard' },
  { id: 6, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+1-555-0106', event: 'Tech Workshop', status: 'registered', registrationDate: '2026-07-08', ticketType: 'Standard' },
  { id: 7, name: 'David Miller', email: 'david@example.com', phone: '+1-555-0107', event: 'Networking Event', status: 'checked-in', registrationDate: '2026-07-04', ticketType: 'Premium' },
  { id: 8, name: 'Jennifer Taylor', email: 'jennifer@example.com', phone: '+1-555-0108', event: 'Annual Conference 2026', status: 'checked-in', registrationDate: '2026-07-06', ticketType: 'VIP' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'checked-in':
      return 'success';
    case 'registered':
      return 'info';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

export function AttendeesPage() {
  const theme = useTheme();
  const themeMode = theme.palette.mode as 'light' | 'dark';
  const themeColors = getThemeAwareColors(themeMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees] = useState<Attendee[]>(mockAttendees);

  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkedInCount = attendees.filter((a) => a.status === 'checked-in').length;
  const registeredCount = attendees.filter((a) => a.status === 'registered').length;
  const cancelledCount = attendees.filter((a) => a.status === 'cancelled').length;

  return (
    <Box sx={{ p: 3, backgroundColor: themeColors.pageBackground, minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: themeColors.textHint }}>
            Attendees
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage and view all event attendees
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<DownloadIcon />}>
          Export Attendees
        </Button>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                  Total Attendees
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {attendees.length}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  All registrations
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                  Checked In
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#22C55E' }}>
                  {checkedInCount}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {Math.round((checkedInCount / attendees.length) * 100)}% attendance rate
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                  Registered
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#3B82F6' }}>
                  {registeredCount}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Yet to check in
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: '12px', boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                  Cancelled
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#DC2626' }}>
                  {cancelledCount}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Cancellations
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendees Table */}
      <Card sx={{ borderRadius: '12px', boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Attendee List
            </Typography>
            <TextField
              size="small"
              placeholder="Search by name, email or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Stack>

          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${themeColors.border}` }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: themeColors.tableHeaderBackground }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ticket Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Registration Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {attendee.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <EmailIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="body2">{attendee.email}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{attendee.event}</TableCell>
                    <TableCell>
                      <Chip label={attendee.ticketType} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1).replace('-', ' ')}
                        size="small"
                        color={getStatusColor(attendee.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(attendee.registrationDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredAttendees.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="textSecondary">No attendees found matching your search.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
