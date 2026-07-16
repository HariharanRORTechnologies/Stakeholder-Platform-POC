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
  TrendingUp as ROIIcon,
  Visibility as VisibilityIcon,
  EventNote as EventIcon,
  AttachMoney as InvestmentIcon,
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

export function SponsorDashboard() {
  // Sponsor metrics
  const sponsorMetrics = {
    totalInvestment: 250000,
    roi: 325,
    brandVisibility: 1850000,
    sponsoredEvents: 8,
  };

  // ROI data
  const roiData = [
    { month: 'January', roi: 280 },
    { month: 'February', roi: 295 },
    { month: 'March', roi: 310 },
    { month: 'April', roi: 315 },
    { month: 'May', roi: 320 },
    { month: 'June', roi: 322 },
    { month: 'July', roi: 325 },
  ];

  // Benefits usage
  const benefitsUsage = [
    { benefit: 'Logo Placement', used: 85 },
    { benefit: 'Speaking Slots', used: 60 },
    { benefit: 'Booth Space', used: 90 },
    { benefit: 'Email Promotion', used: 75 },
    { benefit: 'Social Media', used: 95 },
  ];

  // Sponsored events
  const sponsoredEventsList = [
    {
      id: 1,
      event: 'Annual Conference 2026',
      status: 'active',
      investment: 50000,
      visibility: 450000,
    },
    {
      id: 2,
      event: 'Tech Summit',
      status: 'active',
      investment: 75000,
      visibility: 600000,
    },
    {
      id: 3,
      event: 'Leadership Forum',
      status: 'upcoming',
      investment: 60000,
      visibility: 400000,
    },
    {
      id: 4,
      event: 'Innovation Expo',
      status: 'upcoming',
      investment: 65000,
      visibility: 400000,
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Sponsor Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Monitor your sponsorship investments and brand visibility
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Investment"
            value={`$${(sponsorMetrics.totalInvestment / 1000).toFixed(0)}K`}
            icon={<InvestmentIcon />}
            color="#16A34A"
            change="Portfolio"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg ROI"
            value={`${sponsorMetrics.roi}%`}
            icon={<ROIIcon />}
            color="#15803D"
            change="+15% vs last quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Brand Visibility Reach"
            value={`${(sponsorMetrics.brandVisibility / 1000000).toFixed(1)}M`}
            icon={<VisibilityIcon />}
            color="#22C55E"
            change="Impressions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Sponsored Events"
            value={sponsorMetrics.sponsoredEvents}
            icon={<EventIcon />}
            color="#86EFAC"
            change="Active & Upcoming"
          />
        </Grid>
      </Grid>

      {/* ROI & Benefits */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* ROI Trend */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                ROI Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="roi" stroke="#16A34A" strokeWidth={2} name="ROI %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Investment Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Investment Summary
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Active Sponsorships</Typography>
                    <Chip label="2" size="small" color="success" />
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Upcoming</Typography>
                    <Chip label="2" size="small" color="info" />
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Completed</Typography>
                    <Chip label="4" size="small" variant="outlined" />
                  </Stack>
                </Box>
                <Box sx={{ pt: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Total committed: ${(sponsorMetrics.totalInvestment / 1000).toFixed(0)}K
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Benefits Usage */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Sponsorship Benefits Usage
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={benefitsUsage}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="benefit" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="used" fill="#16A34A" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sponsored Events */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Your Sponsored Events
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Investment
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Brand Reach
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sponsoredEventsList.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.event}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ${(item.investment / 1000).toFixed(0)}K
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {(item.visibility / 1000).toFixed(0)}K
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        size="small"
                        color={item.status === 'active' ? 'success' : 'info'}
                        variant="outlined"
                      />
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
