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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
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
} from 'recharts';
import { KPICard, THEME } from '../roleUtils';
import { mockBudgetTrackingData } from '../mockRoleData';

interface BudgetData {
  id: number;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

const spendingTrend = [
  { month: 'Jan', budget: 80000, spent: 45000 },
  { month: 'Feb', budget: 80000, spent: 52000 },
  { month: 'Mar', budget: 80000, spent: 48000 },
  { month: 'Apr', budget: 85000, spent: 62000 },
  { month: 'May', budget: 85000, spent: 58000 },
  { month: 'Jun', budget: 85000, spent: 70000 },
];

export function BudgetTracking() {
  const [budgets] = useState<BudgetData[]>(mockBudgetTrackingData);

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0);
  const overallPercentage = Math.round((totalSpent / totalAllocated) * 100);

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Budget Tracking
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Monitor division budget and expenses
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Budget"
            value={`$${(totalAllocated / 1000).toFixed(0)}K`}
            color={THEME.success}
            change="FY 2026"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Spent"
            value={`$${(totalSpent / 1000).toFixed(0)}K`}
            color={THEME.warning}
            change={`${overallPercentage}% utilization`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Remaining"
            value={`$${(totalRemaining / 1000).toFixed(0)}K`}
            color={THEME.primaryLight}
            change={`${Math.round((totalRemaining / totalAllocated) * 100)}% available`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Burn Rate"
            value={`${Math.round(overallPercentage / 6)}%/month`}
            color={THEME.info}
            change="Avg monthly spend"
          />
        </Grid>
      </Grid>

      {/* Budget Summary */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Budget by Category
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Allocated</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Spent</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Remaining</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgets.map(budget => (
                  <TableRow key={budget.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{budget.category}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 'bold' }}>${(budget.allocated / 1000).toFixed(0)}K</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2">${(budget.spent / 1000).toFixed(0)}K</Typography></TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <LinearProgress
                          variant="determinate"
                          value={budget.percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: budget.percentage > 80 ? THEME.error : THEME.success,
                            }
                          }}
                        />
                        <Typography variant="caption">{budget.percentage}%</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 'bold', color: budget.remaining < 5000 ? THEME.error : THEME.success }}>${(budget.remaining / 1000).toFixed(0)}K</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Budget Allocation
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={budgets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocated" fill="#45B7D1" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#1f2937', fontSize: 11 }} name="Allocated" />
                  <Bar dataKey="spent" fill="#FF6B6B" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#1f2937', fontSize: 11 }} name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Spending Trend
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={spendingTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="budget" stroke="#45B7D1" strokeWidth={2.5} dot={{ fill: '#45B7D1', r: 4 }} activeDot={{ r: 6 }} name="Budget" />
                  <Line type="monotone" dataKey="spent" stroke="#FF6B6B" strokeWidth={2.5} dot={{ fill: '#FF6B6B', r: 4 }} activeDot={{ r: 6 }} name="Spent" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{
            backgroundColor: THEME.primary,
            '&:hover': { backgroundColor: THEME.primaryDark }
          }}
        >
          Export Report
        </Button>
        <Button
          variant="outlined"
          sx={{ color: THEME.primary, borderColor: THEME.primary }}
        >
          Budget Adjustment
        </Button>
      </Stack>
    </Box>
  );
}
