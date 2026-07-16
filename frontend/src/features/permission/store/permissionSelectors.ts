import { RootState } from '../../../store/store';

export const selectPermissions = (state: RootState) => state.permissions.permissions;

export const selectCurrentPermission = (state: RootState) => state.permissions.currentPermission;

export const selectPermissionLoading = (state: RootState) => state.permissions.loading;

export const selectPermissionError = (state: RootState) => state.permissions.error;

export const selectPermissionPagination = (state: RootState) => state.permissions.pagination;

export const selectPermissionFilters = (state: RootState) => state.permissions.filters;

export const selectCategories = (state: RootState) => state.permissions.categories;

export const selectPermissionById = (permissionId: number) => (state: RootState) =>
  state.permissions.permissions.find(p => p.id === permissionId);

export const selectPermissionByName = (name: string) => (state: RootState) =>
  state.permissions.permissions.find(p => p.name === name);

export const selectActivePermissions = (state: RootState) =>
  state.permissions.permissions.filter(p => p.isActive);

export const selectInactivePermissions = (state: RootState) =>
  state.permissions.permissions.filter(p => !p.isActive);

export const selectPermissionCount = (state: RootState) => state.permissions.pagination.total;

export const selectPermissionsByCategory = (category: string) => (state: RootState) =>
  state.permissions.permissions.filter(p => p.category === category);

export const selectPermissionsByCategories = (categories: string[]) => (state: RootState) =>
  state.permissions.permissions.filter(p => categories.includes(p.category));

export const selectPermissionsGroupedByCategory = (state: RootState) => {
  const grouped: { [key: string]: typeof state.permissions.permissions } = {};
  state.permissions.permissions.forEach(permission => {
    if (!grouped[permission.category]) {
      grouped[permission.category] = [];
    }
    grouped[permission.category].push(permission);
  });
  return grouped;
};
