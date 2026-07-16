import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/roleService';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

export class RoleController {
  constructor(private roleService: RoleService) {}

  async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await this.roleService.createRole(req.body);

      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: this.formatRole(role),
      });
    } catch (error) {
      next(error);
    }
  }

  async getRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;

      const role = await this.roleService.getRoleById(parseInt(roleId, 10));
      const permissions = await this.roleService.getRolePermissions(role.id);

      res.json({
        success: true,
        message: 'Role retrieved successfully',
        data: {
          ...this.formatRole(role),
          permissions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async listRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        isSystem: req.query.isSystem ? req.query.isSystem === 'true' : undefined,
        searchTerm: req.query.search as string,
      };

      const result = await this.roleService.listRoles(filters);

      res.json({
        success: true,
        message: 'Roles retrieved successfully',
        data: {
          roles: result.roles.map(r => this.formatRole(r)),
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;

      const role = await this.roleService.updateRole(parseInt(roleId, 10), req.body);

      res.json({
        success: true,
        message: 'Role updated successfully',
        data: this.formatRole(role),
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;

      await this.roleService.deleteRole(parseInt(roleId, 10));

      res.json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;

      await this.roleService.deactivateRole(parseInt(roleId, 10));

      res.json({
        success: true,
        message: 'Role deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async activateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;

      await this.roleService.activateRole(parseInt(roleId, 10));

      res.json({
        success: true,
        message: 'Role activated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;

      const permissions = await this.roleService.getRolePermissions(parseInt(roleId, 10));

      res.json({
        success: true,
        message: 'Role permissions retrieved successfully',
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }

  async addPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;
      const { permissionId } = req.body;

      if (!permissionId) {
        throw new AppError('Permission ID is required', 400);
      }

      await this.roleService.addPermissionToRole(parseInt(roleId, 10), permissionId);

      res.json({
        success: true,
        message: 'Permission added to role successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async removePermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId, permissionId } = req.params;

      await this.roleService.removePermissionFromRole(
        parseInt(roleId, 10),
        parseInt(permissionId, 10)
      );

      res.json({
        success: true,
        message: 'Permission removed from role successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async setPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roleId } = req.params;
      const { permissionIds } = req.body;

      if (!Array.isArray(permissionIds)) {
        throw new AppError('permissionIds must be an array', 400);
      }

      await this.roleService.setRolePermissions(parseInt(roleId, 10), permissionIds);

      res.json({
        success: true,
        message: 'Role permissions updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  private formatRole(role: any) {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      level: role.level,
      isSystem: role.isSystem,
      isActive: role.isActive,
      permissionCount: role.permissionCount,
      userCount: role.userCount,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
