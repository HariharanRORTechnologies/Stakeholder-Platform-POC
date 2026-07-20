import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { KPICard, THEME } from '../roleUtils';

const chartData = [
  { month: 'Jan', events: 45, registrations: 280, attendance: 210 },
  { month: 'Feb', events: 52, registrations: 320, attendance: 245 },
  { month: 'Mar', events: 48, registrations: 290, attendance: 220 },
  { month: 'Apr', events: 61, registrations: 380, attendance: 290 },
  { month: 'May', events: 55, registrations: 340, attendance: 260 },
  { month: 'Jun', events: 67, registrations: 420, attendance: 320 },
];

const distributionData = [
  { name: 'Online', value: 35, color: '#FF6B6B' },
  { name: 'In-person', value: 40, color: '#4ECDC4' },
  { name: 'Hybrid', value: 25, color: '#45B7D1' },
];

interface ReportData {
  id: number;
  name: string;
  type: string;
  generated: string;
  period: string;
  format: string;
}

const reportsList: ReportData[] = [
  { id: 1, name: 'Monthly Activity Report', type: 'Summary', generated: '2026-07-15', period: 'Jun 2026', format: 'PDF' },
  { id: 2, name: 'User Demographics', type: 'Detailed', generated: '2026-07-14', period: 'Jul 2026', format: 'Excel' },
  { id: 3, name: 'Event Performance', type: 'Analysis', generated: '2026-07-10', period: 'Jun 2026', format: 'PDF' },
  { id: 4, name: 'Registration Trends', type: 'Summary', generated: '2026-07-08', period: 'Last 3 Months', format: 'PDF' },
];

export function Reports() {
  const [chartType, setChartType] = useState('bar');

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Reports & Analytics
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Generate and view system reports
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Events"
            value={328}
            color={THEME.success}
            change="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Registrations"
            value={2030}
            color={THEME.primaryLight}
            change="+8% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Attendance Rate"
            value="77%"
            color={THEME.info}
            change="+2% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Rating"
            value="4.6/5.0"
            color={THEME.warning}
            change="Highly satisfied"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Activity Trends
            </Typography>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(_e, newType) => newType && setChartType(newType)}
              size="small"
            >
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="line">Line</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <ResponsiveContainer width="100%" height={220}>
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#FF6B6B" radius={[8, 8, 0, 0]} name="Events" />
                <Bar dataKey="registrations" fill="#4ECDC4" radius={[8, 8, 0, 0]} name="Registrations" />
                <Bar dataKey="attendance" fill="#45B7D1" radius={[8, 8, 0, 0]} name="Attendance" />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="events" stroke="#FF6B6B" strokeWidth={2.5} dot={{ fill: '#FF6B6B', r: 4 }} activeDot={{ r: 6 }} name="Events" />
                <Line type="monotone" dataKey="registrations" stroke="#4ECDC4" strokeWidth={2.5} dot={{ fill: '#4ECDC4', r: 4 }} activeDot={{ r: 6 }} name="Registrations" />
                <Line type="monotone" dataKey="attendance" stroke="#45B7D1" strokeWidth={2.5} dot={{ fill: '#45B7D1', r: 4 }} activeDot={{ r: 6 }} name="Attendance" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Event Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Event Type Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#FF6B6B"
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Key Metrics
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Average Event Size</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>62 people</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Most Popular Category</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Workshops</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Conversion Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>12.5%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                  <Typography variant="body2">Peak Event Day</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Friday</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Generated Reports */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Generated Reports
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: THEME.primary,
                '&:hover': { backgroundColor: THEME.primaryDark }
              }}
            >
              Generate New Report
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Report Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Generated</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Format</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportsList.map(report => (
                  <TableRow key={report.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{report.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{report.type}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{report.period}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="textSecondary">{report.generated}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{report.format}</Typography></TableCell>
                    <TableCell align="right">
                      <Button size="small" startIcon={<FileDownloadIcon />}>Download</Button>
                      <Button size="small" startIcon={<PrintIcon />}>Print</Button>
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
