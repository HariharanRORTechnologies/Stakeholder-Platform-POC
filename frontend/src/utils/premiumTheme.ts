import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
    h2: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6, letterSpacing: '0.005em' },
    body2: { fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.6 },
    caption: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4, textTransform: 'none' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.003em' },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2D3E5F',
      light: '#4A5F8F',
      dark: '#1A2742',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#D1D5DB',
    },
    divider: '#E5E7EB',
    success: { main: '#22C55E', light: '#86EFAC', dark: '#16A34A' },
    warning: { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
    error: { main: '#DC2626', light: '#FCA5A5', dark: '#991B1B' },
    info: { main: '#2563EB', light: '#93C5FD', dark: '#1E40AF' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(45, 62, 95, 0.15)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(45, 62, 95, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
            borderColor: '#D1D5DB',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#F9FAFB',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D1D5DB',
          },
        },
      },
    },
  },
};

export const createPremiumTheme = (mode: 'light' | 'dark') => {
  if (mode === 'dark') {
    return createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode: 'dark',
        background: {
          default: '#0F1117',
          paper: '#161B22',
        },
        text: {
          primary: '#E6EDF3',
          secondary: '#8B949E',
          disabled: '#484F58',
        },
        divider: '#30363D',
      },
    } as ThemeOptions);
  }

  return createTheme(baseTheme as ThemeOptions);
};

// Color tokens for charts
export const PREMIUM_PALETTE = {
  categorical: [
    '#2D3E5F', // Deep Indigo
    '#2563EB', // Royal Blue
    '#9333EA', // Purple
    '#0891B2', // Teal
    '#059669', // Emerald
    '#EA580C', // Orange
    '#D97706', // Amber
    '#E11D48', // Rose
  ],
  sequential: '#2D3E5F',
  diverging: { warm: '#EA580C', neutral: '#E5E7EB', cool: '#2563EB' },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    serious: '#DC2626',
    critical: '#991B1B',
  },
};
