import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setRole, setHasSelectedRole, UserRole } from '../features/mockData/store/uiSlice';
import { roleConfig } from '../config/roleConfig';
import {
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

// Map roles to labels and colors for the dropdown
const roleLabelConfig: Record<UserRole, { label: string; color: string }> = {
  super_admin: { label: 'Super Admin', color: '#16A34A' },
  admin: { label: 'Admin', color: '#16A34A' },
  division_manager: { label: 'Division Manager', color: '#16A34A' },
  event_organizer: { label: 'Event Organizer', color: '#16A34A' },
  employee: { label: 'Employee', color: '#16A34A' },
  volunteer: { label: 'Volunteer', color: '#0097a7' },
  speaker: { label: 'Speaker', color: '#16A34A' },
  sponsor: { label: 'Sponsor', color: '#16A34A' },
  external_user: { label: 'External User', color: '#16A34A' },
  customer_support: { label: 'Customer Support', color: '#16A34A' },
  // Legacy roles for backwards compatibility
  manager: { label: 'Manager', color: '#1976d2' },
  organizer: { label: 'Event Organizer (Legacy)', color: '#388e3c' },
  coordinator: { label: 'Coordinator', color: '#f57c00' },
  stakeholder: { label: 'Stakeholder', color: '#7b1fa2' },
};

export function RoleSwitcher() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentRole = useSelector((state: RootState) => state.ui.currentRole);

  const handleRoleChange = (event: any) => {
    dispatch(setRole(event.target.value as UserRole));
  };

  const handleChangeRole = () => {
    dispatch(setHasSelectedRole(false));
    navigate('/landing');
  };

  const currentRoleLabel = roleLabelConfig[currentRole];
  const currentRoleConfig = (currentRole in roleConfig) ? roleConfig[currentRole as keyof typeof roleConfig] : null;

  return (
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
      <Stack spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Current Role</InputLabel>
          <Select
            value={currentRole}
            onChange={handleRoleChange}
            label="Current Role"
            startAdornment={
              <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: '0.75rem' }}>
                {currentRoleConfig ? React.createElement(currentRoleConfig.iconComponent, { sx: { fontSize: '20px' } }) : null}
              </Avatar>
            }
          >
            {Object.entries(roleLabelConfig).map(([key, { label }]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Chip
            label={`Active: ${currentRoleLabel.label}`}
            color="primary"
            variant="outlined"
            sx={{ width: '100%' }}
          />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={handleChangeRole}
          sx={{
            color: '#16A34A',
            borderColor: '#16A34A',
            textTransform: 'none',
            fontWeight: '600',
            '&:hover': {
              backgroundColor: '#16A34A11',
              borderColor: '#15803D',
            },
          }}
        >
          Change Role
        </Button>

        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', p: 1, backgroundColor: 'white', borderRadius: 1 }}>
          <strong>Preview Mode:</strong> Switch roles to see different dashboards and pages. No authentication required.
        </Box>
      </Stack>
    </Box>
  );
}
