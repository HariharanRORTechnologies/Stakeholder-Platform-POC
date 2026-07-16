import { Pool } from 'mysql2/promise';
import { RoleRepository } from '../repositories/roleRepository';
import { Role } from '../models/Role.model';
import { logger } from '../utils/logger';
import { NotFoundError, ConflictError, ValidationError, AppError } from '../errors/AppError';

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
  roles: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class RoleService {
  private roleRepository: RoleRepository;

  constructor(private db: Pool) {
    this.roleRepository = new RoleRepository(db);
  }

  async createRole(data: CreateRoleRequest): Promise<Role> {
    if (!data.name || data.name.trim().length < 2) {
      throw new ValidationError('Role name must be at least 2 characters');
    }

    if (!Number.isInteger(data.level) || data.level < 1) {
      throw new ValidationError('Role level must be a positive integer');
    }

    const existingRole = await this.roleRepository.findByName(data.name);
    if (existingRole) {
      throw new ConflictError('Role name already exists');
    }

    const role = new Role({
      name: data.name.trim(),
      description: data.description?.trim(),
      level: data.level,
      isSystem: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const roleId = await this.roleRepository.create(role);
    role.id = roleId;

    if (data.permissions && data.permissions.length > 0) {
      for (const permissionId of data.permissions) {
        await this.roleRepository.addPermission(roleId, permissionId);
      }
    }

    logger.info(`Role created: ${role.name}`, { roleId, level: role.level });
    return role;
  }

  async getRoleById(roleId: number): Promise<Role> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundError('Role not found');
    }
    return role;
  }

  async getRoleByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findByName(name);
    if (!role) {
      throw new NotFoundError('Role not found');
    }
    return role;
  }

  async listRoles(filters: RoleListFilters): Promise<RoleListResponse> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);

    const { roles, total } = await this.roleRepository.findAll(page, limit, {
      isActive: filters.isActive,
      isSystem: filters.isSystem,
      searchTerm: filters.searchTerm,
    });

    return {
      roles: await this.enrichRoles(roles),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateRole(roleId: number, data: UpdateRoleRequest): Promise<Role> {
    const role = await this.getRoleById(roleId);

    if (role.isSystem) {
      throw new ValidationError('System roles cannot be modified');
    }

    if (data.name !== undefined) {
      if (data.name.trim().length < 2) {
        throw new ValidationError('Role name must be at least 2 characters');
      }

      const existingRole = await this.roleRepository.findByName(data.name);
      if (existingRole && existingRole.id !== roleId) {
        throw new ConflictError('Role name already exists');
      }

      data.name = data.name.trim();
    }

    if (data.level !== undefined) {
      if (!Number.isInteger(data.level) || data.level < 1) {
        throw new ValidationError('Role level must be a positive integer');
      }
    }

    if (data.description !== undefined) {
      data.description = data.description?.trim();
    }

    const updateData: Partial<Role> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.level !== undefined) updateData.level = data.level;

    const updated = await this.roleRepository.update(roleId, updateData);
    if (!updated) {
      throw new AppError('Failed to update role', 500);
    }

    const updatedRole = await this.getRoleById(roleId);
    logger.info(`Role updated: ${updatedRole.name}`, { roleId });
    return updatedRole;
  }

  async deleteRole(roleId: number): Promise<void> {
    const role = await this.getRoleById(roleId);

    if (role.isSystem) {
      throw new ValidationError('System roles cannot be deleted');
    }

    const canDelete = await this.roleRepository.canDeleteRole(roleId);
    if (!canDelete) {
      throw new ValidationError('Cannot delete role that is assigned to users');
    }

    const deleted = await this.roleRepository.delete(roleId);
    if (!deleted) {
      throw new AppError('Failed to delete role', 500);
    }

    logger.info(`Role deleted: ${role.name}`, { roleId });
  }

  async deactivateRole(roleId: number): Promise<void> {
    const role = await this.getRoleById(roleId);

    if (role.isSystem) {
      throw new ValidationError('System roles cannot be deactivated');
    }

    const updated = await this.roleRepository.update(roleId, { isActive: false });
    if (!updated) {
      throw new AppError('Failed to deactivate role', 500);
    }

    logger.info(`Role deactivated: ${role.name}`, { roleId });
  }

  async activateRole(roleId: number): Promise<void> {
    const role = await this.getRoleById(roleId);

    const updated = await this.roleRepository.update(roleId, { isActive: true });
    if (!updated) {
      throw new AppError('Failed to activate role', 500);
    }

    logger.info(`Role activated: ${role.name}`, { roleId });
  }

  async getRolePermissions(roleId: number): Promise<any[]> {
    const role = await this.getRoleById(roleId);
    return this.roleRepository.getPermissions(roleId);
  }

  async addPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    const role = await this.getRoleById(roleId);

    const permission = await this.getPermissionById(permissionId);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    const added = await this.roleRepository.addPermission(roleId, permissionId);
    if (!added) {
      throw new AppError('Failed to add permission to role', 500);
    }

    logger.info(`Permission added to role: ${role.name}`, { roleId, permissionId });
  }

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    const role = await this.getRoleById(roleId);

    const removed = await this.roleRepository.removePermission(roleId, permissionId);
    if (!removed) {
      throw new AppError('Failed to remove permission from role', 500);
    }

    logger.info(`Permission removed from role: ${role.name}`, { roleId, permissionId });
  }

  async setRolePermissions(roleId: number, permissionIds: number[]): Promise<void> {
    const role = await this.getRoleById(roleId);

    await this.roleRepository.removeAllPermissions(roleId);

    for (const permissionId of permissionIds) {
      await this.roleRepository.addPermission(roleId, permissionId);
    }

    logger.info(`Role permissions updated: ${role.name}`, {
      roleId,
      permissionCount: permissionIds.length,
    });
  }

  async validateRoleHierarchy(
    userRole: Role,
    targetRoleId: number
  ): Promise<{ valid: boolean; reason?: string }> {
    const targetRole = await this.getRoleById(targetRoleId);

    if (!userRole.canManageRole(targetRole)) {
      return {
        valid: false,
        reason: 'Cannot manage roles at your level or higher',
      };
    }

    return { valid: true };
  }

  private async enrichRoles(roles: Role[]): Promise<any[]> {
    return Promise.all(
      roles.map(async role => ({
        ...role,
        permissionCount: (await this.getRolePermissions(role.id)).length,
        userCount: await this.roleRepository.getUserCount(role.id),
      }))
    );
  }

  private async getPermissionById(permissionId: number): Promise<any> {
    const sql = 'SELECT * FROM permissions WHERE id = ? AND is_active = TRUE';
    return this.roleRepository['queryOne'](sql, [permissionId]);
  }
}
