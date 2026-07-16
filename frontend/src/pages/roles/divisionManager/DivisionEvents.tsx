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
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';

interface DivisionEvent {
  id: number;
  name: string;
  date: string;
  status: 'draft' | 'pending' | 'published';
  attendees: number;
  budget: number;
}

const mockEvents: DivisionEvent[] = [
  { id: 1, name: 'Division Quarterly Meeting', date: '2026-08-15', status: 'published', attendees: 45, budget: 5000 },
  { id: 2, name: 'Team Building Workshop', date: '2026-08-22', status: 'published', attendees: 30, budget: 8000 },
  { id: 3, name: 'Professional Development', date: '2026-09-10', status: 'pending', attendees: 0, budget: 12000 },
];

export function DivisionEvents() {
  const [events] = useState<DivisionEvent[]>(mockEvents);

  const publishedCount = events.filter(e => e.status === 'published').length;
  const totalBudget = events.reduce((sum, e) => sum + e.budget, 0);
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees, 0);

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Division Events
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        View and manage division events
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Events"
            value={events.length}
            icon={<EventIcon />}
            color={THEME.success}
            change="This year"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Published"
            value={publishedCount}
            color={THEME.primaryLight}
            change={`${Math.round((publishedCount / events.length) * 100)}% live`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Budget"
            value={`$${(totalBudget / 1000).toFixed(0)}K`}
            color={THEME.warning}
            change="Allocated budget"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Attendees"
            value={totalAttendees}
            color={THEME.info}
            change="Across events"
          />
        </Grid>
      </Grid>

      {/* Events List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Events
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Attendees</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Budget</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map(event => (
                  <TableRow key={event.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{event.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{event.date}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{event.attendees}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>${(event.budget / 1000).toFixed(0)}K</Typography></TableCell>
                    <TableCell>{renderStatusChip(event.status)}</TableCell>
                    <TableCell align="right"><Button size="small" sx={{ color: THEME.primary }}>View</Button></TableCell>
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
