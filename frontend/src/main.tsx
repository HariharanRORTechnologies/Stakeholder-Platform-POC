import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './store/store';
import { AppWithLayout } from './AppWithLayout';

import './index.css';

// Premium Enterprise Green Color Palette
const COLORS = {
  primary: '#16A34A',      // Primary Green
  darkGreen: '#15803D',    // Dark Green
  lightGreen: '#DCFCE7',   // Light Green
  accentGreen: '#22C55E',  // Accent Green
  background: '#FFFFFF',  // Background
  surface: '#F8FAFC',      // Surface
  card: '#FFFFFF',         // Card
  border: '#E5E7EB',       // Border
  textPrimary: '#111827',  // Text Primary
  textSecondary: '#6B7280',// Text Secondary
  success: '#22C55E',      // Success
  warning: '#F59E0B',      // Warning
  error: '#EF4444',        // Error
  info: '#0EA5E9',         // Info
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: COLORS.primary,
      light: COLORS.lightGreen,
      dark: COLORS.darkGreen,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: COLORS.accentGreen,
      light: COLORS.lightGreen,
      dark: COLORS.darkGreen,
      contrastText: '#FFFFFF',
    },
    success: {
      main: COLORS.success,
      light: '#86EFAC',
      dark: '#16A34A',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: COLORS.warning,
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    error: {
      main: COLORS.error,
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#FFFFFF',
    },
    info: {
      main: COLORS.info,
      light: '#38BDF8',
      dark: '#0284C7',
      contrastText: '#FFFFFF',
    },
    background: {
      default: COLORS.surface,
      paper: COLORS.card,
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
      disabled: '#9CA3AF',
    },
    divider: COLORS.border,
    action: {
      active: COLORS.primary,
      hover: 'rgba(22, 163, 74, 0.04)',
      selected: 'rgba(22, 163, 74, 0.08)',
      disabled: '#D1D5DB',
      disabledBackground: '#F3F4F6',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      color: COLORS.textPrimary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
      color: COLORS.textPrimary,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: COLORS.textPrimary,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: COLORS.textPrimary,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: COLORS.textPrimary,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: COLORS.textPrimary,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: COLORS.textPrimary,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57,
      color: COLORS.textSecondary,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: COLORS.textPrimary,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      color: COLORS.textSecondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.66,
      color: COLORS.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.66,
      color: COLORS.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
        contained: {
          backgroundColor: COLORS.primary,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: COLORS.darkGreen,
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
          },
          '&:disabled': {
            backgroundColor: '#E5E7EB',
            color: COLORS.textSecondary,
          },
        },
        outlined: {
          borderColor: COLORS.border,
          color: COLORS.primary,
          '&:hover': {
            borderColor: COLORS.primary,
            backgroundColor: 'rgba(22, 163, 74, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          backgroundColor: COLORS.card,
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderColor: 'rgba(22, 163, 74, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            '& fieldset': {
              borderColor: COLORS.border,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(22, 163, 74, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.primary,
              boxShadow: `0 0 0 4px rgba(22, 163, 74, 0.1)`,
            },
          },
          '& .MuiOutlinedInput-input': {
            color: COLORS.textPrimary,
            '&::placeholder': {
              color: COLORS.textSecondary,
              opacity: 0.7,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
        filled: {
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          color: COLORS.darkGreen,
          '&.MuiChip-colorPrimary': {
            backgroundColor: 'rgba(22, 163, 74, 0.15)',
            color: COLORS.darkGreen,
          },
        },
        outlined: {
          borderColor: COLORS.border,
          color: COLORS.textPrimary,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'collapse',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.surface,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: COLORS.textPrimary,
          backgroundColor: COLORS.surface,
          borderBottomColor: COLORS.border,
          padding: '12px 16px',
        },
        body: {
          color: COLORS.textPrimary,
          borderBottomColor: COLORS.border,
          padding: '12px 16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(22, 163, 74, 0.02)',
          },
          '&:hover': {
            backgroundColor: 'rgba(22, 163, 74, 0.05)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(22, 163, 74, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(22, 163, 74, 0.12)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.card,
          color: COLORS.textPrimary,
          borderBottom: `1px solid ${COLORS.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: COLORS.card,
          borderRight: `1px solid ${COLORS.border}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.card,
          backgroundImage: 'none',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: COLORS.textPrimary,
          '&.Mui-disabled': {
            color: COLORS.textSecondary,
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppWithLayout />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
