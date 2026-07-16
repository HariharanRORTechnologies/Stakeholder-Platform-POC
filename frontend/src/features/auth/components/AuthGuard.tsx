import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermissions?: string | string[];
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole,
  requiredPermissions,
  fallback = <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>,
}) => {
  const { isAuthenticated, loading, hasPermission, hasAnyRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasAnyRole([requiredRole])) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermissions) {
    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    const hasRequiredPermission = permissions.some(permission => hasPermission(permission));

    if (!hasRequiredPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
