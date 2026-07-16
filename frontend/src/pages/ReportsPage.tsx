import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Download as DownloadIcon } from '@mui/icons-material';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

export function ReportsPage() {
  const analytics = useSelector((state: RootState) => state.mockAnalytics);
  const [reportType, setReportType] = React.useState('overview');

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Reports & Analytics
        </Typography>
        <Button variant="contained" startIcon={<DownloadIcon />}>
          Export Report
        </Button>
      </Stack>

      {/* Report Type Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
            >
              <MenuItem value="overview">Event Overview</MenuItem>
              <MenuItem value="attendance">Attendance Report</MenuItem>
              <MenuItem value="feedback">Feedback Analysis</MenuItem>
              <MenuItem value="financial">Financial Report</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {reportType === 'overview' && (
        <>
          {/* KPIs */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Events Held</Typography>
                  <Typography variant="h5">{analytics.eventAnalytics.totalEvents}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Attendees</Typography>
                  <Typography variant="h5">{analytics.eventAnalytics.totalAttendees}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Avg Rating</Typography>
                  <Typography variant="h5">{analytics.eventAnalytics.avgEventRating}★</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary">Total Budget</Typography>
                  <Typography variant="h5">${(analytics.eventAnalytics.totalBudget / 1000).toFixed(0)}K</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Event Type Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.eventTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {analytics.eventTypeDistribution.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Rating Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.ratingDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#667eea" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {reportType === 'attendance' && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Attendance Summary
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Events</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Registrations</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Attendance</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.monthlyTrends.map((row) => (
                    <TableRow key={row.month} hover>
                      <TableCell>{row.month}</TableCell>
                      <TableCell align="right">{row.events}</TableCell>
                      <TableCell align="right">{row.registrations}</TableCell>
                      <TableCell align="right">{row.attendance}</TableCell>
                      <TableCell align="right">
                        {row.registrations > 0 ? ((row.attendance / row.registrations) * 100).toFixed(0) : 0}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {reportType === 'feedback' && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Feedback Summary
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Detailed feedback analysis would appear here showing sentiment, trends, and key themes.
            </Typography>
          </CardContent>
        </Card>
      )}

      {reportType === 'financial' && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Financial Report
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="textSecondary">Total Budget</Typography>
                <Typography variant="h5">${analytics.eventAnalytics.totalBudget.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Utilized</Typography>
                <Typography variant="h5">${analytics.eventAnalytics.budgetUtilized.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Remaining</Typography>
                <Typography variant="h5" sx={{ color: 'success.main' }}>
                  ${(analytics.eventAnalytics.totalBudget - analytics.eventAnalytics.budgetUtilized).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default { ReportsPage };
