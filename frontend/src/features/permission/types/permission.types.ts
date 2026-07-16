export interface Permission {
  id: number;
  name: string;
  description?: string;
  category: string;
  isActive: boolean;
  roleCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePermissionRequest {
  name: string;
  description?: string;
  category: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  description?: string;
  category?: string;
}

export interface PermissionListFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  category?: string;
  searchTerm?: string;
}

export interface PermissionListResponse {
  permissions: Permission[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PermissionDetailResponse extends Permission {
  roleCount: number;
}

export const PERMISSION_CATEGORIES = [
  'users',
  'roles',
  'permissions',
  'events',
  'registrations',
  'feedback',
  'csr',
  'volunteers',
  'approvals',
  'reports',
  'analytics',
  'settings',
  'audit',
];

export const CATEGORY_LABELS: { [key: string]: string } = {
  users: 'User Management',
  roles: 'Role Management',
  permissions: 'Permission Management',
  events: 'Event Management',
  registrations: 'Registrations',
  feedback: 'Feedback',
  csr: 'CSR Programs',
  volunteers: 'Volunteer Management',
  approvals: 'Approvals',
  reports: 'Reports',
  analytics: 'Analytics',
  settings: 'Settings',
  audit: 'Audit Logs',
};
