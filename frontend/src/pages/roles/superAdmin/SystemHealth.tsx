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
} from '@mui/material';
import { HealthAndSafety as HealthIcon } from '@mui/icons-material';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockSystemHealthData } from '../mockRoleData';

interface HealthMetric {
  id: number;
  component: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  latency: string;
  timestamp: string;
}

export function SystemHealth() {
  const [systemMetrics] = useState<HealthMetric[]>(mockSystemHealthData);

  // Calculate overall health
  const totalComponents = systemMetrics.length;
  const healthyComponents = systemMetrics.filter(m => m.status === 'healthy').length;
  const avgUptime = (99.88).toFixed(2);

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        System Health Monitor
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Real-time system performance and uptime metrics
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="System Status"
            value={`${healthyComponents}/${totalComponents} Healthy`}
            icon={<HealthIcon />}
            color={healthyComponents === totalComponents ? THEME.success : THEME.warning}
            change={healthyComponents === totalComponents ? 'All systems operational' : 'Check warnings'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Average Uptime"
            value={`${avgUptime}%`}
            color={THEME.success}
            change="+0.05% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Latency"
            value="51.25ms"
            color={THEME.primaryLight}
            change="-5ms improvement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Active Services"
            value={totalComponents}
            color={THEME.info}
            change="All running"
          />
        </Grid>
      </Grid>

      {/* System Components Health */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Component Health Status
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Component</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Uptime</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Latency</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Last Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {systemMetrics.map(metric => (
                  <TableRow key={metric.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {metric.component}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {renderStatusChip(metric.status)}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Typography variant="body2">{metric.uptime}</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(metric.uptime)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: metric.status === 'healthy' ? THEME.success : THEME.warning,
                            }
                          }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: metric.latency === '45ms' || metric.latency === '25ms' || metric.latency === '15ms' ? THEME.success : THEME.warning,
                          fontWeight: 500,
                        }}
                      >
                        {metric.latency}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {metric.timestamp}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                CPU & Memory Usage
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">CPU Usage</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>65%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={65}
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
                    <Typography variant="body2">Memory Usage</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>78%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e5e7eb',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: THEME.warning,
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Disk I/O</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>45%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={45}
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
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Network Performance
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Inbound Traffic</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>2.4 Mbps</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Outbound Traffic</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>1.8 Mbps</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Packet Loss</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>0.01%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Error Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>0.00%</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
