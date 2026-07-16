import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useRoles } from '../hooks/useRoles';
import { ROLE_LEVEL_LABELS } from '../types/role.types';

export const RoleDetailPage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { currentRole, loading, error, fetchRole } = useRoles();

  useEffect(() => {
    if (roleId) {
      fetchRole(parseInt(roleId, 10));
    }
  }, [roleId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentRole) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Role not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/roles')}
          sx={{ mt: 2 }}
        >
          Back to Roles
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/roles')}
            variant="text"
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {currentRole.name}
          </Typography>
        </Box>
        {!currentRole.isSystem && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/roles/${currentRole.id}/edit`)}
          >
            Edit Role
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Role Information
              </Typography>
              <Stack spacing={2}>
                <div>
                  <Typography variant="caption" color="textSecondary">
                    Level
                  </Typography>
                  <Typography>
                    {currentRole.level} - {ROLE_LEVEL_LABELS[currentRole.level] || 'Custom'}
                  </Typography>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Description
                  </Typography>
                  <Typography>
                    {currentRole.description || 'No description provided'}
                  </Typography>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={currentRole.isActive ? 'Active' : 'Inactive'}
                      color={currentRole.isActive ? 'success' : 'default'}
                      size="small"
                    />
                    {currentRole.isSystem && (
                      <Chip label="System Role" sx={{ ml: 1 }} size="small" />
                    )}
                  </Box>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Usage Statistics
              </Typography>
              <Stack spacing={2}>
                <div>
                  <Typography variant="caption" color="textSecondary">
                    Assigned Permissions
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {currentRole.permissionCount || 0}
                  </Typography>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Users with this Role
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {currentRole.userCount || 0}
                  </Typography>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Created
                  </Typography>
                  <Typography>
                    {new Date(currentRole.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Assigned Permissions
              </Typography>
              {currentRole.permissions && currentRole.permissions.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {currentRole.permissions.map(permission => (
                    <Chip
                      key={permission.id}
                      label={`${permission.category}: ${permission.name}`}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No permissions assigned
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
