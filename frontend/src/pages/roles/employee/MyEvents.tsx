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
  Chip,
  Button,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockEmployeeEventsData } from '../mockRoleData';

interface EmployeeEvent {
  id: number;
  eventName: string;
  date: string;
  role: string;
  status: 'assigned' | 'completed' | 'cancelled';
}

export function MyEvents() {
  const [events] = useState<EmployeeEvent[]>(mockEmployeeEventsData);

  const completedCount = events.filter(e => e.status === 'completed').length;
  const assignedCount = events.filter(e => e.status === 'assigned').length;

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        My Events
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        View your assigned events
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Events"
            value={events.length}
            icon={<CalendarTodayIcon />}
            color={THEME.success}
            change="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Completed"
            value={completedCount}
            icon={<CheckCircleIcon />}
            color={THEME.primaryLight}
            change={`${Math.round((completedCount / events.length) * 100)}% completion`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Upcoming"
            value={assignedCount}
            color={THEME.info}
            change="Still to work on"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Hours"
            value="24 hrs"
            color={THEME.warning}
            change="Per event"
          />
        </Grid>
      </Grid>

      {/* Events List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Assigned Events
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Your Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map(event => (
                  <TableRow key={event.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{event.eventName}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{event.date}</Typography></TableCell>
                    <TableCell>
                      <Chip label={event.role} size="small" variant="outlined" sx={{ backgroundColor: '#e0f2fe', borderColor: '#0369a1', color: '#0369a1' }} />
                    </TableCell>
                    <TableCell>{renderStatusChip(event.status)}</TableCell>
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
