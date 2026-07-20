import { Box, Button, Container, Grid, Stack, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  TrendingUp as AnalyticsIcon,
  People as PeopleIcon,
  BarChart as InsightIcon,
  Bolt as AutomationIcon,
  Lock as SecurityIcon,
  Speed as PerformanceIcon,
} from '@mui/icons-material';

export function PremiumLanding() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ minHeight: '100vh', background: isDark ? '#0F1117' : '#F9FAFB' }}>
      {/* Navigation */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2D3E5F' }}>
          Stakeholder Platform
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{
            background: 'linear-gradient(135deg, #2D3E5F 0%, #2563EB 100%)',
            boxShadow: 'none',
          }}
        >
          Sign In
        </Button>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={6}>
          {/* Hero Heading */}
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography
              variant="h1"
              sx={{
                mb: 2,
                background: isDark
                  ? 'linear-gradient(135deg, #E6EDF3 0%, #93C5FD 100%)'
                  : 'linear-gradient(135deg, #111827 0%, #2563EB 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Enterprise Stakeholder Intelligence
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: isDark ? '#8B949E' : '#6B7280',
                fontWeight: 400,
                lineHeight: 1.8,
              }}
            >
              Unified platform for managing events, registrations, stakeholders, and performance metrics
              across 10 distinct organizational roles. Real-time insights. Complete visibility.
            </Typography>
          </Box>

          {/* CTA Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                background: 'linear-gradient(135deg, #2D3E5F 0%, #2563EB 100%)',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                boxShadow: '0 12px 24px rgba(45, 62, 95, 0.25)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 32px rgba(45, 62, 95, 0.35)',
                },
              }}
            >
              Explore Demo
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: isDark ? '#484F58' : '#D1D5DB',
                color: isDark ? '#E6EDF3' : '#111827',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  background: isDark ? 'rgba(230, 237, 243, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: isDark ? '#8B949E' : '#9CA3AF',
                },
              }}
            >
              View Documentation
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* Features Grid */}
      <Box sx={{ py: 12, background: isDark ? '#161B22' : '#FFFFFF', borderTop: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}` }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Built for Enterprise
            </Typography>
            <Typography variant="h6" sx={{ color: isDark ? '#8B949E' : '#6B7280', fontWeight: 400 }}>
              Comprehensive tools for modern organizations
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { icon: PeopleIcon, title: '10 Role Views', desc: 'Tailored dashboards for each organizational role' },
              { icon: AnalyticsIcon, title: 'Real-time Analytics', desc: 'Live metrics and performance indicators' },
              { icon: InsightIcon, title: 'Deep Insights', desc: 'Uncover patterns in stakeholder engagement' },
              { icon: AutomationIcon, title: 'Smart Workflows', desc: 'Streamline event and registration management' },
              { icon: SecurityIcon, title: 'Enterprise Security', desc: 'Role-based access and data protection' },
              { icon: PerformanceIcon, title: 'Performance Optimized', desc: 'Lightning-fast UI with smooth interactions' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card
                    sx={{
                      h: '100%',
                      border: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`,
                      background: isDark ? '#0F1117' : '#F9FAFB',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: isDark
                          ? '0 12px 32px rgba(255, 255, 255, 0.08)'
                          : '0 12px 32px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          background: 'linear-gradient(135deg, #2D3E5F 0%, #2563EB 100%)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          opacity: 0.1,
                        }}
                      >
                        <Icon sx={{ color: '#2D3E5F' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#8B949E' : '#6B7280' }}>
                        {feature.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, borderTop: `1px solid ${isDark ? '#30363D' : '#E5E7EB'}`, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: isDark ? '#8B949E' : '#6B7280' }}>
              © 2026 Stakeholder Platform. Enterprise-grade event and stakeholder management.
            </Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              {['Security', 'Privacy', 'Terms', 'Support'].map((link) => (
                <Typography
                  key={link}
                  variant="caption"
                  sx={{
                    color: isDark ? '#8B949E' : '#6B7280',
                    cursor: 'pointer',
                    '&:hover': { color: isDark ? '#E6EDF3' : '#111827' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
