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
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockSpeakerEngagementsData } from '../mockRoleData';

interface Engagement {
  id: number;
  eventName: string;
  topic: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export function MyEngagements() {
  const [engagements] = useState<Engagement[]>(mockSpeakerEngagementsData);

  const confirmedCount = engagements.filter(e => e.status === 'confirmed').length;
  const completedCount = engagements.filter(e => e.status === 'completed').length;

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        My Speaking Engagements
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        View your scheduled speaking engagements
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Engagements"
            value={engagements.length}
            icon={<SpeakerNotesIcon />}
            color={THEME.success}
            change="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Confirmed"
            value={confirmedCount}
            color={THEME.primaryLight}
            change="Scheduled"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Completed"
            value={completedCount}
            color={THEME.success}
            change="Past events"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Audience"
            value="85 people"
            color={THEME.info}
            change="Per engagement"
          />
        </Grid>
      </Grid>

      {/* Engagements List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Engagements
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Topic</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {engagements.map(eng => (
                  <TableRow key={eng.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{eng.eventName}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{eng.topic}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{eng.date}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{eng.time}</Typography></TableCell>
                    <TableCell>{renderStatusChip(eng.status)}</TableCell>
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
