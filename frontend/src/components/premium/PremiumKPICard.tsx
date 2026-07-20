import { Card, CardContent, Stack, Typography, Box, useTheme } from '@mui/material';

interface PremiumKPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
  sparklineData?: number[];
  status?: 'healthy' | 'warning' | 'critical';
  size?: 'small' | 'medium' | 'large';
}

export function PremiumKPICard({
  title,
  value,
  unit,
  subtitle,
  icon,
  iconColor = '#2563EB',
  trend,
}: PremiumKPICardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '12px',
        border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
        boxShadow: 'none',
        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#9CA3AF' : '#6B7280' }}>
              {title}
            </Typography>
            {icon && (
              <Box sx={{ color: iconColor, opacity: 0.15, fontSize: 32 }}>
                {icon}
              </Box>
            )}
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              {value} {unit && <span style={{ fontSize: '14px', fontWeight: 400 }}>{unit}</span>}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                {subtitle}
              </Typography>
            )}
          </Stack>

          {trend && (
            <Typography
              variant="caption"
              sx={{
                color: trend.direction === 'up' ? '#22C55E' : '#EF4444',
                fontWeight: 600,
              }}
            >
              {trend.direction === 'up' ? '+' : '-'}{trend.value}% {trend.label}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
