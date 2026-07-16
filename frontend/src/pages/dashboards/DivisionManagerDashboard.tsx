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
  LinearProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  Groups as TeamIcon,
  MonetizationOn as BudgetIcon,
  EventNote as EventIcon,
  TrendingUp as PerformanceIcon,
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

export function DivisionManagerDashboard() {
  const monthlyTrends = useSelector((state: RootState) => state.mockAnalytics.monthlyTrends);

  // Mock division metrics
  const divisionMetrics = {
    teamSize: 85,
    allocatedBudget: 150000,
    usedBudget: 89250,
    divisionEvents: 12,
  };

  // Budget utilization
  const budgetPercentage = (divisionMetrics.usedBudget / divisionMetrics.allocatedBudget) * 100;

  // Team performance
  const teamPerformance = [
    { team: 'Events', productivity: 92 },
    { team: 'Operations', productivity: 88 },
    { team: 'Marketing', productivity: 85 },
    { team: 'Finance', productivity: 90 },
    { team: 'HR', productivity: 86 },
  ];

  // Team distribution
  const teamDistribution = [
    { name: 'Full-time', value: 45, fill: '#16A34A' },
    { name: 'Part-time', value: 25, fill: '#22C55E' },
    { name: 'Contractors', value: 15, fill: '#86EFAC' },
  ];

  // Upcoming events
  const upcomingEvents = [
    { id: 1, title: 'Q3 Planning Session', date: '2026-07-20', attendees: 45 },
    { id: 2, title: 'Team Building Event', date: '2026-07-25', attendees: 78 },
    { id: 3, title: 'Annual Gala', date: '2026-08-10', attendees: 250 },
    { id: 4, title: 'Quarterly Review', date: '2026-08-15', attendees: 85 },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Division Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Manage your division's budget, team, and events
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Team Size"
            value={divisionMetrics.teamSize}
            icon={<TeamIcon />}
            color="#16A34A"
            change="+5 this quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Allocated Budget"
            value={`$${(divisionMetrics.allocatedBudget / 1000).toFixed(0)}K`}
            icon={<BudgetIcon />}
            color="#15803D"
            change="For Q3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Division Events"
            value={divisionMetrics.divisionEvents}
            icon={<EventIcon />}
            color="#22C55E"
            change="+3 planned"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Team Productivity"
            value="88.2%"
            icon={<PerformanceIcon />}
            color="#86EFAC"
            change="+2.1% vs last month"
          />
        </Grid>
      </Grid>

      {/* Budget & Team Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Budget Utilization */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Budget Utilization
              </Typography>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#16A34A' }}>
                {budgetPercentage.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={budgetPercentage}
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
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Used:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ${(divisionMetrics.usedBudget / 1000).toFixed(0)}K
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Remaining:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ${((divisionMetrics.allocatedBudget - divisionMetrics.usedBudget) / 1000).toFixed(0)}K
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Team Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={teamDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {teamDistribution.map((entry, index) => (
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

      {/* Team Performance & Monthly Trends */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Team Productivity by Department
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={teamPerformance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="team" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="productivity" fill="#16A34A" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Event Trends
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="events" stroke="#16A34A" strokeWidth={2} name="Events" />
                  <Line type="monotone" dataKey="registrations" stroke="#22C55E" strokeWidth={2} name="Registrations" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Events */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Upcoming Division Events
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Expected Attendees
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingEvents.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell align="right">{event.attendees}</TableCell>
                    <TableCell align="center">
                      <Chip label="Planned" size="small" color="info" variant="outlined" />
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
