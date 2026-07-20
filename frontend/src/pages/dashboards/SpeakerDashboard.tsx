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
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  MicNone as SpeakerIcon,
  People as AudienceIcon,
  Star as FeedbackIcon,
  TrendingUp as EngagementIcon,
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

export function SpeakerDashboard() {
  const theme = useTheme();
  const themeMode = theme.palette.mode as 'light' | 'dark';
  const themeColors = getThemeAwareColors(themeMode);

  const events = useSelector((state: RootState) => state.mockEvents.items);

  // Speaker metrics
  const speakerMetrics = {
    engagements: 12,
    totalAudience: 1250,
    avgRating: 4.7,
    upcomingSessions: 3,
  };

  // Audience size data
  const audienceData = [
    { month: 'January', audience: 120 },
    { month: 'February', audience: 95 },
    { month: 'March', audience: 180 },
    { month: 'April', audience: 140 },
    { month: 'May', audience: 165 },
    { month: 'June', audience: 210 },
    { month: 'July', audience: 190 },
  ];

  // Engagement by topic
  const engagementByTopic = [
    { topic: 'Leadership', engagement: 92 },
    { topic: 'Innovation', engagement: 88 },
    { topic: 'Digital', engagement: 95 },
    { topic: 'Strategy', engagement: 85 },
    { topic: 'Culture', engagement: 90 },
  ];

  // Speaking history
  const speakingHistory = [
    {
      id: 1,
      title: 'Digital Transformation Strategy',
      event: 'Tech Summit 2026',
      date: '2026-06-15',
      audience: 180,
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Leadership Excellence',
      event: 'Annual Conference',
      date: '2026-05-20',
      audience: 250,
      rating: 4.6,
    },
    {
      id: 3,
      title: 'Innovation Culture',
      event: 'Business Forum',
      date: '2026-04-10',
      audience: 140,
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Future of Work',
      event: 'HR Summit',
      date: '2026-03-05',
      audience: 95,
      rating: 4.5,
    },
  ];

  // Upcoming sessions
  const upcomingSessions = events.slice(0, 3);

  return (
    <Box sx={{ p: 3, backgroundColor: themeColors.pageBackground, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: themeColors.textHint }}>
        Speaker Dashboard
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Track your speaking engagements and audience feedback
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Engagements"
            value={speakerMetrics.engagements}
            icon={<SpeakerIcon />}
            color={CHART_COLORS.forestGreen}
            change="+3 this year"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Audience Reached"
            value={`${(speakerMetrics.totalAudience / 1000).toFixed(1)}K`}
            icon={<AudienceIcon />}
            color={CHART_COLORS.purple}
            change="+180 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Audience Rating"
            value={speakerMetrics.avgRating}
            icon={<FeedbackIcon />}
            color={CHART_COLORS.indigo}
            change="/ 5.0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Upcoming Sessions"
            value={speakerMetrics.upcomingSessions}
            icon={<EngagementIcon />}
            color={CHART_COLORS.blue}
            change="This month"
          />
        </Grid>
      </Grid>

      {/* Audience Trends & Engagement */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Audience Size Trend
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={audienceData}>
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
                    dataKey="audience"
                    stroke={CHART_COLORS.purple}
                    strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                    dot={LINE_CHART_CONFIG.dot}
                    activeDot={LINE_CHART_CONFIG.activeDot}
                    name="Audience Size"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Speaker Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Speaker Profile
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Overall Rating
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating value={4.7} readOnly size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      4.7/5.0
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ pt: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Experience Level
                  </Typography>
                  <Chip label="Senior Speaker" color="success" size="small" />
                </Box>
                <Box sx={{ pt: 1 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Specializations
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    <Chip label="Leadership" size="small" variant="outlined" />
                    <Chip label="Digital" size="small" variant="outlined" />
                    <Chip label="Strategy" size="small" variant="outlined" />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Engagement by Topic */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Audience Engagement by Topic
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={engagementByTopic}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={themeMode === 'dark' ? '#334155' : '#e5e7eb'}
                    vertical={true}
                    opacity={0.3}
                  />
                  <XAxis type="number" domain={[0, 100]} stroke={themeColors.textHint} opacity={0.7} />
                  <YAxis dataKey="topic" type="category" width={80} stroke={themeColors.textHint} opacity={0.7} />
                  <Tooltip {...getTooltipStyles(themeMode === 'dark')} />
                  <Bar dataKey="engagement" fill={CHART_COLORS.purple} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Sessions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Upcoming Sessions
              </Typography>
              <Stack spacing={2}>
                {upcomingSessions.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      p: 2,
                      backgroundColor: themeColors.cardBackground,
                      borderRadius: '8px',
                      borderLeft: '4px solid #16A34A',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                      {new Date(event.startDate).toLocaleDateString()}
                    </Typography>
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
                Request Booking
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Speaking History */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Speaking History
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: themeColors.tableHeaderBackground }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Audience
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Rating
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {speakingHistory.map((session) => (
                  <TableRow key={session.id} hover>
                    <TableCell>
                      <Stack>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {session.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {session.date}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{session.event}</TableCell>
                    <TableCell align="right">
                      <Chip label={session.audience} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
                        <Rating value={session.rating} readOnly size="small" />
                        <Typography variant="caption">{session.rating.toFixed(1)}</Typography>
                      </Stack>
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
