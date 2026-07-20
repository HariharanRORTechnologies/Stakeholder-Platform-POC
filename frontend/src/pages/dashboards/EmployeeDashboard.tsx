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
  useTheme,
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
                  color: change.includes('+') || change.includes('-') ? CHART_COLORS.success : CHART_COLORS.error,
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

export function EmployeeDashboard() {
  const theme = useTheme();
  const themeMode = theme.palette.mode as 'light' | 'dark';
  const themeColors = getThemeAwareColors(themeMode);

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
    <Box sx={{ p: 3, backgroundColor: themeColors.pageBackground, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: themeColors.textHint }}>
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
            color={CHART_COLORS.forestGreen}
            change="+1 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Tasks in Progress"
            value={employeeMetrics.tasksInProgress}
            icon={<TaskIcon />}
            color={CHART_COLORS.amber}
            change="-2 this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Completed Tasks"
            value={employeeMetrics.completedTasks}
            icon={<CompletedIcon />}
            color={CHART_COLORS.emerald}
            change="+5 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Upcoming Events"
            value={employeeMetrics.upcomingEvents}
            icon={<ScheduleIcon />}
            color={CHART_COLORS.blue}
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
                    color: theme.palette.primary.main,
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
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                Weekly Schedule
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weeklySchedule}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode === 'dark' ? '#334155' : '#e5e7eb'}
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis dataKey="day" stroke={themeColors.textHint} opacity={0.6} />
                  <YAxis stroke={themeColors.textHint} opacity={0.6} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Line
                    type="natural"
                    dataKey="events"
                    stroke={CHART_COLORS.forestGreen}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Events"
                  />
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
                    <TableRow sx={{ backgroundColor: themeColors.tableHeaderBackground }}>
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
                      backgroundColor: themeColors.cardBackground,
                      borderRadius: '8px',
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
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
                      <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        {event.registrations} registered
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.dark }}>
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
