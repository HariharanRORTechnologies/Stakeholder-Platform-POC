import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  TextField,
  Button,
  Switch,
  Divider,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { KPICard, THEME } from '../roleUtils';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Stakeholder Platform',
    maxUploadSize: '100',
    sessionTimeout: '30',
    maintenanceMode: false,
    emailNotifications: true,
    twoFactorAuth: true,
    passwordExpiry: '90',
    apiRateLimit: '1000',
    backupFrequency: 'daily',
  });

  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        System Settings
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Configure system parameters and global settings
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="System Status"
            value="Healthy"
            color={THEME.success}
            change="All systems operational"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Last Updated"
            value="2 hours ago"
            color={THEME.primaryLight}
            change="Auto-sync enabled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Config Version"
            value="2.1.0"
            color={THEME.info}
            change="Latest version"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Active Policies"
            value={6}
            color={THEME.primaryLight}
            change="All enforced"
          />
        </Grid>
      </Grid>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      {/* General Settings */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            General Settings
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Maximum Upload Size (MB)"
              type="number"
              value={settings.maxUploadSize}
              onChange={(e) => handleChange('maxUploadSize', e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Session Timeout (minutes)"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Security Settings
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">Two-Factor Authentication</Typography>
              <Switch
                checked={settings.twoFactorAuth}
                onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
              />
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">Email Notifications</Typography>
              <Switch
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              />
            </Stack>
            <Divider />
            <TextField
              label="Password Expiry (days)"
              type="number"
              value={settings.passwordExpiry}
              onChange={(e) => handleChange('passwordExpiry', e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* API & Performance */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            API & Performance Settings
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="API Rate Limit (requests/hour)"
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) => handleChange('apiRateLimit', e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Backup Frequency"
              select
              value={settings.backupFrequency}
              onChange={(e) => handleChange('backupFrequency', e.target.value)}
              fullWidth
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Maintenance
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Maintenance Mode
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Enable to perform system maintenance
                </Typography>
              </Box>
              <Switch
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              />
            </Stack>
            <Divider />
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                sx={{ color: THEME.primary, borderColor: THEME.primary }}
              >
                Run System Backup
              </Button>
              <Button
                variant="outlined"
                sx={{ color: THEME.primary, borderColor: THEME.primary }}
              >
                Clear Cache
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            backgroundColor: THEME.primary,
            '&:hover': { backgroundColor: THEME.primaryDark }
          }}
        >
          Save Settings
        </Button>
        <Button
          variant="outlined"
          sx={{ color: THEME.primary, borderColor: THEME.primary }}
        >
          Reset to Default
        </Button>
      </Stack>
    </Box>
  );
}
