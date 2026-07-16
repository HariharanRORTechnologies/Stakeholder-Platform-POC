// Pages
export { RolesListPage } from './pages/RolesListPage';
export { RoleDetailPage } from './pages/RoleDetailPage';

// Components
export { RoleTable } from './components/RoleTable';
export { RoleForm } from './components/RoleForm';

// Hooks
export { useRoles } from './hooks/useRoles';

// Store
export { default as roleReducer } from './store/roleSlice';
export * as roleActions from './store/roleSlice';
export * as roleSelectors from './store/roleSelectors';

// Services
export { roleService } from './services/roleService';

// Types
export type {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleListFilters,
  RoleListResponse,
  RoleDetailResponse,
  RoleHierarchy,
} from './types/role.types';

export { ROLE_LEVEL_LABELS, ROLE_LEVEL_DESCRIPTIONS } from './types/role.types';
