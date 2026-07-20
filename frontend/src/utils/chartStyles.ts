/**
 * Chart Styling Utilities - Enterprise-grade chart configurations
 * Provides sophisticated, muted color palettes and chart styling patterns
 * with full dark mode support
 */

export const CHART_COLORS = {
  // Primary colors
  forestGreen: '#16A34A',
  emerald: '#22C55E',
  blue: '#3B82F6',
  skyBlue: '#60A5FA',
  purple: '#8B5CF6',
  indigo: '#6366F1',
  teal: '#14B8A6',
  amber: '#F59E0B',
  orange: '#F97316',
  rose: '#EC4899',
  slate: '#64748B',

  // Status colors
  success: '#16A34A',
  pending: '#F59E0B',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#3B82F6',
};

export const getChartGridColor = (isDarkMode: boolean): string => {
  return isDarkMode ? '#334155' : '#e5e7eb';
};

export const getTooltipStyles = (isDarkMode: boolean) => ({
  contentStyle: {
    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
    borderRadius: '8px',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    padding: '8px 12px',
  },
  labelStyle: {
    color: isDarkMode ? '#f1f5f9' : '#1f2937',
    fontSize: '12px',
    fontWeight: 600,
  },
  cursor: { fill: isDarkMode ? '#475569' : '#d1d5db' },
});

export const getCardGradientColor = (color: string, isDarkMode: boolean): string => {
  // Return a subtle gradient background color for KPI cards
  if (isDarkMode) {
    // Dark mode: lighter shade with lower opacity
    switch (color) {
      case CHART_COLORS.forestGreen:
        return 'rgba(22, 163, 74, 0.1)';
      case CHART_COLORS.blue:
        return 'rgba(59, 130, 246, 0.1)';
      case CHART_COLORS.purple:
        return 'rgba(139, 92, 246, 0.1)';
      case CHART_COLORS.indigo:
        return 'rgba(99, 102, 241, 0.1)';
      case CHART_COLORS.teal:
        return 'rgba(20, 184, 166, 0.1)';
      case CHART_COLORS.amber:
        return 'rgba(245, 158, 11, 0.1)';
      case CHART_COLORS.orange:
        return 'rgba(249, 115, 22, 0.1)';
      case CHART_COLORS.rose:
        return 'rgba(236, 72, 153, 0.1)';
      default:
        return 'rgba(100, 116, 139, 0.1)';
    }
  } else {
    // Light mode: color with opacity
    switch (color) {
      case CHART_COLORS.forestGreen:
        return 'rgba(37, 99, 235, 0.15)';
      case CHART_COLORS.blue:
        return 'rgba(59, 130, 246, 0.15)';
      case CHART_COLORS.purple:
        return 'rgba(139, 92, 246, 0.15)';
      case CHART_COLORS.indigo:
        return 'rgba(99, 102, 241, 0.15)';
      case CHART_COLORS.teal:
        return 'rgba(20, 184, 166, 0.15)';
      case CHART_COLORS.amber:
        return 'rgba(245, 158, 11, 0.15)';
      case CHART_COLORS.orange:
        return 'rgba(249, 115, 22, 0.15)';
      case CHART_COLORS.rose:
        return 'rgba(236, 72, 153, 0.15)';
      default:
        return 'rgba(100, 116, 139, 0.15)';
    }
  }
};

export const getGradientId = (color: string): string => {
  return `gradient-${color.replace('#', '')}`;
};

// Line chart configuration
export const LINE_CHART_CONFIG = {
  strokeWidth: 2.5,
  dot: {
    r: 4,
    fill: '#ffffff',
    strokeWidth: 2,
  },
  activeDot: {
    r: 6,
    strokeWidth: 2,
  },
  type: 'natural' as const,
};

// Bar chart configuration
export const BAR_CHART_CONFIG = {
  radius: [8, 8, 0, 0] as [number, number, number, number],
  barGap: '25%',
  categoryGap: '20%',
};

// Pie chart configuration
export const PIE_CHART_CONFIG = {
  outerRadius: 80,
  innerRadius: 0, // Set to 60 for donut charts
  labelLine: false,
  font: {
    fontSize: 12,
    fontWeight: 500,
  },
};

// Card styling for KPI cards with gradients
export const KPI_CARD_STYLES = (color: string, isDarkMode: boolean) => ({
  borderLeft: `4px solid ${color}`,
  borderRadius: '12px',
  backgroundColor: getCardGradientColor(color, isDarkMode),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: isDarkMode
      ? '0 12px 20px rgba(0, 0, 0, 0.4)'
      : '0 12px 20px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-4px)',
  },
});

// Responsive container defaults
export const RESPONSIVE_CONTAINER_CONFIG = {
  width: '100%',
  height: 300,
};

// Chart-specific color mappings for consistency
export const METRIC_COLOR_MAP = {
  events: CHART_COLORS.forestGreen,
  registrations: CHART_COLORS.blue,
  attendance: CHART_COLORS.purple,
  stakeholders: CHART_COLORS.teal,
  budget: CHART_COLORS.indigo,
  revenue: CHART_COLORS.indigo,
  csr: CHART_COLORS.amber,
  initiatives: CHART_COLORS.amber,
  sports: CHART_COLORS.orange,
  notifications: CHART_COLORS.rose,
  completed: CHART_COLORS.forestGreen,
  pending: CHART_COLORS.amber,
  hours: CHART_COLORS.teal,
  speakers: CHART_COLORS.purple,
  roi: CHART_COLORS.indigo,
  tickets: CHART_COLORS.rose,
  resolved: CHART_COLORS.forestGreen,
  open: CHART_COLORS.rose,
  draft: CHART_COLORS.amber,
  published: CHART_COLORS.forestGreen,
} as const;
