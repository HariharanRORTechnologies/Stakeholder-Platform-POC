import { useDispatch, useSelector } from 'react-redux';
import {
  selectRoles,
  selectRoleLoading,
  selectRoleError,
  selectRolePagination,
  selectCurrentRole,
} from '../store/roleSelectors';
import {
  fetchRolesAsync,
  fetchRoleAsync,
  createRoleAsync,
  updateRoleAsync,
  deleteRoleAsync,
  deactivateRoleAsync,
  activateRoleAsync,
  setFilters,
  clearError,
} from '../store/roleSlice';
import { CreateRoleRequest, UpdateRoleRequest, RoleListFilters } from '../types/role.types';

export const useRoles = () => {
  const dispatch = useDispatch() as any;
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectRoleLoading);
  const error = useSelector(selectRoleError);
  const pagination = useSelector(selectRolePagination);
  const currentRole = useSelector(selectCurrentRole);

  const fetchRoles = (filters: RoleListFilters) => {
    return dispatch(fetchRolesAsync(filters) as any);
  };

  const fetchRole = (roleId: number) => {
    return dispatch(fetchRoleAsync(roleId) as any);
  };

  const createRole = (data: CreateRoleRequest) => {
    return dispatch(createRoleAsync(data) as any);
  };

  const updateRole = (roleId: number, data: UpdateRoleRequest) => {
    return dispatch(updateRoleAsync({ roleId, data }) as any);
  };

  const deleteRole = (roleId: number) => {
    return dispatch(deleteRoleAsync(roleId) as any);
  };

  const deactivateRole = (roleId: number) => {
    return dispatch(deactivateRoleAsync(roleId) as any);
  };

  const activateRole = (roleId: number) => {
    return dispatch(activateRoleAsync(roleId) as any);
  };

  const setRoleFilters = (filters: RoleListFilters) => {
    dispatch(setFilters(filters));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    roles,
    loading,
    error,
    pagination,
    currentRole,
    fetchRoles,
    fetchRole,
    createRole,
    updateRole,
    deleteRole,
    deactivateRole,
    activateRole,
    setRoleFilters,
    clearError: handleClearError,
  };
};
