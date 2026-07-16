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
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { KPICard, THEME, renderStatusChip } from '../roleUtils';
import { mockRolePermissionsData } from '../mockRoleData';

interface RolePermission {
  id: number;
  role: string;
  permissions: string;
  resourceCount: number;
  status: 'active' | 'inactive';
}

const allPermissions = [
  'Create Users',
  'Edit Users',
  'Delete Users',
  'Create Events',
  'Edit Events',
  'Delete Events',
  'View Reports',
  'Manage Roles',
  'Manage Permissions',
  'View Audit Logs',
  'System Settings',
  'Database Access',
];

export function RolePermissions() {
  const [roles, setRoles] = useState<RolePermission[]>(mockRolePermissionsData);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RolePermission | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleOpenDialog = (role: RolePermission) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions.split(', '));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSavePermissions = () => {
    if (selectedRole) {
      setRoles(roles.map(r =>
        r.id === selectedRole.id
          ? { ...r, permissions: selectedPermissions.join(', ') }
          : r
      ));
    }
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3, backgroundColor: THEME.background, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1f2937' }}>
        Role Permissions
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Configure role-based access and permissions
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Roles"
            value={roles.length}
            color={THEME.success}
            change="Active roles"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Permissions"
            value={allPermissions.length}
            color={THEME.primaryLight}
            change="Available system"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Active Roles"
            value={roles.filter(r => r.status === 'active').length}
            color={THEME.info}
            change="Currently enforced"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Resources"
            value={roles.reduce((sum, r) => sum + r.resourceCount, 0)}
            color={THEME.warning}
            change="Managed permissions"
          />
        </Grid>
      </Grid>

      {/* Roles & Permissions Table */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Role Configuration
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Permissions</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Resources</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map(role => (
                  <TableRow key={role.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {role.role}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {role.permissions.split(', ').slice(0, 2).map((perm, idx) => (
                          <Chip
                            key={idx}
                            label={perm}
                            size="small"
                            variant="outlined"
                            sx={{ backgroundColor: '#e0f2fe', borderColor: '#0369a1', color: '#0369a1' }}
                          />
                        ))}
                        {role.permissions.split(', ').length > 2 && (
                          <Chip
                            label={`+${role.permissions.split(', ').length - 2} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {role.resourceCount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {renderStatusChip(role.status)}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(role)}
                        sx={{ color: THEME.primary }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Permission Matrix
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Permission</TableCell>
                  {roles.map(role => (
                    <TableCell key={role.id} align="center" sx={{ fontWeight: 'bold', minWidth: 100 }}>
                      {role.role}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allPermissions.map((permission, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Typography variant="body2">{permission}</Typography></TableCell>
                    {roles.map(role => (
                      <TableCell key={role.id} align="center">
                        <Switch
                          checked={role.permissions.includes(permission)}
                          disabled
                          size="small"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Edit Permissions: {selectedRole?.role}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormGroup>
            {allPermissions.map(permission => (
              <FormControlLabel
                key={permission}
                control={
                  <Switch
                    checked={selectedPermissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                  />
                }
                label={permission}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button
            onClick={handleSavePermissions}
            variant="contained"
            sx={{ backgroundColor: THEME.primary, '&:hover': { backgroundColor: THEME.primaryDark } }}
          >
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
