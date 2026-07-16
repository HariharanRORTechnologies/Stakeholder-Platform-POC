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
import { useUsers } from '../hooks/useUsers';

export const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser, loading, error, fetchUser } = useUsers();

  useEffect(() => {
    if (userId) {
      fetchUser(parseInt(userId, 10));
    }
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">User not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
          sx={{ mt: 2 }}
        >
          Back to Users
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
            onClick={() => navigate('/users')}
            variant="text"
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {currentUser.firstName} {currentUser.lastName}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/users/${currentUser.id}/edit`)}
        >
          Edit User
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Personal Information
              </Typography>
              <Stack spacing={2}>
                <div>
                  <Typography variant="caption" color="textSecondary">
                    Email
                  </Typography>
                  <Typography>{currentUser.email}</Typography>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Phone Number
                  </Typography>
                  <Typography>{currentUser.phoneNumber || 'Not provided'}</Typography>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Department
                  </Typography>
                  <Typography>{currentUser.departmentId || 'Not assigned'}</Typography>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Account Status
              </Typography>
              <Stack spacing={2}>
                <div>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={currentUser.isActive ? 'Active' : 'Inactive'}
                      color={currentUser.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Email Verified
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={currentUser.isEmailVerified ? 'Verified' : 'Not Verified'}
                      color={currentUser.isEmailVerified ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </div>

                <Divider />

                <div>
                  <Typography variant="caption" color="textSecondary">
                    Last Login
                  </Typography>
                  <Typography>
                    {currentUser.lastLoginAt
                      ? new Date(currentUser.lastLoginAt).toLocaleDateString()
                      : 'Never'}
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
                Roles
              </Typography>
              {currentUser.roles && currentUser.roles.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {currentUser.roles.map(role => (
                    <Chip
                      key={role.id}
                      label={role.name}
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No roles assigned
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
