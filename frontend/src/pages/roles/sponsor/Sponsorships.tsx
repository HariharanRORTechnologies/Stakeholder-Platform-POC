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
  Stack,
  Chip,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockSponsorshipsData } from '../mockRoleData';

interface Sponsorship {
  id: number;
  eventName: string;
  sponsorshipLevel: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
}

export function Sponsorships() {
  const [sponsorships] = useState<Sponsorship[]>(mockSponsorshipsData);

  const activeCount = sponsorships.filter(s => s.status === 'active').length;
  const investmentTotal = sponsorships.length > 0 ? 85000 : 0;

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        My Sponsorships
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        View and manage your active sponsorships
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Active Sponsorships"
            value={activeCount}
            icon={<BusinessIcon />}
            color={THEME.success}
            change="Currently active"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Investment"
            value={`$${(investmentTotal / 1000).toFixed(0)}K`}
            color={THEME.primaryLight}
            change="Across all events"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="ROI"
            value="385%"
            color={THEME.success}
            change="Average across portfolio"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Brand Exposure"
            value="12.5K"
            icon={<BusinessIcon />}
            color={THEME.info}
            change="Impressions YTD"
          />
        </Grid>
      </Grid>

      {/* Sponsorships List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Your Sponsorships
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sponsorship Level</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sponsorships.map(sponsorship => (
                  <TableRow key={sponsorship.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{sponsorship.eventName}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={sponsorship.sponsorshipLevel}
                        size="small"
                        sx={{
                          backgroundColor: sponsorship.sponsorshipLevel === 'Platinum' ? '#e0d5ff' : '#fef3c7',
                          color: sponsorship.sponsorshipLevel === 'Platinum' ? '#7c3aed' : '#b45309'
                        }}
                      />
                    </TableCell>
                    <TableCell><Typography variant="body2">{sponsorship.startDate}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{sponsorship.endDate}</Typography></TableCell>
                    <TableCell>{renderStatusChip(sponsorship.status)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        <Button size="small" sx={{ color: THEME.primary }}>View</Button>
                        <Button size="small" sx={{ color: THEME.primary }}>Edit</Button>
                      </Stack>
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
