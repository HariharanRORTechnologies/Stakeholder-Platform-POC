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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  VerifiedUser as ApprovalIcon,
  Group as UsersIcon,
  EventNote as EventIcon,
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
  themeMode: 'light' | 'dark';
}

function KPICard({ title, value, icon, color, change, themeMode }: StatCard) {
  const isDarkMode = themeMode === 'dark';

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

export function AdminDashboard() {
  const theme = useTheme();
  const themeMode = theme.palette.mode as 'light' | 'dark';
  const themeColors = getThemeAwareColors(themeMode);

  const analytics = useSelector((state: RootState) => state.mockAnalytics.eventAnalytics);
  const monthlyTrends = useSelector((state: RootState) => state.mockAnalytics.monthlyTrends);

  // Mock data for admin
  const adminMetrics = {
    activeUsers: 562,
    pendingApprovals: 12,
    publishedEvents: analytics.publishedEvents,
    avgRating: analytics.avgEventRating,
  };

  // Mock user activity
  const userActivityData = [
    { day: 'Mon', logins: 145, registrations: 23 },
    { day: 'Tue', logins: 167, registrations: 34 },
    { day: 'Wed', logins: 142, registrations: 18 },
    { day: 'Thu', logins: 189, registrations: 41 },
    { day: 'Fri', logins: 201, registrations: 52 },
    { day: 'Sat', logins: 98, registrations: 14 },
    { day: 'Sun', logins: 67, registrations: 9 },
  ];

  // Mock recent registrations
  const recentRegistrations = [
    {
      id: 1,
      name: 'John Smith',
      event: 'Annual Conference 2026',
      date: '2026-07-15',
      status: 'approved',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      event: 'Tech Workshop',
      date: '2026-07-14',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Mike Davis',
      event: 'Networking Event',
      date: '2026-07-13',
      status: 'approved',
    },
    {
      id: 4,
      name: 'Emma Wilson',
      event: 'Leadership Seminar',
      date: '2026-07-12',
      status: 'approved',
    },
    {
      id: 5,
      name: 'Alex Brown',
      event: 'Annual Conference 2026',
      date: '2026-07-11',
      status: 'pending',
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: themeColors.pageBackground, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: themeColors.textHint }}>
        Admin Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Manage users, events, and approvals
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Active Users"
            value={adminMetrics.activeUsers}
            icon={<UsersIcon />}
            color={CHART_COLORS.forestGreen}
            change="+45 this month"
            themeMode={themeMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Pending Approvals"
            value={adminMetrics.pendingApprovals}
            icon={<ApprovalIcon />}
            color={CHART_COLORS.rose}
            change="Needs review"
            themeMode={themeMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Published Events"
            value={adminMetrics.publishedEvents}
            icon={<EventIcon />}
            color={CHART_COLORS.emerald}
            change="+1 this month"
            themeMode={themeMode}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Event Rating"
            value={adminMetrics.avgRating}
            icon={<TrendingIcon />}
            color={CHART_COLORS.blue}
            change="/5.0"
            themeMode={themeMode}
          />
        </Grid>
      </Grid>

      {/* Pending Approvals Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: themeColors.cardBackground }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                Pending Approvals
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#DC2626' }}>
                {adminMetrics.pendingApprovals}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                }}
              >
                Review Now
              </Button>
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  • 8 user registrations
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  • 3 event proposals
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  • 1 sponsor application
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* User Activity Chart */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                Weekly User Activity
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={userActivityData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode === 'dark' ? '#334155' : '#e5e7eb'}
                    vertical={false}
                    opacity={0.3}
                  />
                  <XAxis dataKey="day" stroke={themeColors.textHint} opacity={0.7} />
                  <YAxis stroke={themeColors.textHint} opacity={0.7} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Bar
                    dataKey="logins"
                    fill={CHART_COLORS.forestGreen}
                    radius={[8, 8, 0, 0]}
                    name="Logins"
                  />
                  <Bar
                    dataKey="registrations"
                    fill={CHART_COLORS.blue}
                    radius={[8, 8, 0, 0]}
                    name="New Registrations"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Trends & Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Registration Trends
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyTrends}>
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
                    dataKey="registrations"
                    stroke={CHART_COLORS.blue}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Registrations"
                  />
                  <Line
                    type="natural"
                    dataKey="attendance"
                    stroke={CHART_COLORS.purple}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Attendance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<AddIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                  }}
                >
                  Create User
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                  }}
                >
                  Publish Event
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                  }}
                >
                  View Reports
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                  }}
                >
                  Manage Permissions
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Registrations Table */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Recent Registrations
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: themeColors.tableHeaderBackground }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRegistrations.map((reg) => (
                  <TableRow key={reg.id} hover>
                    <TableCell>{reg.name}</TableCell>
                    <TableCell>{reg.event}</TableCell>
                    <TableCell>{reg.date}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                        size="small"
                        color={reg.status === 'approved' ? 'success' : 'warning'}
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
