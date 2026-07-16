export interface Role {
  id: number;
  name: string;
  description?: string;
  level: number;
  isSystem: boolean;
  isActive: boolean;
  permissionCount?: number;
  userCount?: number;
  createdAt: Date;
  updatedAt: Date;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  category: string;
  description?: string;
  isActive: boolean;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  level: number;
  permissions?: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  level?: number;
}

export interface RoleListFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  isSystem?: boolean;
  searchTerm?: string;
}

export interface RoleListResponse {
  roles: Role[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RoleDetailResponse extends Role {
  permissions: Permission[];
}

export interface RoleHierarchy {
  level: number;
  canCreateRolesAbove: boolean;
  canManageRolesBelow: boolean;
  maxManagedLevel: number;
}

export const ROLE_LEVEL_LABELS: { [key: number]: string } = {
  1: 'Super Admin',
  2: 'Admin',
  3: 'Management',
  4: 'Coordinator',
  5: 'Employee',
  6: 'External User',
  7: 'Volunteer',
  8: 'Guest',
  9: 'Viewer',
  10: 'Restricted',
};

export const ROLE_LEVEL_DESCRIPTIONS: { [key: number]: string } = {
  1: 'Highest privilege level with complete system access',
  2: 'System management and administration',
  3: 'Strategic oversight and management',
  4: 'Departmental coordination',
  5: 'General employee with standard access',
  6: 'External stakeholders with limited access',
  7: 'Volunteer with event-specific access',
  8: 'Guest with view-only access',
  9: 'Viewer with minimal read access',
  10: 'Restricted user with minimal permissions',
};
