import { RootState } from '../../../store/store';

export const selectUsers = (state: RootState) => state.users.users;

export const selectCurrentUser = (state: RootState) => state.users.currentUser;

export const selectUserLoading = (state: RootState) => state.users.loading;

export const selectUserError = (state: RootState) => state.users.error;

export const selectUserPagination = (state: RootState) => state.users.pagination;

export const selectUserFilters = (state: RootState) => state.users.filters;

export const selectUserById = (userId: number) => (state: RootState) =>
  state.users.users.find(u => u.id === userId);

export const selectUserByEmail = (email: string) => (state: RootState) =>
  state.users.users.find(u => u.email === email);

export const selectActiveUsers = (state: RootState) =>
  state.users.users.filter(u => u.isActive);

export const selectInactiveUsers = (state: RootState) =>
  state.users.users.filter(u => !u.isActive);

export const selectUserCount = (state: RootState) => state.users.pagination.total;

export const selectUsersByDepartment = (departmentId: number) => (state: RootState) =>
  state.users.users.filter(u => u.departmentId === departmentId);

export const selectUsersByRole = (roleId: number) => (state: RootState) =>
  state.users.users.filter(u => u.roles?.some(r => r.id === roleId));
