import { RootState } from '../../../store/store';

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectUser = (state: RootState) => state.auth.user;

export const selectAccessToken = (state: RootState) => state.auth.tokens.accessToken;

export const selectRefreshToken = (state: RootState) => state.auth.tokens.refreshToken;

export const selectAuthLoading = (state: RootState) => state.auth.loading;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectMFAPending = (state: RootState) => state.auth.mfaPending;

export const selectMFAUserId = (state: RootState) => state.auth.mfaUserId;

export const selectUserRole = (state: RootState) => state.auth.user?.roleName;

export const selectUserPermissions = (state: RootState) => state.auth.user?.permissions || [];

export const selectHasPermission = (permission: string) => (state: RootState) =>
  state.auth.user?.permissions.includes(permission) ?? false;

export const selectHasRole = (role: string) => (state: RootState) =>
  state.auth.user?.roleName === role;

export const selectUserEmail = (state: RootState) => state.auth.user?.email;

export const selectUserId = (state: RootState) => state.auth.user?.userId;
