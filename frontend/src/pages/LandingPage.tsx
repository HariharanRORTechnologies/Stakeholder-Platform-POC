import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRole } from '../features/mockData/store/uiSlice';
import { setHasSelectedRole } from '../features/mockData/store/uiSlice';
import { getAllRoles, type UserRole, type RoleConfig } from '../config/roleConfig';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

export function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const roles = getAllRoles();

  const handleRoleClick = (role: UserRole) => {
    setSelectedRole(role);
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (selectedRole) {
      dispatch(setRole(selectedRole));
      dispatch(setHasSelectedRole(true));
      setOpenDialog(false);
      navigate('/dashboard');
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const selectedRoleConfig = selectedRole ? roles.find(r => r.id === selectedRole) : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #DCFCE7 0%, #ffffff 50%, #f0fdf4 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2rem', md: '3.5rem' },
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Stakeholder Engagement Platform
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontSize: { xs: '1rem', md: '1.25rem' },
              opacity: 0.95,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            Connect, collaborate, and engage with stakeholders across your organization.
            Select your role to access personalized features and insights.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip
              label="🚀 Enterprise Ready"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.95rem' }}
            />
            <Chip
              label="🔐 Secure & Compliant"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.95rem' }}
            />
            <Chip
              label="⚡ Real-time Sync"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.95rem' }}
            />
          </Box>
        </Container>
      </Box>

      {/* Role Selection Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, flex: 1 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#15803D',
              fontSize: { xs: '1.75rem', md: '2.125rem' },
            }}
          >
            Choose Your Role
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1rem' },
            }}
          >
            Select a role to experience the platform with role-specific features, permissions, and dashboards.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {roles.map((role) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={role.id}>
              <RoleCard
                role={role}
                onSelect={() => handleRoleClick(role.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Confirmation Dialog */}
      {selectedRoleConfig && (
        <RoleConfirmDialog
          role={selectedRoleConfig}
          open={openDialog}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          px: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#999',
            fontSize: '0.875rem',
          }}
        >
          Stakeholder Engagement Platform v1.0.0 • Demo Mode •
          <Box component="span" sx={{ ml: 1 }}>
            All roles available for testing
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}

interface RoleCardProps {
  role: RoleConfig;
  onSelect: () => void;
}

function RoleCard({ role, onSelect }: RoleCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '2px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(22, 163, 74, 0.15)',
          borderColor: role.accentColor,
        },
        '&:active': {
          transform: 'translateY(-4px)',
        },
      }}
      onClick={onSelect}
    >
      <CardActionArea
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          p: 2,
          justifyContent: 'flex-start',
        }}
      >
        <CardContent sx={{ width: '100%', pb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${role.lightColor} 0%, ${role.accentColor}33 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: role.color,
                fontSize: '32px',
                transition: 'transform 0.3s ease',
              }}
            >
              {React.createElement(role.iconComponent, { sx: { fontSize: '32px' } })}
            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            {role.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#666',
              textAlign: 'center',
              lineHeight: 1.5,
              fontSize: '0.875rem',
              minHeight: '2.8em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {role.description}
          </Typography>
        </CardContent>

        <Box
          sx={{
            mt: 'auto',
            pt: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: role.color,
              fontWeight: '600',
              fontSize: '0.875rem',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: `${role.color}11`,
                gap: '8px',
              },
            }}
          >
            Select Role
          </Button>
        </Box>
      </CardActionArea>
    </Card>
  );
}

interface RoleConfirmDialogProps {
  role: RoleConfig;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function RoleConfirmDialog({
  role,
  open,
  onConfirm,
  onCancel,
}: RoleConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          pb: 1,
        }}
      >
        Confirm Role Selection
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box
            sx={{
              p: 2,
              backgroundColor: `${role.lightColor}66`,
              borderLeft: `4px solid ${role.color}`,
              borderRadius: '8px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${role.lightColor}, ${role.accentColor}33)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: role.color,
                  fontSize: '24px',
                }}
              >
                {React.createElement(role.iconComponent, { sx: { fontSize: '24px' } })}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937' }}>
                  {role.name}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#555',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              {role.description}
            </Typography>
          </Box>

          <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>
            You'll be able to change your role anytime from the role switcher in the sidebar.
          </Typography>

          <Stack spacing={1}>
            <Typography sx={{ fontWeight: '600', color: '#1f2937', fontSize: '0.9rem' }}>
              Access includes:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {role.menuItems.slice(0, 4).map((item, idx) => (
                <Chip
                  key={idx}
                  label={item.replace(/_/g, ' ')}
                  size="small"
                  sx={{
                    backgroundColor: `${role.lightColor}88`,
                    color: role.darkColor,
                    fontWeight: '500',
                  }}
                />
              ))}
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          sx={{
            color: '#666',
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${role.color} 0%, ${role.accentColor} 100%)`,
            color: 'white',
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: '600',
            borderRadius: '8px',
            px: 3,
            '&:hover': {
              boxShadow: '0 8px 16px rgba(22, 163, 74, 0.3)',
            },
          }}
        >
          Continue as {role.name}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
