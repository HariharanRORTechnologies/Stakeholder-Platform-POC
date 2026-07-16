import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectUser,
  selectAuthLoading,
  selectAuthError,
  selectUserPermissions,
  selectUserRole,
} from '../store/authSelectors';
import {
  loginAsync,
  registerAsync,
  logoutAsync,
  refreshTokenAsync,
} from '../store/authSlice';
import { LoginCredentials } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useDispatch() as any;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const permissions = useSelector(selectUserPermissions);
  const role = useSelector(selectUserRole);

  const login = (credentials: LoginCredentials) => {
    return dispatch(loginAsync(credentials) as any);
  };

  const register = (data: any) => {
    return dispatch(registerAsync(data) as any);
  };

  const logout = () => {
    return dispatch(logoutAsync() as any);
  };

  const refreshToken = () => {
    return dispatch(refreshTokenAsync() as any);
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasRole = (requiredRole: string): boolean => {
    return role === requiredRole;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(role || '');
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    permissions,
    role,
    login,
    register,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
    hasAnyRole,
  };
};
