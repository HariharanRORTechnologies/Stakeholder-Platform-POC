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
  TrendingUp as ROIIcon,
  Visibility as VisibilityIcon,
  EventNote as EventIcon,
  AttachMoney as InvestmentIcon,
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
                  color: change.includes('+') ? CHART_COLORS.success : CHART_COLORS.error,
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

export function SponsorDashboard() {
  const theme = useTheme();
  const themeMode = theme.palette.mode as 'light' | 'dark';
  const themeColors = getThemeAwareColors(themeMode);
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
    <Box sx={{ p: 3, backgroundColor: themeColors.pageBackground, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: themeColors.textHint }}>
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
            color={CHART_COLORS.indigo}
            change="Portfolio"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg ROI"
            value={`${sponsorMetrics.roi}%`}
            icon={<ROIIcon />}
            color={CHART_COLORS.blue}
            change="+15% vs last quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Brand Visibility Reach"
            value={`${(sponsorMetrics.brandVisibility / 1000000).toFixed(1)}M`}
            icon={<VisibilityIcon />}
            color={CHART_COLORS.orange}
            change="Impressions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Sponsored Events"
            value={sponsorMetrics.sponsoredEvents}
            icon={<EventIcon />}
            color={CHART_COLORS.emerald}
            change="Active & Upcoming"
          />
        </Grid>
      </Grid>

      {/* ROI & Benefits */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* ROI Trend */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                ROI Trend
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={roiData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode === 'dark' ? '#334155' : '#e5e7eb'}
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis dataKey="month" stroke={themeColors.textHint} opacity={0.6} />
                  <YAxis stroke={themeColors.textHint} opacity={0.6} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Line
                    type="natural"
                    dataKey="roi"
                    stroke={CHART_COLORS.indigo}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="ROI %"
                  />
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
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: themeMode === 'dark' ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: themeColors.textHint }}>
                Sponsorship Benefits Usage
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={benefitsUsage}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode === 'dark' ? '#334155' : '#e5e7eb'}
                    vertical={true}
                    opacity={0.3}
                  />
                  <XAxis type="number" domain={[0, 100]} stroke={themeColors.textHint} opacity={0.7} />
                  <YAxis dataKey="benefit" type="category" width={120} stroke={themeColors.textHint} opacity={0.7} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Bar dataKey="used" fill={CHART_COLORS.orange} radius={[0, 8, 8, 0]} />
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
                <TableRow sx={{ backgroundColor: themeColors.tableHeaderBackground }}>
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
