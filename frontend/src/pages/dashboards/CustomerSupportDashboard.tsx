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
} from 'recharts';
import {
  FactCheck as TicketIcon,
  TrendingDown as ResolutionIcon,
  ThumbUp as SatisfactionIcon,
  Schedule as SLAIcon,
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

export function CustomerSupportDashboard() {
  const theme = useTheme();
  const themeMode = theme.palette.mode as 'light' | 'dark';
  const themeColors = getThemeAwareColors(themeMode);
  // Support metrics
  const supportMetrics = {
    openTickets: 24,
    avgResolutionTime: 2.5,
    customerSatisfaction: 4.6,
    slaCompliance: 96,
  };

  // Resolution time data
  const resolutionTimeData = [
    { week: 'Week 1', avgTime: 3.2 },
    { week: 'Week 2', avgTime: 2.8 },
    { week: 'Week 3', avgTime: 2.6 },
    { week: 'Week 4', avgTime: 2.5 },
    { week: 'Week 5', avgTime: 2.4 },
    { week: 'Week 6', avgTime: 2.5 },
    { week: 'Week 7', avgTime: 2.5 },
  ];

  // Ticket status breakdown
  const ticketStatus = [
    { status: 'Open', count: 24, color: '#DC2626' },
    { status: 'In Progress', count: 18, color: '#F59E0B' },
    { status: 'Awaiting Response', count: 12, color: '#3B82F6' },
    { status: 'Resolved', count: 156, color: '#16A34A' },
  ];

  // Support categories
  const supportCategories = [
    { category: 'Technical', tickets: 28 },
    { category: 'Billing', tickets: 12 },
    { category: 'Account', tickets: 18 },
    { category: 'General', tickets: 15 },
    { category: 'Feedback', tickets: 8 },
  ];

  // Recent tickets
  const recentTickets = [
    {
      id: 'TKT-001',
      subject: 'Cannot login to account',
      priority: 'high',
      status: 'in_progress',
      age: '2h',
      satisfaction: null,
    },
    {
      id: 'TKT-002',
      subject: 'Event registration not working',
      priority: 'high',
      status: 'open',
      age: '1h',
      satisfaction: null,
    },
    {
      id: 'TKT-003',
      subject: 'Invoice inquiry',
      priority: 'medium',
      status: 'awaiting_response',
      age: '30m',
      satisfaction: null,
    },
    {
      id: 'TKT-004',
      subject: 'Certificate download issue',
      priority: 'medium',
      status: 'in_progress',
      age: '45m',
      satisfaction: null,
    },
    {
      id: 'TKT-005',
      subject: 'Password reset request',
      priority: 'low',
      status: 'resolved',
      age: '2h',
      satisfaction: 5,
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: themeColors.pageBackground, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: themeColors.textHint }}>
        Support Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Monitor support tickets and customer satisfaction
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Open Tickets"
            value={supportMetrics.openTickets}
            icon={<TicketIcon />}
            color={CHART_COLORS.rose}
            change="-3 this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Resolution Time"
            value={`${supportMetrics.avgResolutionTime}h`}
            icon={<ResolutionIcon />}
            color={CHART_COLORS.indigo}
            change="-0.3h vs last week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Customer Satisfaction"
            value={supportMetrics.customerSatisfaction}
            icon={<SatisfactionIcon />}
            color={CHART_COLORS.forestGreen}
            change="/ 5.0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="SLA Compliance"
            value={`${supportMetrics.slaCompliance}%`}
            icon={<SLAIcon />}
            color={CHART_COLORS.emerald}
            change="On track"
          />
        </Grid>
      </Grid>

      {/* Resolution Time & Ticket Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Resolution Time Trend */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                Average Resolution Time Trend
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={resolutionTimeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode === 'dark' ? '#334155' : '#e5e7eb'}
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis dataKey="week" stroke={themeColors.textHint} opacity={0.6} />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} stroke={themeColors.textHint} opacity={0.6} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Line
                    type="natural"
                    dataKey="avgTime"
                    stroke={CHART_COLORS.indigo}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Avg Resolution Time (hours)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Ticket Status Summary */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Ticket Status Overview
              </Typography>
              <Stack spacing={2}>
                {ticketStatus.map((item) => (
                  <Box key={item.status}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2">{item.status}</Typography>
                      <Chip
                        label={item.count}
                        size="small"
                        sx={{
                          backgroundColor: item.color,
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block' }}>
                Total tickets: {ticketStatus.reduce((sum, item) => sum + item.count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Support Categories */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                Tickets by Support Category
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={supportCategories}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode === 'dark' ? '#334155' : '#e5e7eb'}
                    vertical={false}
                    opacity={0.3}
                  />
                  <XAxis dataKey="category" stroke={themeColors.textHint} opacity={0.7} />
                  <YAxis stroke={themeColors.textHint} opacity={0.7} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Bar dataKey="tickets" fill={CHART_COLORS.amber} radius={BAR_CHART_CONFIG.radius} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Tickets */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Recent Tickets
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: themeColors.tableHeaderBackground }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ticket ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Priority
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Age
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Satisfaction
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        size="small"
                        color={
                          ticket.priority === 'high'
                            ? 'error'
                            : ticket.priority === 'medium'
                              ? 'warning'
                              : 'default'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          ticket.status === 'in_progress'
                            ? 'In Progress'
                            : ticket.status === 'awaiting_response'
                              ? 'Awaiting Response'
                              : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)
                        }
                        size="small"
                        color={
                          ticket.status === 'resolved'
                            ? 'success'
                            : ticket.status === 'open'
                              ? 'error'
                              : 'info'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">{ticket.age}</TableCell>
                    <TableCell align="center">
                      {ticket.satisfaction ? (
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
                          <Rating value={ticket.satisfaction} readOnly size="small" />
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          Pending
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
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
                        View
                      </Button>
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
