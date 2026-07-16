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
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockVolunteerOpportunitiesData } from '../mockRoleData';

interface Opportunity {
  id: number;
  title: string;
  eventDate: string;
  duration: string;
  spots: number;
  status: 'open' | 'full';
}

export function Opportunities() {
  const [opportunities] = useState<Opportunity[]>(mockVolunteerOpportunitiesData);

  const openCount = opportunities.filter(o => o.status === 'open').length;
  const totalSpots = opportunities.reduce((sum, o) => sum + o.spots, 0);

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Volunteer Opportunities
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Browse and sign up for volunteer opportunities
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Available"
            value={openCount}
            icon={<VolunteerActivismIcon />}
            color={THEME.success}
            change="Open positions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Opportunities"
            value={opportunities.length}
            color={THEME.primaryLight}
            change="This quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Available Spots"
            value={totalSpots}
            color={THEME.info}
            change="Total across all"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Fill Rate"
            value={`${Math.round((opportunities.filter(o => o.spots === 0).length / opportunities.length) * 100)}%`}
            color={THEME.warning}
            change="Positions filled"
          />
        </Grid>
      </Grid>

      {/* Opportunities List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Opportunities
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Opportunity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Available Spots</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {opportunities.map(opp => (
                  <TableRow key={opp.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{opp.title}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{opp.eventDate}</Typography></TableCell>
                    <TableCell><Chip label={opp.duration} size="small" /></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{opp.spots}</Typography></TableCell>
                    <TableCell>{renderStatusChip(opp.status)}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant={opp.status === 'open' ? 'contained' : 'outlined'}
                        disabled={opp.status === 'full'}
                        sx={{
                          backgroundColor: opp.status === 'open' ? THEME.primary : undefined,
                          '&:hover': { backgroundColor: opp.status === 'open' ? THEME.primaryDark : undefined }
                        }}
                      >
                        {opp.status === 'open' ? 'Sign Up' : 'Full'}
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
