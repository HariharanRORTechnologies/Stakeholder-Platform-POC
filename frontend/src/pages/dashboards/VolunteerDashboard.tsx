import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  Button,
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
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  Favorite as VolunteerIcon,
  Schedule as HoursIcon,
  Star as SkillIcon,
  TrendingUp as ActivityIcon,
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

export function VolunteerDashboard() {
  const events = useSelector((state: RootState) => state.mockEvents.items);

  // Volunteer metrics
  const volunteerMetrics = {
    hoursContributed: 128,
    hoursGoal: 200,
    availableOpportunities: 15,
    upcomingVolunteerEvents: 4,
  };

  // Hours progress
  const hoursProgress = (volunteerMetrics.hoursContributed / volunteerMetrics.hoursGoal) * 100;

  // Skills
  const skills = [
    { id: 1, skill: 'Event Setup', level: 'Expert' },
    { id: 2, skill: 'Registration', level: 'Advanced' },
    { id: 3, skill: 'Guest Relations', level: 'Expert' },
    { id: 4, skill: 'Logistics', level: 'Intermediate' },
  ];

  // Monthly hours data
  const monthlyHours = [
    { month: 'January', hours: 12 },
    { month: 'February', hours: 18 },
    { month: 'March', hours: 22 },
    { month: 'April', hours: 15 },
    { month: 'May', hours: 24 },
    { month: 'June', hours: 20 },
    { month: 'July', hours: 17 },
  ];

  // Hours distribution by category
  const hoursDistribution = [
    { name: 'Setup', value: 45, fill: '#16A34A' },
    { name: 'Registration', value: 32, fill: '#22C55E' },
    { name: 'Support', value: 28, fill: '#86EFAC' },
    { name: 'Cleanup', value: 23, fill: '#DCFCE7' },
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, activity: 'Volunteered at Annual Conference', hours: 8, date: '2026-07-10' },
    { id: 2, activity: 'Set up booth for Tech Workshop', hours: 4, date: '2026-07-08' },
    { id: 3, activity: 'Guest registration support', hours: 3, date: '2026-07-05' },
    { id: 4, activity: 'Event breakdown & cleanup', hours: 2, date: '2026-07-03' },
  ];

  const opportunityEvents = events.slice(0, 3);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Volunteer Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Track your volunteer hours and find opportunities
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Hours Contributed"
            value={volunteerMetrics.hoursContributed}
            icon={<HoursIcon />}
            color="#16A34A"
            change="+18 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Available Opportunities"
            value={volunteerMetrics.availableOpportunities}
            icon={<VolunteerIcon />}
            color="#15803D"
            change="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Skills Certified"
            value="4"
            icon={<SkillIcon />}
            color="#22C55E"
            change="+1 this quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Upcoming Events"
            value={volunteerMetrics.upcomingVolunteerEvents}
            icon={<ActivityIcon />}
            color="#86EFAC"
            change="This week"
          />
        </Grid>
      </Grid>

      {/* Hours Progress & Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Hours Goal Progress */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Annual Hours Goal
              </Typography>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#16A34A' }}>
                {volunteerMetrics.hoursContributed} / {volunteerMetrics.hoursGoal} hours
              </Typography>
              <LinearProgress
                variant="determinate"
                value={hoursProgress}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#16A34A',
                    borderRadius: 6,
                  },
                  mb: 2,
                }}
              />
              <Typography variant="caption" color="textSecondary">
                {hoursProgress.toFixed(0)}% completed - {volunteerMetrics.hoursGoal - volunteerMetrics.hoursContributed} hours
                to reach goal
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Hours Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Hours by Activity
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={hoursDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}h`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {hoursDistribution.map((entry, index) => (
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

      {/* Monthly Hours Trend */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Monthly Volunteer Hours
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="#16A34A" strokeWidth={2} name="Hours" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills & Certifications */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Skills & Certifications
              </Typography>
              <Stack spacing={1.5}>
                {skills.map((skill) => (
                  <Box key={skill.id}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">{skill.skill}</Typography>
                      <Chip label={skill.level} size="small" color="success" variant="outlined" />
                    </Stack>
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
                View All Skills
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities & Opportunities */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recent Volunteer Activities
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Activity</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        Hours
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id} hover>
                        <TableCell>
                          <Typography variant="body2">{activity.activity}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={`${activity.hours}h`} size="small" variant="outlined" color="success" />
                        </TableCell>
                        <TableCell>{activity.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Volunteer Opportunities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Available Opportunities
              </Typography>
              <Stack spacing={2}>
                {opportunityEvents.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      p: 2,
                      backgroundColor: '#F0FDF4',
                      borderRadius: '8px',
                      borderLeft: '4px solid #16A34A',
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {event.title}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                      {new Date(event.startDate).toLocaleDateString()}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: '#16A34A',
                        color: '#16A34A',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '4px',
                      }}
                    >
                      Sign Up
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
                View All Opportunities
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
