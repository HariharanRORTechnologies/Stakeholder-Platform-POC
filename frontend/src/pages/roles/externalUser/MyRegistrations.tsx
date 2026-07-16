import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockExternalUserRegistrationsData } from '../mockRoleData';

interface UserRegistration {
  id: number;
  eventName: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  ticketType: string;
}

export function MyRegistrations() {
  const [registrations] = useState<UserRegistration[]>(mockExternalUserRegistrationsData);

  const confirmedCount = registrations.filter(r => r.status === 'confirmed').length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        My Registrations
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        View all your event registrations
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Events"
            value={registrations.length}
            icon={<AppRegistrationIcon />}
            color={THEME.success}
            change="Registered for"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Confirmed"
            value={confirmedCount}
            color={THEME.primaryLight}
            change={`${Math.round((confirmedCount / registrations.length) * 100)}% confirmed`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Pending"
            value={pendingCount}
            color={THEME.warning}
            change="Awaiting confirmation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Events Attended"
            value="2"
            color={THEME.info}
            change="Previously attended"
          />
        </Grid>
      </Grid>

      {/* Registrations List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Your Registrations
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Registration Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ticket Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.map(reg => (
                  <TableRow key={reg.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{reg.eventName}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="textSecondary">{reg.registrationDate}</Typography></TableCell>
                    <TableCell><Chip label={reg.ticketType} size="small" variant="outlined" /></TableCell>
                    <TableCell>{renderStatusChip(reg.status)}</TableCell>
                    <TableCell align="right">
                      <Button size="small" sx={{ color: THEME.primary }}>View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
