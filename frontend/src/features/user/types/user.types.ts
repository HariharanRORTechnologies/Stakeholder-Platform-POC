export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  departmentId?: number;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  level: number;
}

export interface Permission {
  id: number;
  name: string;
  category: string;
  description?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  departmentId?: number;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  departmentId?: number;
  isActive?: boolean;
}

export interface UserListFilters {
  page?: number;
  limit?: number;
  departmentId?: number;
  isActive?: boolean;
  roleId?: number;
  searchTerm?: string;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserDetailResponse extends User {
  roles: Role[];
  permissions?: Permission[];
}

export interface BulkUserCreateRequest {
  users: CreateUserRequest[];
}

export interface BulkUserCreateResponse {
  successful: number;
  failed: number;
  errors?: Array<{ index: number; error: string }>;
}
