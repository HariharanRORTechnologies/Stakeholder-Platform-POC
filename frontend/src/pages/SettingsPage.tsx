import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  Button,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTheme } from '../features/mockData/store/uiSlice';

export function SettingsPage() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Settings
      </Typography>

      {/* Appearance Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Appearance
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={theme === 'dark'}
                onChange={(e) => dispatch(setTheme(e.target.checked ? 'dark' : 'light'))}
              />
            }
            label="Dark Mode"
          />
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Notifications
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={<Switch checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />}
              label="Email Notifications"
            />
            <FormControlLabel
              control={<Switch checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} />}
              label="Push Notifications"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Account
          </Typography>
          <Stack spacing={2}>
            <TextField label="Email Address" fullWidth defaultValue="user@company.com" />
            <TextField label="Full Name" fullWidth defaultValue="Current User" />
            <TextField label="Department" fullWidth defaultValue="Organization" />
            <Button variant="contained">Save Changes</Button>
          </Stack>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            About
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Application:</strong> Stakeholder Platform
            </Typography>
            <Typography variant="body2">
              <strong>Version:</strong> 1.0.0 (Frontend Prototype)
            </Typography>
            <Typography variant="body2">
              <strong>Mode:</strong> Mock Data / Preview Mode
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This is a frontend-only prototype showcasing UI and UX design. No actual data is persisted.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default { SettingsPage };
