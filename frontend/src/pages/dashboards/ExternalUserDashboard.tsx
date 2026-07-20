import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
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
  CardGiftcard as CertificateIcon,
  ThumbUp as FeedbackIcon,
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

export function ExternalUserDashboard() {
  const theme = useTheme();
  const themeMode = theme.palette.mode as 'light' | 'dark';
  const themeColors = getThemeAwareColors(themeMode);
  const events = useSelector((state: RootState) => state.mockEvents.items);

  // External user metrics
  const userMetrics = {
    registeredEvents: 12,
    attendedEvents: 9,
    certificatesEarned: 3,
    totalFeedback: 8,
  };

  // Event registration trend
  const registrationTrend = [
    { month: 'January', registered: 1, attended: 1 },
    { month: 'February', registered: 2, attended: 1 },
    { month: 'March', registered: 3, attended: 2 },
    { month: 'April', registered: 3, attended: 3 },
    { month: 'May', registered: 4, attended: 3 },
    { month: 'June', registered: 5, attended: 4 },
    { month: 'July', registered: 12, attended: 9 },
  ];

  // Event status breakdown
  const eventStatus = [
    { name: 'Attended', value: 9, fill: CHART_COLORS.forestGreen },
    { name: 'Registered', value: 2, fill: CHART_COLORS.blue },
    { name: 'Upcoming', value: 1, fill: CHART_COLORS.amber },
  ];

  // Certificates earned
  const certificates = [
    { id: 1, name: 'Advanced Leadership', event: 'Leadership Summit 2026', date: '2026-06-15' },
    { id: 2, name: 'Digital Innovation', event: 'Tech Conference', date: '2026-05-10' },
    { id: 3, name: 'Professional Development', event: 'Annual Conference', date: '2026-04-05' },
  ];

  // Attended events
  const attendedEvents = [
    {
      id: 1,
      event: 'Annual Conference 2026',
      date: '2026-06-15',
      attended: true,
      rating: 5,
    },
    {
      id: 2,
      event: 'Tech Workshop',
      date: '2026-05-20',
      attended: true,
      rating: 4,
    },
    {
      id: 3,
      event: 'Leadership Seminar',
      date: '2026-04-10',
      attended: true,
      rating: 5,
    },
    {
      id: 4,
      event: 'Networking Event',
      date: '2026-03-15',
      attended: true,
      rating: 4,
    },
  ];

  // Upcoming events
  const upcomingEvents = events.slice(0, 2);

  return (
    <Box sx={{ p: 3, backgroundColor: themeColors.pageBackground, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: themeColors.textHint }}>
        My Events
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        View your event registrations, attendance, and certificates
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Registered Events"
            value={userMetrics.registeredEvents}
            icon={<EventIcon />}
            color={CHART_COLORS.blue}
            change="+3 this year"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Attended Events"
            value={userMetrics.attendedEvents}
            icon={<EventIcon />}
            color={CHART_COLORS.forestGreen}
            change="75% attendance rate"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Certificates Earned"
            value={userMetrics.certificatesEarned}
            icon={<CertificateIcon />}
            color={CHART_COLORS.indigo}
            change="+1 this quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Feedback Given"
            value={userMetrics.totalFeedback}
            icon={<FeedbackIcon />}
            color={CHART_COLORS.orange}
            change="4.5/5 avg rating"
          />
        </Grid>
      </Grid>

      {/* Registration Trend & Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                Event Registration & Attendance Trend
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={registrationTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode === 'dark' ? '#334155' : '#e5e7eb'}
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis dataKey="month" stroke={themeColors.textHint} opacity={0.6} />
                  <YAxis stroke={themeColors.textHint} opacity={0.6} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Line
                    type="natural"
                    dataKey="registered"
                    stroke={CHART_COLORS.blue}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Registered"
                  />
                  <Line
                    type="natural"
                    dataKey="attended"
                    stroke={CHART_COLORS.forestGreen}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Attended"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Status Breakdown */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Event Status
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={eventStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eventStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Certificates & Upcoming Events */}
      <Grid container spacing={3}>
        {/* Certificates */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Certificates Earned
              </Typography>
              <Stack spacing={2}>
                {certificates.map((cert) => (
                  <Box
                    key={cert.id}
                    sx={{
                      p: 2,
                      backgroundColor: themeColors.cardBackground,
                      borderRadius: '8px',
                      borderLeft: '4px solid #16A34A',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {cert.name}
                      </Typography>
                      <Chip label="Verified" size="small" color="success" />
                    </Stack>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                      {cert.event}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Earned {cert.date}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  borderColor: '#16A34A',
                  color: '#16A34A',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                }}
              >
                View All Certificates
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Upcoming Events
              </Typography>
              <Stack spacing={2}>
                {upcomingEvents.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      p: 2,
                      backgroundColor: themeColors.cardBackground,
                      borderRadius: '8px',
                      borderLeft: '4px solid #16A34A',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                      {new Date(event.startDate).toLocaleDateString()} at {event.location}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#16A34A',
                        color: '#16A34A',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    >
                      Register Now
                    </Button>
                  </Box>
                ))}
              </Stack>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: '#16A34A',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#15803D',
                  },
                }}
              >
                Browse All Events
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attended Events */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Your Attended Events & Feedback
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: themeColors.tableHeaderBackground }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date Attended</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Your Rating
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendedEvents.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.event}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
                          <Rating value={item.rating} readOnly size="small" />
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="text"
                          sx={{
                            color: '#16A34A',
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Edit Feedback
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}
