import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Handshake as GlobeIcon,
  AdminPanelSettings as SuperAdminIcon,
  ManageAccounts as AdminIcon,
  Groups as ManagerIcon,
  EventNote as OrganizerIcon,
  Person as EmployeeIcon,
  VolunteerActivism as VolunteerIcon,
  Mic as SpeakerIcon,
  BusinessCenter as SponsorIcon,
  PublicOutlined as ExternalUserIcon,
  SupportAgent as SupportIcon,
} from '@mui/icons-material';
import { setRole, setHasSelectedRole } from '../features/mockData/store/uiSlice';
import type { UserRole } from '../features/mockData/store/uiSlice';
import { AppDispatch } from '../store/store';

interface RoleOption {
  id: UserRole;
  label: string;
  icon: React.ReactNode;
}

const roleOptions: RoleOption[] = [
  { id: 'super_admin', label: 'Super Admin', icon: <SuperAdminIcon fontSize="small" /> },
  { id: 'admin', label: 'Admin', icon: <AdminIcon fontSize="small" /> },
  { id: 'division_manager', label: 'Division Manager', icon: <ManagerIcon fontSize="small" /> },
  { id: 'event_organizer', label: 'Event Organizer', icon: <OrganizerIcon fontSize="small" /> },
  { id: 'employee', label: 'Employee', icon: <EmployeeIcon fontSize="small" /> },
  { id: 'volunteer', label: 'Volunteer', icon: <VolunteerIcon fontSize="small" /> },
  { id: 'speaker', label: 'Speaker', icon: <SpeakerIcon fontSize="small" /> },
  { id: 'sponsor', label: 'Sponsor', icon: <SponsorIcon fontSize="small" /> },
  { id: 'external_user', label: 'External User', icon: <ExternalUserIcon fontSize="small" /> },
  { id: 'customer_support', label: 'Customer Support', icon: <SupportIcon fontSize="small" /> },
];

const COLORS = {
  primary: '#16A34A',
  darkGreen: '#15803D',
  lightGreen: '#DCFCE7',
  accentGreen: '#22C55E',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
};

// Animated SVG Particles Component
const AnimatedParticles: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate(20px, -20px) scale(1.05);
            opacity: 0.6;
          }
          50% {
            transform: translate(0, -40px) scale(1);
            opacity: 0.4;
          }
          75% {
            transform: translate(-20px, -20px) scale(0.95);
            opacity: 0.5;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            r: 40px;
            opacity: 0.2;
          }
          50% {
            r: 50px;
            opacity: 0.1;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .particle {
          animation: float 20s infinite ease-in-out;
        }

        .particle:nth-child(1) {
          animation-delay: 0s;
        }

        .particle:nth-child(2) {
          animation-delay: 4s;
        }

        .particle:nth-child(3) {
          animation-delay: 8s;
        }

        .particle:nth-child(4) {
          animation-delay: 12s;
        }

        .particle:nth-child(5) {
          animation-delay: 16s;
        }

        .glow-circle {
          animation: pulse-glow 8s infinite ease-in-out;
        }

        .glow-circle:nth-child(6) {
          animation-delay: 0s;
        }

        .glow-circle:nth-child(7) {
          animation-delay: 3s;
        }

        .rotating-shape {
          animation: rotate 30s linear infinite;
        }
      `}</style>

      {/* Floating orbs */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.7,
        }}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Animated circles */}
        <circle cx="150" cy="200" r="80" fill={COLORS.accentGreen} className="particle" opacity="0.3" />
        <circle cx="800" cy="300" r="60" fill={COLORS.primary} className="particle" opacity="0.2" />
        <circle cx="600" cy="700" r="100" fill={COLORS.lightGreen} className="particle" opacity="0.25" />
        <circle cx="300" cy="800" r="70" fill={COLORS.accentGreen} className="particle" opacity="0.2" />
        <circle cx="900" cy="600" r="90" fill={COLORS.primary} className="particle" opacity="0.15" />

        {/* Pulsing glow circles */}
        <circle cx="400" cy="400" r="40" fill="none" stroke={COLORS.primary} strokeWidth="2" className="glow-circle" />
        <circle cx="700" cy="500" r="40" fill="none" stroke={COLORS.accentGreen} strokeWidth="2" className="glow-circle" />

        {/* Rotating geometric shape */}
        <g className="rotating-shape" transform="translate(500, 500)">
          <polygon
            points="0,-100 87,-50 50,81 -50,81 -87,-50"
            fill="none"
            stroke={COLORS.primary}
            strokeWidth="1.5"
            opacity="0.3"
          />
        </g>

        {/* Additional subtle shapes */}
        <circle cx="100" cy="900" r="40" fill={COLORS.accentGreen} opacity="0.1" />
        <circle cx="950" cy="150" r="50" fill={COLORS.primary} opacity="0.1" />
      </svg>
    </Box>
  );
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Trigger page fade-in animation on load
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const handleRoleChange = (event: any) => {
    setSelectedRole(event.target.value as UserRole);
  };

  const handleGetStarted = async () => {
    if (!selectedRole) {
      console.warn('No role selected');
      return;
    }

    setIsLoading(true);

    try {
      // Dispatch role to Redux
      dispatch(setRole(selectedRole));
      dispatch(setHasSelectedRole(true));

      // Simulate loading time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during role selection:', error);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        background: COLORS.background,
        animation: pageLoaded ? 'fadeIn 300ms ease-out' : 'none',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        '@media (max-width: 1024px)': {
          flexDirection: 'column',
        },
      }}
    >
      {/* Left Side - Animated Background (60% on desktop, full width on mobile) */}
      <Box
        sx={{
          flex: '0 0 60%',
          position: 'relative',
          background: `linear-gradient(135deg, ${COLORS.lightGreen} 0%, ${COLORS.primary} 50%, ${COLORS.darkGreen} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          '@media (max-width: 1024px)': {
            flex: '0 0 100%',
            minHeight: '250px',
            marginBottom: '20px',
          },
          '@media (max-width: 768px)': {
            minHeight: '200px',
            marginBottom: '20px',
          },
        }}
      >
        {/* Glassmorphism overlay with particles */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: 1,
          }}
        />

        {/* Animated Particles */}
        <AnimatedParticles />

        {/* Welcome Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: '#FFFFFF',
            maxWidth: '500px',
            padding: '40px 20px',
            animation: pageLoaded ? 'slideInDown 500ms ease-out' : 'none',
            '@keyframes slideInDown': {
              from: {
                opacity: 0,
                transform: 'translateY(-30px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              marginBottom: '16px',
              fontWeight: 700,
              fontSize: '2.5rem',
              letterSpacing: '-0.01em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '@media (max-width: 768px)': {
                fontSize: '1.75rem',
              },
            }}
          >
            Welcome to Stakeholder Engagement Platform
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: '1.125rem',
              fontWeight: 400,
              lineHeight: 1.6,
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
              opacity: 0.95,
            }}
          >
            Unified platform for event management and stakeholder engagement
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Login Card (40% on desktop, full width on mobile) */}
      <Box
        sx={{
          flex: '0 0 40%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 20px',
          '@media (max-width: 1024px)': {
            flex: '0 0 100%',
            padding: '40px 20px',
          },
          '@media (max-width: 768px)': {
            padding: '30px 16px',
          },
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: '12px',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            backgroundColor: COLORS.card,
            animation: pageLoaded ? 'slideUpIn 500ms ease-out 200ms both' : 'none',
            '@keyframes slideUpIn': {
              from: {
                opacity: 0,
                transform: 'translateY(40px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.12)',
            },
          }}
        >
          <CardContent
            sx={{
              padding: '48px 32px',
              textAlign: 'center',
              '@media (max-width: 768px)': {
                padding: '32px 24px',
              },
            }}
          >
            {/* Logo/Icon */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '24px',
                animation: pageLoaded ? 'popIn 600ms ease-out' : 'none',
                '@keyframes popIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'scale(0.8)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accentGreen} 100%)`,
                  color: '#FFFFFF',
                  boxShadow: `0 4px 12px rgba(22, 163, 74, 0.3)`,
                }}
              >
                <GlobeIcon sx={{ fontSize: '32px' }} />
              </Box>
            </Box>

            {/* Platform Name */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                marginBottom: '8px',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: COLORS.textSecondary,
              }}
            >
              Stakeholder Platform
            </Typography>

            {/* Main Title */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                marginBottom: '12px',
                color: COLORS.textPrimary,
                fontSize: '1.875rem',
                lineHeight: 1.2,
                '@media (max-width: 768px)': {
                  fontSize: '1.5rem',
                },
              }}
            >
              Welcome Back
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body2"
              sx={{
                color: COLORS.textSecondary,
                marginBottom: '32px',
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              Select your role to get started
            </Typography>

            {/* Role Dropdown */}
            <FormControl
              fullWidth
              sx={{
                marginBottom: '32px',
              }}
            >
              <InputLabel
                sx={{
                  color: COLORS.textSecondary,
                  '&.Mui-focused': {
                    color: COLORS.primary,
                  },
                }}
              >
                Select Role
              </InputLabel>
              <Select
                value={selectedRole}
                onChange={handleRoleChange}
                label="Select Role"
                disabled={isLoading}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: COLORS.surface,
                  transition: 'all 150ms ease',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: COLORS.border,
                      transition: 'border-color 150ms ease, box-shadow 150ms ease',
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
                  },
                }}
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {role.icon}
                      <span>{role.label}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Get Started Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleGetStarted}
              disabled={isLoading || !selectedRole}
              sx={{
                height: '44px',
                fontSize: '0.95rem',
                fontWeight: 600,
                backgroundColor: COLORS.primary,
                color: '#FFFFFF',
                borderRadius: '8px',
                marginBottom: '20px',
                transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover:not(:disabled)': {
                  backgroundColor: COLORS.darkGreen,
                  transform: 'scale(1.02)',
                  boxShadow: `0 8px 16px rgba(22, 163, 74, 0.3)`,
                },
                '&:active:not(:disabled)': {
                  transform: 'scale(0.98)',
                },
                '&:disabled': {
                  opacity: 0.7,
                  cursor: 'not-allowed',
                },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                  <span style={{ marginLeft: '8px' }}>Loading...</span>
                </>
              ) : (
                'Get Started'
              )}
            </Button>

            {/* Footer Text */}
            <Box
              sx={{
                paddingTop: '20px',
                borderTop: `1px solid ${COLORS.border}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: COLORS.textSecondary,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em',
                  marginBottom: '6px',
                }}
              >
                Version 1.0 © 2026
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: COLORS.primary,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Frontend Demo Mode
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
