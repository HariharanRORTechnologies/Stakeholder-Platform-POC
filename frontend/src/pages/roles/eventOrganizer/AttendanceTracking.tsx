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
  Stack,
  Chip,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockAttendanceData } from '../mockRoleData';

interface Attendance {
  id: number;
  name: string;
  checkInTime: string;
  status: 'checked-in' | 'no-show' | 'cancelled';
  ticketType: string;
}

export function AttendanceTracking() {
  const [attendance] = useState<Attendance[]>(mockAttendanceData);

  const checkedInCount = attendance.filter(a => a.status === 'checked-in').length;
  const noShowCount = attendance.filter(a => a.status === 'no-show').length;
  const attendanceRate = Math.round((checkedInCount / (checkedInCount + noShowCount)) * 100);

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Attendance Tracking
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Check-in and track event attendance
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Checked In"
            value={checkedInCount}
            icon={<CheckCircleIcon />}
            color={THEME.success}
            change={`${attendanceRate}% attendance`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="No Show"
            value={noShowCount}
            color={THEME.error}
            change="Didn't attend"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Registered"
            value={attendance.length}
            color={THEME.primaryLight}
            change="Total capacity"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            color={THEME.info}
            change="Event participation"
          />
        </Grid>
      </Grid>

      {/* Attendance List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Attendees
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: THEME.success,
                '&:hover': { backgroundColor: '#15803D' }
              }}
            >
              Start Check-in
            </Button>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ticket Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Check-in Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.map(att => (
                  <TableRow key={att.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{att.name}</Typography></TableCell>
                    <TableCell><Chip label={att.ticketType} size="small" variant="outlined" /></TableCell>
                    <TableCell><Typography variant="body2">{att.checkInTime || '-'}</Typography></TableCell>
                    <TableCell>{renderStatusChip(att.status)}</TableCell>
                    <TableCell align="right">
                      <Button size="small" sx={{ color: att.status === 'checked-in' ? THEME.success : THEME.primary }}>
                        {att.status === 'checked-in' ? 'Checked' : 'Mark Present'}
                      </Button>
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
