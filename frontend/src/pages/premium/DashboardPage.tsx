import {
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
  Typography,
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
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Favorite as ActivityIcon,
  TrendingUp as TrendingIcon,
  Groups as UsersIcon,
  Event as EventsIcon,
} from '@mui/icons-material';
import { PREMIUM_PALETTE } from '../../utils/premiumTheme';
import { PremiumKPICard } from '../../components/premium/PremiumKPICard';

// Sample data
const systemHealthData = [
  { time: '00:00', health: 98 },
  { time: '04:00', health: 95 },
  { time: '08:00', health: 99 },
  { time: '12:00', health: 97 },
  { time: '16:00', health: 96 },
  { time: '20:00', health: 98 },
  { time: '24:00', health: 99 },
];

const userGrowthData = [
  { month: 'Jan', users: 240 },
  { month: 'Feb', users: 320 },
  { month: 'Mar', users: 280 },
  { month: 'Apr', users: 420 },
  { month: 'May', users: 510 },
  { month: 'Jun', users: 600 },
];

const roleDistribution = [
  { name: 'Admin', value: 8, fill: PREMIUM_PALETTE.categorical[0] },
  { name: 'Manager', value: 24, fill: PREMIUM_PALETTE.categorical[1] },
  { name: 'Organizer', value: 32, fill: PREMIUM_PALETTE.categorical[2] },
  { name: 'Employee', value: 28, fill: PREMIUM_PALETTE.categorical[3] },
  { name: 'Volunteer', value: 18, fill: PREMIUM_PALETTE.categorical[4] },
];

const recentActivity = [
  { id: 1, action: 'Event Published', user: 'Sarah Johnson', time: '2 mins ago', icon: '📅', color: '#EA580C' },
  { id: 2, action: 'User Registered', user: 'Mike Chen', time: '15 mins ago', icon: '👤', color: '#0891B2' },
  { id: 3, action: 'Report Generated', user: 'Emma Davis', time: '1 hour ago', icon: '📊', color: '#2563EB' },
  { id: 4, action: 'Budget Updated', user: 'Alex Martinez', time: '3 hours ago', icon: '💰', color: '#059669' },
];

export function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>
      {/* Page Header */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            background: isDark
              ? 'linear-gradient(135deg, #E6EDF3 0%, #93C5FD 100%)'
              : 'linear-gradient(135deg, #111827 0%, #2563EB 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Enterprise Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: isDark ? '#8B949E' : '#6B7280' }}>
          System performance, user insights, and organizational metrics
        </Typography>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <PremiumKPICard
            title="Active Users"
            value={2847}
            unit="users"
            icon={<UsersIcon />}
            iconColor="#2563EB"
            trend={{ value: 12, label: 'vs last month', direction: 'up' }}
            sparklineData={[20, 35, 25, 40, 30, 45, 38, 50, 42, 55]}
            status="healthy"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PremiumKPICard
            title="Total Events"
            value={156}
            unit="events"
            icon={<EventsIcon />}
            iconColor="#EA580C"
            trend={{ value: 8, label: 'this month', direction: 'up' }}
            sparklineData={[30, 25, 40, 35, 50, 45, 55, 48, 60, 58]}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PremiumKPICard
            title="System Health"
            value={97.8}
            unit="%"
            icon={<ActivityIcon />}
            iconColor="#059669"
            trend={{ value: 2, label: 'uptime', direction: 'up' }}
            sparklineData={[95, 96, 98, 97, 99, 96, 98, 97, 99, 98]}
            status="healthy"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <PremiumKPICard
            title="Revenue (YTD)"
            value="$2.4M"
            subtitle="From sponsorships"
            icon={<TrendingIcon />}
            iconColor="#2D3E5F"
            trend={{ value: 24, label: 'vs YTD 2025', direction: 'up' }}
            sparklineData={[40, 50, 45, 60, 55, 70, 65, 80, 75, 85]}
            size="medium"
          />
        </Grid>
      </Grid>

      {/* Main Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* System Health - Large Hero Chart */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: '20px',
              border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
              background: isDark ? 'linear-gradient(135deg, #161B22 0%, #0F1117 100%)' : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
              boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.3)' : '0 8px 24px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  System Performance
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Chip
                    label="24 Hours"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #2D3E5F 0%, #2563EB 100%)',
                      color: 'white',
                    }}
                  />
                  <Chip label="Uptime: 99.9%" size="small" variant="outlined" />
                </Stack>
              </Stack>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={systemHealthData}>
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? '#30363D' : '#E5E7EB'}
                    vertical={false}
                  />
                  <XAxis dataKey="time" stroke={isDark ? '#8B949E' : '#6B7280'} />
                  <YAxis domain={[90, 100]} stroke={isDark ? '#8B949E' : '#6B7280'} />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#21262D' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
                      borderRadius: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="health"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorHealth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Distribution - Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: '20px',
              border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
              background: isDark ? 'linear-gradient(135deg, #161B22 0%, #0F1117 100%)' : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
              boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.3)' : '0 8px 24px rgba(0, 0, 0, 0.08)',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Role Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#21262D' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Growth + Activity Timeline */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* User Growth Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: '20px',
              border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
              background: isDark ? 'linear-gradient(135deg, #161B22 0%, #0F1117 100%)' : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
              boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.3)' : '0 8px 24px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                User Growth Trend
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#30363D' : '#E5E7EB'} />
                  <XAxis dataKey="month" stroke={isDark ? '#8B949E' : '#6B7280'} />
                  <YAxis stroke={isDark ? '#8B949E' : '#6B7280'} />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#21262D' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: '#2563EB', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity Timeline */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: '20px',
              border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
              background: isDark ? 'linear-gradient(135deg, #161B22 0%, #0F1117 100%)' : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
              boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.3)' : '0 8px 24px rgba(0, 0, 0, 0.08)',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Recent Activity
              </Typography>
              <Stack spacing={2} sx={{ flex: 1 }}>
                {recentActivity.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                      borderRadius: '12px',
                      borderLeft: `3px solid ${activity.color}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        background: `${activity.color}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                      }}
                    >
                      {activity.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#E6EDF3' : '#111827' }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#8B949E' : '#6B7280' }}>
                        by {activity.user} • {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
      <Card
        sx={{
          borderRadius: '20px',
          border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
          background: isDark ? 'linear-gradient(135deg, #161B22 0%, #0F1117 100%)' : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
          boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.3)' : '0 8px 24px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Top Events This Month
          </Typography>
          <TableContainer sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)' }}>
                  <TableCell sx={{ fontWeight: 700, color: isDark ? '#E6EDF3' : '#111827' }}>Event</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: isDark ? '#E6EDF3' : '#111827' }}>Registrations</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: isDark ? '#E6EDF3' : '#111827' }}>Attendance</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: isDark ? '#E6EDF3' : '#111827' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { event: 'Annual Conference 2026', reg: 1247, att: 1089, status: 'active' },
                  { event: 'Tech Summit', reg: 843, att: 756, status: 'active' },
                  { event: 'Leadership Forum', reg: 456, att: 0, status: 'upcoming' },
                ].map((row, idx) => (
                  <TableRow key={idx} hover sx={{ borderBottom: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}` }}>
                    <TableCell sx={{ color: isDark ? '#E6EDF3' : '#111827' }}>{row.event}</TableCell>
                    <TableCell sx={{ color: isDark ? '#E6EDF3' : '#111827' }}>{row.reg}</TableCell>
                    <TableCell sx={{ color: isDark ? '#E6EDF3' : '#111827' }}>{row.att}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          background: row.status === 'active' ? '#22C55E22' : '#2563EB22',
                          color: row.status === 'active' ? '#22C55E' : '#2563EB',
                          fontWeight: 600,
                        }}
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
