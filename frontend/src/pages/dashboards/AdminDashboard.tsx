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

export function AdminDashboard() {
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
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
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
            color="#16A34A"
            change="+45 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Pending Approvals"
            value={adminMetrics.pendingApprovals}
            icon={<ApprovalIcon />}
            color="#DC2626"
            change="Needs review"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Published Events"
            value={adminMetrics.publishedEvents}
            icon={<EventIcon />}
            color="#15803D"
            change="+1 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Event Rating"
            value={adminMetrics.avgRating}
            icon={<TrendingIcon />}
            color="#22C55E"
            change="/5.0"
          />
        </Grid>
      </Grid>

      {/* Pending Approvals Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: '#fef2f2' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Pending Approvals
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#DC2626' }}>
                {adminMetrics.pendingApprovals}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
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
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Weekly User Activity
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="logins" fill="#16A34A" radius={[8, 8, 0, 0]} name="Logins" />
                  <Bar dataKey="registrations" fill="#22C55E" radius={[8, 8, 0, 0]} name="New Registrations" />
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
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" stroke="#16A34A" strokeWidth={2} name="Registrations" />
                  <Line type="monotone" dataKey="attendance" stroke="#22C55E" strokeWidth={2} name="Attendance" />
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
                    borderColor: '#16A34A',
                    color: '#16A34A',
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
                    borderColor: '#16A34A',
                    color: '#16A34A',
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
                    borderColor: '#16A34A',
                    color: '#16A34A',
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
                    borderColor: '#16A34A',
                    color: '#16A34A',
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
                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
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
