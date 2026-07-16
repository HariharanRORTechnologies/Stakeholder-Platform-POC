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

export function CustomerSupportDashboard() {
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
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
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
            color="#DC2626"
            change="-3 this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Resolution Time"
            value={`${supportMetrics.avgResolutionTime}h`}
            icon={<ResolutionIcon />}
            color="#15803D"
            change="-0.3h vs last week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Customer Satisfaction"
            value={supportMetrics.customerSatisfaction}
            icon={<SatisfactionIcon />}
            color="#22C55E"
            change="/ 5.0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="SLA Compliance"
            value={`${supportMetrics.slaCompliance}%`}
            icon={<SLAIcon />}
            color="#86EFAC"
            change="On track"
          />
        </Grid>
      </Grid>

      {/* Resolution Time & Ticket Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Resolution Time Trend */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Average Resolution Time Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={resolutionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgTime"
                    stroke="#16A34A"
                    strokeWidth={2}
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
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Tickets by Support Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supportCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="#16A34A" radius={[8, 8, 0, 0]} />
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
                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
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
