import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../services/permissionService';
import { AppError } from '../errors/AppError';

export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  async createPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permission = await this.permissionService.createPermission(req.body);

      res.status(201).json({
        success: true,
        message: 'Permission created successfully',
        data: this.formatPermission(permission),
      });
    } catch (error) {
      next(error);
    }
  }

  async getPermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { permissionId } = req.params;

      const permission = await this.permissionService.getPermissionById(parseInt(permissionId, 10));
      const roleCount = await this.permissionService.getRoleCount(permission.id);

      res.json({
        success: true,
        message: 'Permission retrieved successfully',
        data: {
          ...this.formatPermission(permission),
          roleCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async listPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        category: req.query.category as string,
        searchTerm: req.query.search as string,
      };

      const result = await this.permissionService.listPermissions(filters);

      res.json({
        success: true,
        message: 'Permissions retrieved successfully',
        data: {
          permissions: result.permissions.map(p => this.formatPermission(p)),
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

  async updatePermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { permissionId } = req.params;

      const permission = await this.permissionService.updatePermission(
        parseInt(permissionId, 10),
        req.body
      );

      res.json({
        success: true,
        message: 'Permission updated successfully',
        data: this.formatPermission(permission),
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { permissionId } = req.params;

      await this.permissionService.deletePermission(parseInt(permissionId, 10));

      res.json({
        success: true,
        message: 'Permission deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivatePermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { permissionId } = req.params;

      await this.permissionService.deactivatePermission(parseInt(permissionId, 10));

      res.json({
        success: true,
        message: 'Permission deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async activatePermission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { permissionId } = req.params;

      await this.permissionService.activatePermission(parseInt(permissionId, 10));

      res.json({
        success: true,
        message: 'Permission activated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await this.permissionService.getCategories();

      res.json({
        success: true,
        message: 'Permission categories retrieved successfully',
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPermissionsByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.params;

      const permissions = await this.permissionService.getPermissionsByCategory(category);

      res.json({
        success: true,
        message: 'Permissions retrieved successfully',
        data: permissions.map(p => this.formatPermission(p)),
      });
    } catch (error) {
      next(error);
    }
  }

  async seedPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.permissionService.seedDefaultPermissions();

      res.json({
        success: true,
        message: 'Default permissions seeded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  private formatPermission(permission: any) {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      category: permission.category,
      isActive: permission.isActive,
      roleCount: permission.roleCount,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
