import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  EventNote as EventIcon,
  People as AttendeesIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

function KPICard({ title, value, icon, color, change }: StatCard) {
  return (
    <Card
      sx={{
        height: '100%',
        borderLeft: `4px solid ${color}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
              {value}
            </Typography>
            {change && (
              <Typography
                variant="caption"
                sx={{ color: change.includes('+') ? '#16A34A' : '#DC2626', mt: 1, display: 'block' }}
              >
                {change}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.2, fontSize: 40 }}>
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function EventOrganizerDashboard() {
  const analytics = useSelector((state: RootState) => state.mockAnalytics.eventAnalytics);
  const monthlyTrends = useSelector((state: RootState) => state.mockAnalytics.monthlyTrends);
  const events = useSelector((state: RootState) => state.mockEvents.items);

  // Event status breakdown
  const eventStatusData = [
    { name: 'Published', value: analytics.publishedEvents, fill: '#16A34A' },
    { name: 'Draft', value: analytics.draftEvents, fill: '#FCD34D' },
    { name: 'Cancelled', value: 2, fill: '#DC2626' },
  ];

  // Upcoming events list
  const upcomingEventsList = events.slice(0, 5);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Event Management Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Manage your events and track attendance
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Events"
            value={analytics.totalEvents}
            icon={<EventIcon />}
            color="#16A34A"
            change="+1 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Registrations"
            value={analytics.totalRegistrations}
            icon={<AttendeesIcon />}
            color="#15803D"
            change="+85 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Attendance Rate"
            value={`${analytics.averageAttendanceRate}%`}
            icon={<TrendingIcon />}
            color="#22C55E"
            change="+2.5% vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Event Rating"
            value={analytics.avgEventRating}
            icon={<TrendingIcon />}
            color="#86EFAC"
            change="/5.0"
          />
        </Grid>
      </Grid>

      {/* Event Status & Create Button */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Event Status Overview
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={eventStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Create Event */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: '#F0FDF4' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Create New Event
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Add a new event to your portfolio
              </Typography>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#16A34A',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  mb: 2,
                  '&:hover': {
                    backgroundColor: '#15803D',
                  },
                }}
              >
                New Event
              </Button>
              <Typography variant="caption" color="textSecondary">
                Quickly set up a new event with basic details and customize later.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Events Summary
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Published</Typography>
                    <Chip label={analytics.publishedEvents} size="small" color="success" />
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Draft</Typography>
                    <Chip label={analytics.draftEvents} size="small" color="warning" />
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Total Attendees</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#16A34A' }}>
                      {analytics.totalAttendees}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Trends */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Attendance Trends
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="events"
                    stroke="#16A34A"
                    strokeWidth={2}
                    name="Events"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="registrations"
                    stroke="#22C55E"
                    strokeWidth={2}
                    name="Registrations"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="attendance"
                    stroke="#86EFAC"
                    strokeWidth={2}
                    name="Actual Attendance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Events Table */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Your Upcoming Events
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Registrations
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Attendance
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingEventsList.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>
                      <Stack>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {event.title}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                    <TableCell align="right">{event.registrations}</TableCell>
                    <TableCell align="right">{event.attended}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        size="small"
                        color={event.status === 'published' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
