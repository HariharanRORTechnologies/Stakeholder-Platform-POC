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

export function SuperAdminDashboard() {
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
    { name: 'Employees', value: 450, fill: '#16A34A' },
    { name: 'Volunteers', value: 320, fill: '#15803D' },
    { name: 'Speakers', value: 85, fill: '#22C55E' },
    { name: 'Sponsors', value: 120, fill: '#86EFAC' },
    { name: 'External Users', value: 273, fill: '#DCFCE7' },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
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
            color="#16A34A"
            change="+128 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="System Uptime"
            value={`${systemMetrics.systemUptime}%`}
            icon={<SystemIcon />}
            color="#15803D"
            change="+0.05% vs last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="System Load"
            value={`${systemMetrics.systemLoad}%`}
            icon={<StorageIcon />}
            color="#22C55E"
            change="Normal"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Events Created"
            value={analytics.totalEvents}
            icon={<UpIcon />}
            color="#86EFAC"
            change="+2 this month"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* User Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                User Distribution by Role
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Type Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Events by Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventTypeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#16A34A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Activity Timeline */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                System Activity Timeline
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="events" stroke="#16A34A" name="Events" strokeWidth={2} />
                  <Line type="monotone" dataKey="registrations" stroke="#22C55E" name="Registrations" strokeWidth={2} />
                  <Line type="monotone" dataKey="attendance" stroke="#86EFAC" name="Attendance" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Platform Stats
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Total Registrations</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#16A34A' }}>
                      {analytics.totalRegistrations}
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Total Attendees</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#15803D' }}>
                      {analytics.totalAttendees}
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Avg Attendance Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#22C55E' }}>
                      {analytics.averageAttendanceRate}%
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Avg Rating</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#86EFAC' }}>
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
                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
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
