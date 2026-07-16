import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  AssignmentTurnedIn as TaskIcon,
  EventNote as EventIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CompletedIcon,
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

export function EmployeeDashboard() {
  const events = useSelector((state: RootState) => state.mockEvents.items);

  // Employee metrics
  const employeeMetrics = {
    assignedEvents: 8,
    tasksInProgress: 12,
    completedTasks: 45,
    upcomingEvents: 3,
  };

  // Task progress
  const taskProgress = 75;

  // Weekly schedule
  const weeklySchedule = [
    { day: 'Mon', events: 2 },
    { day: 'Tue', events: 1 },
    { day: 'Wed', events: 3 },
    { day: 'Thu', events: 2 },
    { day: 'Fri', events: 1 },
    { day: 'Sat', events: 0 },
    { day: 'Sun', events: 0 },
  ];

  // Assigned tasks
  const assignedTasks = [
    { id: 1, title: 'Set up registration booth', event: 'Annual Conference', dueDate: '2026-07-20', status: 'pending' },
    { id: 2, title: 'Brief volunteers', event: 'Tech Workshop', dueDate: '2026-07-18', status: 'in_progress' },
    { id: 3, title: 'Prepare materials', event: 'Networking Event', dueDate: '2026-07-25', status: 'pending' },
    { id: 4, title: 'Check AV equipment', event: 'Leadership Seminar', dueDate: '2026-07-22', status: 'completed' },
  ];

  const myEvents = events.slice(0, 3);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        My Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Track your tasks and upcoming event assignments
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Assigned Events"
            value={employeeMetrics.assignedEvents}
            icon={<EventIcon />}
            color="#16A34A"
            change="+1 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Tasks in Progress"
            value={employeeMetrics.tasksInProgress}
            icon={<TaskIcon />}
            color="#15803D"
            change="-2 this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Completed Tasks"
            value={employeeMetrics.completedTasks}
            icon={<CompletedIcon />}
            color="#22C55E"
            change="+5 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Upcoming Events"
            value={employeeMetrics.upcomingEvents}
            icon={<ScheduleIcon />}
            color="#86EFAC"
            change="This week"
          />
        </Grid>
      </Grid>

      {/* Tasks Progress & Schedule */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Task Progress Ring */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Task Completion
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={taskProgress}
                  size={120}
                  sx={{
                    color: '#16A34A',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="textSecondary">
                    {`${Math.round(taskProgress)}%`}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="textSecondary">
                {employeeMetrics.completedTasks} of {employeeMetrics.completedTasks + employeeMetrics.tasksInProgress} tasks
                completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Schedule */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Weekly Schedule
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklySchedule}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="#16A34A" strokeWidth={2} name="Events" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assigned Tasks & Upcoming Events */}
      <Grid container spacing={3}>
        {/* Assigned Tasks Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                My Tasks
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Due</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedTasks.map((task) => (
                      <TableRow key={task.id} hover>
                        <TableCell>
                          <Stack>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {task.title}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {task.event}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                            size="small"
                            color={
                              task.status === 'completed'
                                ? 'success'
                                : task.status === 'in_progress'
                                  ? 'warning'
                                  : 'default'
                            }
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
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                My Upcoming Events
              </Typography>
              <Stack spacing={2}>
                {myEvents.map((event) => (
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
                      <Chip
                        label={event.status}
                        size="small"
                        color={event.status === 'published' ? 'success' : 'default'}
                      />
                    </Stack>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(event.startDate).toLocaleDateString()} at {event.location}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#16A34A' }}>
                        {event.registrations} registered
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#15803D' }}>
                        {event.attended} attending
                      </Typography>
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
                View All Events
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
