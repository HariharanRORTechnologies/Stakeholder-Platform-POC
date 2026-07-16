import { useDispatch, useSelector } from 'react-redux';
import {
  selectUsers,
  selectUserLoading,
  selectUserError,
  selectUserPagination,
  selectCurrentUser,
} from '../store/userSelectors';
import {
  fetchUsersAsync,
  fetchUserAsync,
  createUserAsync,
  updateUserAsync,
  deleteUserAsync,
  deactivateUserAsync,
  activateUserAsync,
  setFilters,
  clearError,
} from '../store/userSlice';
import { CreateUserRequest, UpdateUserRequest, UserListFilters } from '../types/user.types';

export const useUsers = () => {
  const dispatch = useDispatch() as any;
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const pagination = useSelector(selectUserPagination);
  const currentUser = useSelector(selectCurrentUser);

  const fetchUsers = (filters: UserListFilters) => {
    return dispatch(fetchUsersAsync(filters) as any);
  };

  const fetchUser = (userId: number) => {
    return dispatch(fetchUserAsync(userId) as any);
  };

  const createUser = (data: CreateUserRequest) => {
    return dispatch(createUserAsync(data) as any);
  };

  const updateUser = (userId: number, data: UpdateUserRequest) => {
    return dispatch(updateUserAsync({ userId, data }) as any);
  };

  const deleteUser = (userId: number) => {
    return dispatch(deleteUserAsync(userId) as any);
  };

  const deactivateUser = (userId: number) => {
    return dispatch(deactivateUserAsync(userId) as any);
  };

  const activateUser = (userId: number) => {
    return dispatch(activateUserAsync(userId) as any);
  };

  const setUserFilters = (filters: UserListFilters) => {
    dispatch(setFilters(filters));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    users,
    loading,
    error,
    pagination,
    currentUser,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    deactivateUser,
    activateUser,
    setUserFilters,
    clearError: handleClearError,
  };
};
