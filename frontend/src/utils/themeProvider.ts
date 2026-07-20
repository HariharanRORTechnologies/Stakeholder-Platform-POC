import { createTheme, Theme } from '@mui/material';

// Modern Color Palette
const LIGHT_COLORS = {
  primary: '#16A34A',      // Green
  darkGreen: '#15803D',    // Dark Green
  lightGreen: '#86EFAC',   // Light Green
  accentGreen: '#22C55E',  // Accent Green
  background: '#F7F8FA',   // Clean neutral background
  surface: '#F9FAFB',      // Subtle surface
  card: '#FFFFFF',         // White cards
  border: '#E5E7EB',       // Neutral border
  textPrimary: '#1F2937',  // Dark text
  textSecondary: '#6B7280',// Medium gray
  success: '#22C55E',      // Green (for success only)
  warning: '#F59E0B',      // Orange
  error: '#EF4444',        // Red
  info: '#0284C7',         // Blue
};

const DARK_COLORS = {
  primary: '#22C55E',      // Brighter green for dark mode
  darkGreen: '#15803D',    // Dark green
  lightGreen: '#86EFAC',   // Light green
  accentGreen: '#22C55E',  // Accent green
  background: '#111827',   // Dark background
  surface: '#1F2937',      // Dark surface
  card: '#1F2937',         // Dark card
  border: '#374151',       // Dark border
  textPrimary: '#F3F4F6',  // Light text
  textSecondary: '#D1D5DB',// Light gray
  success: '#22C55E',      // Green
  warning: '#F59E0B',      // Orange
  error: '#EF4444',        // Red
  info: '#0284C7',         // Blue
};

function createCustomTheme(mode: 'light' | 'dark'): Theme {
  const colors = mode === 'light' ? LIGHT_COLORS : DARK_COLORS;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: colors.lightGreen,
        dark: colors.darkGreen,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: colors.accentGreen,
        light: colors.lightGreen,
        dark: colors.darkGreen,
        contrastText: '#FFFFFF',
      },
      success: {
        main: colors.success,
        light: mode === 'light' ? '#86EFAC' : '#86EFAC',
        dark: mode === 'light' ? '#16A34A' : '#22C55E',
        contrastText: '#FFFFFF',
      },
      warning: {
        main: colors.warning,
        light: mode === 'light' ? '#FBBF24' : '#FCD34D',
        dark: mode === 'light' ? '#D97706' : '#F59E0B',
        contrastText: '#FFFFFF',
      },
      error: {
        main: colors.error,
        light: mode === 'light' ? '#F87171' : '#FCA5A5',
        dark: mode === 'light' ? '#DC2626' : '#F87171',
        contrastText: '#FFFFFF',
      },
      info: {
        main: colors.info,
        light: mode === 'light' ? '#38BDF8' : '#7DD3FC',
        dark: mode === 'light' ? '#0284C7' : '#38BDF8',
        contrastText: '#FFFFFF',
      },
      background: {
        default: colors.background,
        paper: colors.card,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
        disabled: mode === 'light' ? '#9CA3AF' : '#64748B',
      },
      divider: colors.border,
      action: {
        active: colors.primary,
        hover: mode === 'light'
          ? 'rgba(22, 163, 74, 0.04)'
          : 'rgba(34, 197, 94, 0.08)',
        selected: mode === 'light'
          ? 'rgba(22, 163, 74, 0.08)'
          : 'rgba(34, 197, 94, 0.12)',
        disabled: mode === 'light' ? '#D1D5DB' : '#475569',
        disabledBackground: mode === 'light' ? '#F3F4F6' : '#1E293B',
      },
    },
    typography: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      h1: {
        fontSize: '32px',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
        color: colors.textPrimary,
      },
      h2: {
        fontSize: '26px',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.005em',
        color: colors.textPrimary,
      },
      h3: {
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: 1.4,
        color: colors.textPrimary,
      },
      h4: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: 1.4,
        color: colors.textPrimary,
      },
      h5: {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: 1.5,
        color: colors.textPrimary,
      },
      h6: {
        fontSize: '15px',
        fontWeight: 600,
        lineHeight: 1.5,
        color: colors.textPrimary,
      },
      body1: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.6,
        color: colors.textPrimary,
      },
      body2: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.6,
        color: colors.textSecondary,
      },
      subtitle1: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1.6,
        color: colors.textPrimary,
      },
      subtitle2: {
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.5,
        color: colors.textSecondary,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: 1.5,
        letterSpacing: '0.003em',
      },
      caption: {
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.4,
        color: colors.textSecondary,
      },
      overline: {
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: 1.4,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
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
            fontWeight: 500,
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: 'none',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
          },
          contained: {
            backgroundColor: colors.primary,
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: colors.darkGreen,
              boxShadow: 'none',
            },
            '&:disabled': {
              backgroundColor: mode === 'light' ? '#E5E7EB' : '#374151',
              color: colors.textSecondary,
            },
          },
          outlined: {
            borderColor: colors.border,
            color: colors.primary,
            '&:hover': {
              borderColor: colors.primary,
              backgroundColor: mode === 'light'
                ? 'rgba(37, 99, 235, 0.04)'
                : 'rgba(59, 130, 246, 0.08)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            boxShadow: 'none',
            backgroundColor: colors.card,
            transition: 'border-color 0.2s ease',
            '&:hover': {
              borderColor: colors.primary,
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
                borderColor: colors.border,
              },
              '&:hover fieldset': {
                borderColor: mode === 'light'
                  ? 'rgba(22, 163, 74, 0.3)'
                  : 'rgba(34, 197, 94, 0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary,
                boxShadow: mode === 'light'
                  ? '0 0 0 4px rgba(22, 163, 74, 0.1)'
                  : '0 0 0 4px rgba(34, 197, 94, 0.2)',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: colors.textPrimary,
              '&::placeholder': {
                color: colors.textSecondary,
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
            fontSize: '14px',
          },
          filled: {
            backgroundColor: mode === 'light'
              ? 'rgba(22, 163, 74, 0.1)'
              : 'rgba(34, 197, 94, 0.15)',
            color: mode === 'light' ? colors.darkGreen : colors.accentGreen,
          },
          outlined: {
            borderColor: colors.border,
            color: colors.textPrimary,
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
            backgroundColor: mode === 'light' ? colors.surface : '#0f172a',
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
            color: colors.textPrimary,
            backgroundColor: mode === 'light' ? colors.surface : '#0f172a',
            borderBottomColor: colors.border,
            padding: '12px 16px',
          },
          body: {
            color: colors.textPrimary,
            borderBottomColor: colors.border,
            padding: '12px 16px',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(even)': {
              backgroundColor: mode === 'light'
                ? 'rgba(22, 163, 74, 0.02)'
                : 'rgba(34, 197, 94, 0.05)',
            },
            '&:hover': {
              backgroundColor: mode === 'light'
                ? 'rgba(22, 163, 74, 0.05)'
                : 'rgba(34, 197, 94, 0.08)',
            },
            '&.Mui-selected': {
              backgroundColor: mode === 'light'
                ? 'rgba(22, 163, 74, 0.08)'
                : 'rgba(34, 197, 94, 0.12)',
              '&:hover': {
                backgroundColor: mode === 'light'
                  ? 'rgba(22, 163, 74, 0.12)'
                  : 'rgba(34, 197, 94, 0.16)',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? colors.card : colors.card,
            color: colors.textPrimary,
            borderBottom: `1px solid ${colors.border}`,
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.card,
            borderRight: `1px solid ${colors.border}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: colors.card,
            backgroundImage: 'none',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: colors.textPrimary,
            '&.Mui-disabled': {
              color: colors.textSecondary,
            },
          },
        },
      },
    },
  });
}

export { createCustomTheme };
