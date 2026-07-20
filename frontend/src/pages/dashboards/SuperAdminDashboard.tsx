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
  BarChart,
  Bar,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  HealthAndSafety as SystemIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  TrendingUp as UpIcon,
} from '@mui/icons-material';
import { getThemeAwareColors } from '../../utils/themeColors';
import { CHART_COLORS, getTooltipStyles, LINE_CHART_CONFIG, BAR_CHART_CONFIG } from '../../utils/chartStyles';

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

export function SuperAdminDashboard() {
  const theme = useTheme();
  const themeMode = theme.palette.mode as 'light' | 'dark';
  const themeColors = getThemeAwareColors(themeMode);

  const analytics = useSelector((state: RootState) => state.mockAnalytics.eventAnalytics);
  const eventTypeDistribution = useSelector((state: RootState) => state.mockAnalytics.eventTypeDistribution);
  const monthlyTrends = useSelector((state: RootState) => state.mockAnalytics.monthlyTrends);

  // Mock system metrics
  const systemMetrics = {
    activeUsers: 1248,
    systemUptime: 99.98,
    systemLoad: 45.2,
    totalBandwidth: 2.4,
  };

  // Mock audit logs
  const auditLogs = [
    { id: 1, action: 'User Login', user: 'admin@example.com', timestamp: '2026-07-15 14:32' },
    { id: 2, action: 'Event Created', user: 'organizer@example.com', timestamp: '2026-07-15 13:45' },
    { id: 3, action: 'Permission Updated', user: 'super_admin@example.com', timestamp: '2026-07-15 12:15' },
    { id: 4, action: 'User Deleted', user: 'admin@example.com', timestamp: '2026-07-15 11:20' },
    { id: 5, action: 'Report Generated', user: 'manager@example.com', timestamp: '2026-07-15 10:05' },
  ];

  const roleDistribution = [
    { name: 'Employees', value: 450, fill: CHART_COLORS.forestGreen },
    { name: 'Volunteers', value: 320, fill: CHART_COLORS.blue },
    { name: 'Speakers', value: 85, fill: CHART_COLORS.purple },
    { name: 'Sponsors', value: 120, fill: CHART_COLORS.teal },
    { name: 'External Users', value: 273, fill: CHART_COLORS.amber },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: themeColors.pageBackground, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: themeColors.textHint }}>
        System Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Monitor system health, user activity, and platform metrics
      </Typography>

      {/* System Health KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Active Users"
            value={systemMetrics.activeUsers}
            icon={<PeopleIcon />}
            color={CHART_COLORS.forestGreen}
            change="+128 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="System Uptime"
            value={`${systemMetrics.systemUptime}%`}
            icon={<SystemIcon />}
            color={CHART_COLORS.emerald}
            change="+0.05% vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="System Load"
            value={`${systemMetrics.systemLoad}%`}
            icon={<StorageIcon />}
            color={CHART_COLORS.blue}
            change="Normal"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Events Created"
            value={analytics.totalEvents}
            icon={<UpIcon />}
            color={CHART_COLORS.purple}
            change="+2 this month"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* User Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                User Distribution by Role
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Type Distribution */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                Events by Type
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={eventTypeDistribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={getTooltipStyles(themeMode === 'dark').cursor.fill}
                    vertical={false}
                    opacity={0.3}
                  />
                  <XAxis dataKey="type" stroke={themeColors.textHint} opacity={0.7} />
                  <YAxis stroke={themeColors.textHint} opacity={0.7} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Bar
                    dataKey="count"
                    fill={CHART_COLORS.forestGreen}
                    radius={BAR_CHART_CONFIG.radius}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Activity Timeline */}
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
                System Activity Timeline
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={getTooltipStyles(themeMode === 'dark').cursor.fill}
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis dataKey="month" stroke={themeColors.textHint} opacity={0.6} />
                  <YAxis stroke={themeColors.textHint} opacity={0.6} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                    iconType="line"
                  />
                  <Line
                    type="natural"
                    dataKey="events"
                    stroke={CHART_COLORS.forestGreen}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Events"
                  />
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

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
              background: themeMode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.5)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: themeColors.textHint }}>
                Platform Stats
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ pb: 2, borderBottom: `1px solid ${themeMode === 'dark' ? '#334155' : '#e2e8f0'}` }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Total Registrations
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '700', color: CHART_COLORS.blue }}>
                      {analytics.totalRegistrations}
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ pb: 2, borderBottom: `1px solid ${themeMode === 'dark' ? '#334155' : '#e2e8f0'}` }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Total Attendees
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '700', color: CHART_COLORS.purple }}>
                      {analytics.totalAttendees}
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ pb: 2, borderBottom: `1px solid ${themeMode === 'dark' ? '#334155' : '#e2e8f0'}` }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      Avg Attendance Rate
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '700', color: CHART_COLORS.forestGreen }}>
                      {analytics.averageAttendanceRate}%
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0 }}>
                    <Typography variant="body2" color="textSecondary">
                      Avg Rating
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '700', color: CHART_COLORS.orange }}>
                      {analytics.avgEventRating}/5
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Audit Logs */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Recent Audit Logs
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: themeColors.tableHeaderBackground }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell align="center">
                      <Chip label="Logged" size="small" color="success" variant="outlined" />
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
