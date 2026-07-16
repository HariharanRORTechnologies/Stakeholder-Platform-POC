// Pages
export { PermissionsListPage } from './pages/PermissionsListPage';
export { PermissionDetailPage } from './pages/PermissionDetailPage';

// Components
export { PermissionTable } from './components/PermissionTable';
export { PermissionForm } from './components/PermissionForm';

// Hooks
export { usePermissions } from './hooks/usePermissions';

// Store
export { default as permissionReducer } from './store/permissionSlice';
export * as permissionActions from './store/permissionSlice';
export * as permissionSelectors from './store/permissionSelectors';

// Services
export { permissionService } from './services/permissionService';

// Types
export type {
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionListFilters,
  PermissionListResponse,
  PermissionDetailResponse,
} from './types/permission.types';

export { PERMISSION_CATEGORIES, CATEGORY_LABELS } from './types/permission.types';
