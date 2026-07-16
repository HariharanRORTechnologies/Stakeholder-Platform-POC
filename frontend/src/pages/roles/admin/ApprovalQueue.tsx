import React, { useState } from 'react';
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
  TablePagination,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockApprovalQueueData } from '../mockRoleData';

interface Approval {
  id: number;
  type: string;
  requester: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function ApprovalQueue() {
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovalQueueData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');

  const paginatedApprovals = approvals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (approval: Approval, actionType: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setAction(actionType);
    setOpenDialog(true);
  };

  const handleSubmitAction = () => {
    if (selectedApproval && action) {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      setApprovals(approvals.map(a =>
        a.id === selectedApproval.id ? { ...a, status: newStatus as any } : a
      ));
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApproval(null);
    setAction(null);
    setNotes('');
  };

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Approval Queue
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Review and approve pending requests
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Requests"
            value={approvals.length}
            color={THEME.success}
            change="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Pending"
            value={pendingCount}
            icon={<CancelIcon />}
            color={THEME.error}
            change="Needs action"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Approved"
            value={approvedCount}
            icon={<CheckCircleIcon />}
            color={THEME.success}
            change={`${Math.round((approvedCount / approvals.length) * 100)}% approval rate`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg Wait Time"
            value="2.5 hours"
            color={THEME.primaryLight}
            change="From submission"
          />
        </Grid>
      </Grid>

      {/* Approval Queue Table */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Pending & Recent Requests
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Requester</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Submitted</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedApprovals.map(approval => (
                  <TableRow key={approval.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {approval.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{approval.requester}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="textSecondary">
                        {approval.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {renderStatusChip(approval.status)}
                    </TableCell>
                    <TableCell align="right">
                      {approval.status === 'pending' && (
                        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleActionClick(approval, 'approve')}
                            sx={{
                              backgroundColor: THEME.success,
                              '&:hover': { backgroundColor: '#15803D' }
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={() => handleActionClick(approval, 'reject')}
                            sx={{
                              color: THEME.error,
                              borderColor: THEME.error
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={approvals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {action === 'approve' ? 'Approve Request' : 'Reject Request'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                Type
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedApproval?.type}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                From
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedApproval?.requester}
              </Typography>
            </Box>
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Add any notes or comments..."
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button
            onClick={handleSubmitAction}
            variant="contained"
            sx={{
              backgroundColor: action === 'approve' ? THEME.success : THEME.error,
              '&:hover': {
                backgroundColor: action === 'approve' ? '#15803D' : '#b91c1c'
              }
            }}
          >
            {action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
