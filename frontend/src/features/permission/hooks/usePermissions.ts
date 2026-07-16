import { useDispatch, useSelector } from 'react-redux';
import {
  selectPermissions,
  selectPermissionLoading,
  selectPermissionError,
  selectPermissionPagination,
  selectCurrentPermission,
  selectCategories,
} from '../store/permissionSelectors';
import {
  fetchPermissionsAsync,
  fetchPermissionAsync,
  createPermissionAsync,
  updatePermissionAsync,
  deletePermissionAsync,
  deactivatePermissionAsync,
  activatePermissionAsync,
  fetchCategoriesAsync,
  setFilters,
  clearError,
} from '../store/permissionSlice';
import { CreatePermissionRequest, UpdatePermissionRequest, PermissionListFilters } from '../types/permission.types';

export const usePermissions = () => {
  const dispatch = useDispatch() as any;
  const permissions = useSelector(selectPermissions);
  const loading = useSelector(selectPermissionLoading);
  const error = useSelector(selectPermissionError);
  const pagination = useSelector(selectPermissionPagination);
  const currentPermission = useSelector(selectCurrentPermission);
  const categories = useSelector(selectCategories);

  const fetchPermissions = (filters: PermissionListFilters) => {
    return dispatch(fetchPermissionsAsync(filters) as any);
  };

  const fetchPermission = (permissionId: number) => {
    return dispatch(fetchPermissionAsync(permissionId) as any);
  };

  const createPermission = (data: CreatePermissionRequest) => {
    return dispatch(createPermissionAsync(data) as any);
  };

  const updatePermission = (permissionId: number, data: UpdatePermissionRequest) => {
    return dispatch(updatePermissionAsync({ permissionId, data }) as any);
  };

  const deletePermission = (permissionId: number) => {
    return dispatch(deletePermissionAsync(permissionId) as any);
  };

  const deactivatePermission = (permissionId: number) => {
    return dispatch(deactivatePermissionAsync(permissionId) as any);
  };

  const activatePermission = (permissionId: number) => {
    return dispatch(activatePermissionAsync(permissionId) as any);
  };

  const fetchCategories = () => {
    return dispatch(fetchCategoriesAsync() as any);
  };

  const setPermissionFilters = (filters: PermissionListFilters) => {
    dispatch(setFilters(filters));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    permissions,
    loading,
    error,
    pagination,
    currentPermission,
    categories,
    fetchPermissions,
    fetchPermission,
    createPermission,
    updatePermission,
    deletePermission,
    deactivatePermission,
    activatePermission,
    fetchCategories,
    setPermissionFilters,
    clearError: handleClearError,
  };
};
