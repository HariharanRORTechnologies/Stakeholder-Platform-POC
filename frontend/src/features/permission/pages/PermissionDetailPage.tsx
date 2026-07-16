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
import { usePermissions } from '../hooks/usePermissions';
import { CATEGORY_LABELS } from '../types/permission.types';

export const PermissionDetailPage: React.FC = () => {
  const { permissionId } = useParams<{ permissionId: string }>();
  const navigate = useNavigate();
  const { currentPermission, loading, error, fetchPermission } = usePermissions();

  useEffect(() => {
    if (permissionId) {
      fetchPermission(parseInt(permissionId, 10));
    }
  }, [permissionId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentPermission) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Permission not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/permissions')}
          sx={{ mt: 2 }}
        >
          Back to Permissions
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
            onClick={() => navigate('/permissions')}
            variant="text"
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {currentPermission.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/permissions/${currentPermission.id}/edit`)}
        >
          Edit Permission
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Permission Details
              </Typography>
              <Stack spacing={2}>
                <div>
                  <Typography variant="caption" color="textSecondary">
                    Category
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={CATEGORY_LABELS[currentPermission.category] || currentPermission.category}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Description
                  </Typography>
                  <Typography>
                    {currentPermission.description || 'No description provided'}
                  </Typography>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={currentPermission.isActive ? 'Active' : 'Inactive'}
                      color={currentPermission.isActive ? 'success' : 'default'}
                      size="small"
                    />
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
                Usage Information
              </Typography>
              <Stack spacing={2}>
                <div>
                  <Typography variant="caption" color="textSecondary">
                    Assigned to Roles
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {currentPermission.roleCount || 0}
                  </Typography>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Created
                  </Typography>
                  <Typography>
                    {new Date(currentPermission.createdAt).toLocaleDateString()}
                  </Typography>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Last Updated
                  </Typography>
                  <Typography>
                    {new Date(currentPermission.updatedAt).toLocaleDateString()}
                  </Typography>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
