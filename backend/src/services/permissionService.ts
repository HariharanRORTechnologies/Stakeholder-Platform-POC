import { Pool } from 'mysql2/promise';
import { PermissionRepository } from '../repositories/permissionRepository';
import { Permission, PermissionCategory } from '../models/Permission.model';
import { logger } from '../utils/logger';
import { NotFoundError, ConflictError, ValidationError, AppError } from '../errors/AppError';

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
  permissions: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PermissionService {
  private permissionRepository: PermissionRepository;

  constructor(private db: Pool) {
    this.permissionRepository = new PermissionRepository(db);
  }

  async createPermission(data: CreatePermissionRequest): Promise<Permission> {
    if (!data.name || data.name.trim().length < 3) {
      throw new ValidationError('Permission name must be at least 3 characters');
    }

    if (!data.category || data.category.trim().length < 2) {
      throw new ValidationError('Permission category is required');
    }

    const existingPermission = await this.permissionRepository.findByName(data.name);
    if (existingPermission) {
      throw new ConflictError('Permission name already exists');
    }

    const permission = new Permission({
      name: data.name.trim().toLowerCase(),
      description: data.description?.trim(),
      category: data.category.trim().toLowerCase(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const permissionId = await this.permissionRepository.create(permission);
    permission.id = permissionId;

    logger.info(`Permission created: ${permission.name}`, {
      permissionId,
      category: permission.category,
    });

    return permission;
  }

  async getPermissionById(permissionId: number): Promise<Permission> {
    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }
    return permission;
  }

  async getPermissionByName(name: string): Promise<Permission> {
    const permission = await this.permissionRepository.findByName(name);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }
    return permission;
  }

  async listPermissions(filters: PermissionListFilters): Promise<PermissionListResponse> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 50, 200);

    const { permissions, total } = await this.permissionRepository.findAll(page, limit, {
      isActive: filters.isActive,
      category: filters.category,
      searchTerm: filters.searchTerm,
    });

    return {
      permissions: await this.enrichPermissions(permissions),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updatePermission(
    permissionId: number,
    data: UpdatePermissionRequest
  ): Promise<Permission> {
    const permission = await this.getPermissionById(permissionId);

    if (data.name !== undefined) {
      if (data.name.trim().length < 3) {
        throw new ValidationError('Permission name must be at least 3 characters');
      }

      const existingPermission = await this.permissionRepository.findByName(data.name);
      if (existingPermission && existingPermission.id !== permissionId) {
        throw new ConflictError('Permission name already exists');
      }

      data.name = data.name.trim().toLowerCase();
    }

    if (data.category !== undefined) {
      if (data.category.trim().length < 2) {
        throw new ValidationError('Permission category is required');
      }
      data.category = data.category.trim().toLowerCase();
    }

    if (data.description !== undefined) {
      data.description = data.description?.trim();
    }

    const updateData: Partial<Permission> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;

    const updated = await this.permissionRepository.update(permissionId, updateData);
    if (!updated) {
      throw new AppError('Failed to update permission', 500);
    }

    const updatedPermission = await this.getPermissionById(permissionId);
    logger.info(`Permission updated: ${updatedPermission.name}`, { permissionId });
    return updatedPermission;
  }

  async deletePermission(permissionId: number): Promise<void> {
    const permission = await this.getPermissionById(permissionId);

    const canDelete = await this.permissionRepository.canDeletePermission(permissionId);
    if (!canDelete) {
      throw new ValidationError(
        'Cannot delete permission that is assigned to roles'
      );
    }

    const deleted = await this.permissionRepository.delete(permissionId);
    if (!deleted) {
      throw new AppError('Failed to delete permission', 500);
    }

    logger.info(`Permission deleted: ${permission.name}`, { permissionId });
  }

  async deactivatePermission(permissionId: number): Promise<void> {
    const permission = await this.getPermissionById(permissionId);

    const updated = await this.permissionRepository.update(permissionId, {
      isActive: false,
    });

    if (!updated) {
      throw new AppError('Failed to deactivate permission', 500);
    }

    logger.info(`Permission deactivated: ${permission.name}`, { permissionId });
  }

  async activatePermission(permissionId: number): Promise<void> {
    const permission = await this.getPermissionById(permissionId);

    const updated = await this.permissionRepository.update(permissionId, {
      isActive: true,
    });

    if (!updated) {
      throw new AppError('Failed to activate permission', 500);
    }

    logger.info(`Permission activated: ${permission.name}`, { permissionId });
  }

  async getPermissionsByCategory(category: string): Promise<Permission[]> {
    return this.permissionRepository.getPermissionsByCategory(category);
  }

  async getCategories(): Promise<string[]> {
    return this.permissionRepository.getCategories();
  }

  async getRoleCount(permissionId: number): Promise<number> {
    return this.permissionRepository.getRoleCount(permissionId);
  }

  async seedDefaultPermissions(): Promise<void> {
    const defaultPermissions = this.getDefaultPermissions();

    for (const perm of defaultPermissions) {
      const existing = await this.permissionRepository.findByName(perm.name);
      if (!existing) {
        await this.permissionRepository.create(perm);
        logger.info(`Seeded permission: ${perm.name}`);
      }
    }

    logger.info(`Permission seeding completed`);
  }

  private getDefaultPermissions(): Permission[] {
    return [
      // User Management
      new Permission({
        name: 'users.create',
        description: 'Can create new users',
        category: 'users',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'users.read',
        description: 'Can view user information',
        category: 'users',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'users.update',
        description: 'Can update user information',
        category: 'users',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'users.delete',
        description: 'Can delete users',
        category: 'users',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'users.change_password',
        description: 'Can reset user passwords',
        category: 'users',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'users.approve',
        description: 'Can approve pending user registrations',
        category: 'users',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),

      // Role Management
      new Permission({
        name: 'roles.create',
        description: 'Can create new roles',
        category: 'roles',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'roles.read',
        description: 'Can view role information',
        category: 'roles',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'roles.update',
        description: 'Can update role information',
        category: 'roles',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'roles.delete',
        description: 'Can delete roles',
        category: 'roles',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'roles.assign',
        description: 'Can assign roles to users',
        category: 'roles',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),

      // Permission Management
      new Permission({
        name: 'permissions.create',
        description: 'Can create new permissions',
        category: 'permissions',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'permissions.read',
        description: 'Can view permission information',
        category: 'permissions',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'permissions.update',
        description: 'Can update permission information',
        category: 'permissions',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'permissions.delete',
        description: 'Can delete permissions',
        category: 'permissions',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),

      // Event Management
      new Permission({
        name: 'events.create',
        description: 'Can create events',
        category: 'events',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'events.read',
        description: 'Can view events',
        category: 'events',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'events.update',
        description: 'Can update events',
        category: 'events',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'events.delete',
        description: 'Can delete events',
        category: 'events',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'events.approve',
        description: 'Can approve pending events',
        category: 'events',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),

      // Reporting
      new Permission({
        name: 'reports.read',
        description: 'Can view reports',
        category: 'reports',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'reports.export',
        description: 'Can export reports',
        category: 'reports',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),

      // Audit
      new Permission({
        name: 'audit.read',
        description: 'Can view audit logs',
        category: 'audit',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),

      // Settings
      new Permission({
        name: 'settings.read',
        description: 'Can view system settings',
        category: 'settings',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Permission({
        name: 'settings.update',
        description: 'Can update system settings',
        category: 'settings',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];
  }

  private async enrichPermissions(permissions: Permission[]): Promise<any[]> {
    return Promise.all(
      permissions.map(async permission => ({
        ...permission,
        roleCount: await this.getRoleCount(permission.id),
      }))
    );
  }
}
