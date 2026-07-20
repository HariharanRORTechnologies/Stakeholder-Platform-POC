import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h1: { fontSize: '32px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2 },
    h2: { fontSize: '26px', fontWeight: 600, letterSpacing: '-0.005em', lineHeight: 1.3 },
    h3: { fontSize: '20px', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '18px', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '16px', fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: '15px', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '14px', fontWeight: 400, lineHeight: 1.6, letterSpacing: '0.002em' },
    body2: { fontSize: '14px', fontWeight: 400, lineHeight: 1.6 },
    caption: { fontSize: '12px', fontWeight: 500, lineHeight: 1.4, textTransform: 'none' },
    button: { fontWeight: 500, textTransform: 'none', letterSpacing: '0.003em' },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#06B6D4',
      light: '#22D3EE',
      dark: '#0891B2',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      disabled: '#D1D5DB',
    },
    divider: '#E5E7EB',
    success: { main: '#22C55E', light: '#86EFAC', dark: '#16A34A' },
    warning: { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
    error: { main: '#EF4444', light: '#FCA5A5', dark: '#DC2626' },
    info: { main: '#06B6D4', light: '#67E8F9', dark: '#0891B2' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#1D4ED8',
          },
        },
        outlined: {
          borderColor: '#D1D5DB',
          '&:hover': {
            borderColor: '#9CA3AF',
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: 'none',
          backgroundColor: '#FFFFFF',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#D1D5DB',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          height: '28px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#F9FAFB',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D1D5DB',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563EB',
            borderWidth: '1px',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F9FAFB',
            borderColor: '#E5E7EB',
            fontWeight: 600,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#374151',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#E5E7EB',
          padding: '12px 16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
  },
};

const darkTheme: ThemeOptions = {
  typography: baseTheme.typography,
  palette: {
    mode: 'dark',
    primary: baseTheme.palette?.primary,
    secondary: baseTheme.palette?.secondary,
    background: {
      default: '#111827',
      paper: '#1F2937',
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#D1D5DB',
      disabled: '#6B7280',
    },
    divider: '#374151',
    success: baseTheme.palette?.success,
    warning: baseTheme.palette?.warning,
    error: baseTheme.palette?.error,
    info: baseTheme.palette?.info,
  },
  components: {
    MuiButton: baseTheme.components?.MuiButton,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid #374151',
          boxShadow: 'none',
          backgroundColor: '#1F2937',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#4B5563',
          },
        },
      },
    },
    MuiPaper: baseTheme.components?.MuiPaper,
    MuiChip: baseTheme.components?.MuiChip,
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#111827',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#374151',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4B5563',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3B82F6',
            borderWidth: '1px',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#111827',
            borderColor: '#374151',
            color: '#E5E7EB',
            fontWeight: 600,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#374151',
          padding: '12px 16px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#111827',
          },
        },
      },
    },
  },
};

export const createModernTheme = (mode: 'light' | 'dark') => {
  return createTheme(mode === 'dark' ? darkTheme : baseTheme);
};
