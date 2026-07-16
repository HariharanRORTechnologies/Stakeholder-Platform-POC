import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Stack,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Common theme colors
export const THEME = {
  primary: '#16A34A',
  primaryDark: '#15803D',
  primaryLight: '#22C55E',
  success: '#16A34A',
  warning: '#EAB308',
  error: '#DC2626',
  info: '#3B82F6',
  background: '#f9fafb',
};

// Common KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  change?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  color = THEME.primary,
  change
}) => (
  <Card
    sx={{
      height: '100%',
      borderLeft: `4px solid ${color}`,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
            {value}
          </Typography>
          {change && (
            <Typography
              variant="caption"
              sx={{
                color: change.includes('+') ? THEME.success : THEME.error,
                mt: 1,
                display: 'block'
              }}
            >
              {change}
            </Typography>
          )}
        </Box>
        {icon && <Box sx={{ color, opacity: 0.2, fontSize: 40 }}>{icon}</Box>}
      </Stack>
    </CardContent>
  </Card>
);

// Common Table Component Props
export interface TableRowData {
  id: string | number;
  [key: string]: any;
}

export interface TableColumnConfig {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: TableRowData) => React.ReactNode;
}

interface CommonTableProps {
  columns: TableColumnConfig[];
  data: TableRowData[];
  onEdit: (row: TableRowData) => void;
  onDelete: (row: TableRowData) => void;
  rowsPerPageOptions?: number[];
  emptyMessage?: string;
}

export const CommonTable: React.FC<CommonTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  rowsPerPageOptions = [10, 20, 50],
  emptyMessage = 'No records found',
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
          <TableRow>
            {columns.map(col => (
              <TableCell
                key={col.key}
                sx={{ fontWeight: 'bold', width: col.width }}
              >
                {col.label}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map(row => (
              <TableRow key={row.id} hover>
                {columns.map(col => (
                  <TableCell key={`${row.id}-${col.key}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEdit(row)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(row)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

// Common Modal Component
interface CommonModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
  }>;
  initialData?: any;
  submitLabel?: string;
}

export const CommonModal: React.FC<CommonModalProps> = ({
  open,
  title,
  onClose,
  onSubmit,
  fields,
  initialData,
  submitLabel = 'Save',
}) => {
  const [formData, setFormData] = useState(initialData || {});

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const newData: any = {};
      fields.forEach(field => {
        newData[field.name] = '';
      });
      setFormData(newData);
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {fields.map(field => (
            <TextField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={handleChange}
              fullWidth
              required={field.required}
              size="small"
              select={!!field.options}
            >
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: THEME.primary, '&:hover': { backgroundColor: THEME.primaryDark } }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Status chip renderer
export const renderStatusChip = (status: string) => {
  const statusConfig: Record<string, { color: 'success' | 'warning' | 'error' | 'default'; label: string }> = {
    'active': { color: 'success', label: 'Active' },
    'inactive': { color: 'default', label: 'Inactive' },
    'pending': { color: 'warning', label: 'Pending' },
    'approved': { color: 'success', label: 'Approved' },
    'rejected': { color: 'error', label: 'Rejected' },
    'draft': { color: 'default', label: 'Draft' },
    'published': { color: 'success', label: 'Published' },
    'completed': { color: 'success', label: 'Completed' },
    'in-progress': { color: 'warning', label: 'In Progress' },
  };

  const config = statusConfig[status?.toLowerCase()] || { color: 'default', label: status };
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
    />
  );
};
