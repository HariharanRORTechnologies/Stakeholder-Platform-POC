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
  LinearProgress,
  Button,
  Chip,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import BackupIcon from '@mui/icons-material/Backup';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockDatabaseHealthData } from '../mockRoleData';

interface DatabaseMetric {
  id: number;
  metric: string;
  value: string;
  status: 'healthy' | 'warning' | 'error';
  change: string;
}

export function DatabaseHealth() {
  const [metrics] = useState<DatabaseMetric[]>(mockDatabaseHealthData);

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Database Health
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Database performance, capacity, and backup monitoring
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Database Status"
            value="Healthy"
            icon={<StorageIcon />}
            color={THEME.success}
            change="All systems operational"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Database Size"
            value="2.5 GB"
            color={THEME.primaryLight}
            change="+0.2 GB/week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Disk Usage"
            value="78%"
            color={THEME.warning}
            change="+2% this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Backup Status"
            value="Up to Date"
            icon={<BackupIcon />}
            color={THEME.success}
            change="2 hours ago"
          />
        </Grid>
      </Grid>

      {/* Database Metrics */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Database Metrics
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Metric</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metrics.map(metric => (
                  <TableRow key={metric.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {metric.metric}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{metric.value}</Typography>
                    </TableCell>
                    <TableCell>
                      {renderStatusChip(metric.status)}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{
                          color: metric.change.includes('improvement') || metric.change.includes('normal') ? THEME.success : THEME.warning,
                          fontWeight: 500,
                        }}
                      >
                        {metric.change}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Database Operations */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Storage Breakdown
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Data Files</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>1.8 GB</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={72}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e5e7eb',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: THEME.success,
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Indexes</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>0.5 GB</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={20}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e5e7eb',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: THEME.primaryLight,
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Temporary Files</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>0.2 GB</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={8}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e5e7eb',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: THEME.info,
                      }
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                Backup Information
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Last Backup</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>2 hours ago</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Backup Size</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>2.3 GB</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Backup Location</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>AWS S3</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Retention Period</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>30 days</Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: THEME.primary,
                      '&:hover': { backgroundColor: THEME.primaryDark }
                    }}
                  >
                    Run Backup Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: THEME.primary, borderColor: THEME.primary }}
                  >
                    View Backups
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Query Performance */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Query Performance
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 1 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Average Query Time
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Median response time across all queries
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: THEME.success }}>
                42ms
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 1 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Slow Queries (95th percentile)
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  95% of queries faster than this
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                150ms
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 1 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Active Connections
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Current database connections
                </Typography>
              </Box>
              <Chip label="245 / 500" variant="filled" sx={{ backgroundColor: THEME.primaryLight, color: 'white' }} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
