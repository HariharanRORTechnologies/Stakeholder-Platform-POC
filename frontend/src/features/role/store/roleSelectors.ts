import { RootState } from '../../../store/store';

export const selectRoles = (state: RootState) => state.roles.roles;

export const selectCurrentRole = (state: RootState) => state.roles.currentRole;

export const selectRoleLoading = (state: RootState) => state.roles.loading;

export const selectRoleError = (state: RootState) => state.roles.error;

export const selectRolePagination = (state: RootState) => state.roles.pagination;

export const selectRoleFilters = (state: RootState) => state.roles.filters;

export const selectRoleById = (roleId: number) => (state: RootState) =>
  state.roles.roles.find(r => r.id === roleId);

export const selectRoleByName = (name: string) => (state: RootState) =>
  state.roles.roles.find(r => r.name === name);

export const selectActiveRoles = (state: RootState) =>
  state.roles.roles.filter(r => r.isActive && !r.isSystem);

export const selectSystemRoles = (state: RootState) =>
  state.roles.roles.filter(r => r.isSystem);

export const selectRoleCount = (state: RootState) => state.roles.pagination.total;

export const selectRolesByLevel = (level: number) => (state: RootState) =>
  state.roles.roles.filter(r => r.level === level);

export const selectRolesAboveLevel = (level: number) => (state: RootState) =>
  state.roles.roles.filter(r => r.level < level);

export const selectRolesBelowLevel = (level: number) => (state: RootState) =>
  state.roles.roles.filter(r => r.level > level);

export const selectRoleHierarchy = (state: RootState) =>
  state.roles.roles.sort((a, b) => a.level - b.level);
