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
  TextField,
  InputAdornment,
} from '@mui/material';
import TicketIcon from '@mui/icons-material/ConfirmationNumber';
import SearchIcon from '@mui/icons-material/Search';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockSupportTicketsData } from '../mockRoleData';

interface Ticket {
  id: number;
  ticketId: string;
  subject: string;
  customer: string;
  date: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
}

export function TicketManagement() {
  const [tickets] = useState<Ticket[]>(mockSupportTicketsData);
  const [searchTerm, setSearchTerm] = useState('');

  const openCount = tickets.filter(t => t.status === 'open').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const highPriorityCount = tickets.filter(t => t.priority === 'high').length;

  const filteredTickets = tickets.filter(t =>
    t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Ticket Management
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        View and manage support tickets
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Open Tickets"
            value={openCount}
            icon={<TicketIcon />}
            color={THEME.error}
            change="Needs attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="In Progress"
            value={tickets.filter(t => t.status === 'in-progress').length}
            color={THEME.warning}
            change="Being worked on"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Resolved"
            value={resolvedCount}
            color={THEME.primaryLight}
            change="This week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="High Priority"
            value={highPriorityCount}
            color={THEME.error}
            change="Urgent tickets"
          />
        </Grid>
      </Grid>

      {/* Tickets List */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Support Tickets
          </Typography>

          <TextField
            placeholder="Search by ticket ID or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ticket ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTickets.map(ticket => (
                  <TableRow key={ticket.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>{ticket.ticketId}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{ticket.subject}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{ticket.customer}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="textSecondary">{ticket.date}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: ticket.priority === 'high' ? '#fee2e2' : ticket.priority === 'medium' ? '#fef3c7' : '#dbeafe',
                        color: ticket.priority === 'high' ? '#991b1b' : ticket.priority === 'medium' ? '#92400e' : '#1e40af'
                      }}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Typography>
                    </TableCell>
                    <TableCell>{renderStatusChip(ticket.status)}</TableCell>
                    <TableCell align="right">
                      <Button size="small" sx={{ color: THEME.primary }}>
                        {ticket.status === 'open' ? 'Open' : 'View'}
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
