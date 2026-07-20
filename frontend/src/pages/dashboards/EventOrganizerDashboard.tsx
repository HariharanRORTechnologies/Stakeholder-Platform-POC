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
  useTheme,
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
import { getThemeAwareColors } from '../../utils/themeColors';
import { CHART_COLORS, getTooltipStyles, LINE_CHART_CONFIG } from '../../utils/chartStyles';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

function KPICard({ title, value, icon, color, change }: StatCard) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        borderLeft: `5px solid ${color}`,
        borderRadius: '12px',
        background: isDarkMode
          ? `rgba(30, 41, 59, 0.8)`
          : `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${color}05, transparent)`,
          pointerEvents: 'none',
        },
        '&:hover': {
          boxShadow: isDarkMode
            ? '0 20px 25px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-6px)',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: '700', mt: 1, color: color }}>
              {value}
            </Typography>
            {change && (
              <Typography
                variant="caption"
                sx={{
                  color: change.includes('+') ? CHART_COLORS.success : CHART_COLORS.error,
                  mt: 1,
                  display: 'block',
                  fontWeight: 600,
                }}
              >
                {change}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              color,
              opacity: isDarkMode ? 0.15 : 0.1,
              fontSize: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '12px',
              background: isDarkMode ? `rgba(255,255,255,0.03)` : `${color}10`,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function EventOrganizerDashboard() {
  const theme = useTheme();
  const themeMode = theme.palette.mode as 'light' | 'dark';
  const themeColors = getThemeAwareColors(themeMode);

  const analytics = useSelector((state: RootState) => state.mockAnalytics.eventAnalytics);
  const monthlyTrends = useSelector((state: RootState) => state.mockAnalytics.monthlyTrends);
  const events = useSelector((state: RootState) => state.mockEvents.items);

  // Event status breakdown
  const eventStatusData = [
    { name: 'Published', value: analytics.publishedEvents, fill: CHART_COLORS.forestGreen },
    { name: 'Draft', value: analytics.draftEvents, fill: CHART_COLORS.amber },
    { name: 'Cancelled', value: 2, fill: CHART_COLORS.rose },
  ];

  // Upcoming events list
  const upcomingEventsList = events.slice(0, 5);

  return (
    <Box sx={{ p: 3, backgroundColor: themeColors.pageBackground, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: themeColors.textHint }}>
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
            color={CHART_COLORS.forestGreen}
            change="+1 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Registrations"
            value={analytics.totalRegistrations}
            icon={<AttendeesIcon />}
            color={CHART_COLORS.blue}
            change="+85 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Attendance Rate"
            value={`${analytics.averageAttendanceRate}%`}
            icon={<TrendingIcon />}
            color={CHART_COLORS.purple}
            change="+2.5% vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Event Rating"
            value={analytics.avgEventRating}
            icon={<TrendingIcon />}
            color={CHART_COLORS.emerald}
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
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: themeColors.cardBackground }}>
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
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                Attendance Trends
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode === 'dark' ? '#334155' : '#e5e7eb'}
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis dataKey="month" stroke={themeColors.textHint} opacity={0.6} />
                  <YAxis yAxisId="left" stroke={themeColors.textHint} opacity={0.6} />
                  <YAxis yAxisId="right" orientation="right" stroke={themeColors.textHint} opacity={0.6} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Line
                    yAxisId="left"
                    type="natural"
                    dataKey="events"
                    stroke={CHART_COLORS.forestGreen}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Events"
                  />
                  <Line
                    yAxisId="left"
                    type="natural"
                    dataKey="registrations"
                    stroke={CHART_COLORS.blue}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Registrations"
                  />
                  <Line
                    yAxisId="right"
                    type="natural"
                    dataKey="attendance"
                    stroke={CHART_COLORS.purple}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
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
                <TableRow sx={{ backgroundColor: themeColors.tableHeaderBackground }}>
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
