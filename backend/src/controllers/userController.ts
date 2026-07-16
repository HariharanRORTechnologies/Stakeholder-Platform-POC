import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: this.formatUser(user),
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await this.userService.getUserById(parseInt(userId, 10));
      const roles = await this.userService.getUserRoles(user.id);

      res.json({
        success: true,
        message: 'User retrieved successfully',
        data: {
          ...this.formatUser(user),
          roles,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        departmentId: req.query.departmentId ? parseInt(req.query.departmentId as string, 10) : undefined,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        roleId: req.query.roleId ? parseInt(req.query.roleId as string, 10) : undefined,
        searchTerm: req.query.search as string,
      };

      const result = await this.userService.listUsers(filters);

      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users: result.users.map(u => this.formatUser(u)),
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

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await this.userService.updateUser(parseInt(userId, 10), req.body);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: this.formatUser(user),
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { hardDelete } = req.body;

      await this.userService.deleteUser(parseInt(userId, 10), hardDelete);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      await this.userService.deactivateUser(parseInt(userId, 10));

      res.json({
        success: true,
        message: 'User deactivated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      await this.userService.activateUser(parseInt(userId, 10));

      res.json({
        success: true,
        message: 'User activated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        throw new AppError('New password is required', 400);
      }

      await this.userService.resetPassword(parseInt(userId, 10), newPassword);

      res.json({
        success: true,
        message: 'User password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async unlockAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      await this.userService.unlockAccount(parseInt(userId, 10));

      res.json({
        success: true,
        message: 'User account unlocked successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      await this.userService.verifyEmail(parseInt(userId, 10));

      res.json({
        success: true,
        message: 'User email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async assignRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;

      if (!roleId) {
        throw new AppError('Role ID is required', 400);
      }

      await this.userService.assignRole(parseInt(userId, 10), roleId);

      res.json({
        success: true,
        message: 'Role assigned successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async removeRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;

      if (!roleId) {
        throw new AppError('Role ID is required', 400);
      }

      await this.userService.removeRole(parseInt(userId, 10), roleId);

      res.json({
        success: true,
        message: 'Role removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const roles = await this.userService.getUserRoles(parseInt(userId, 10));

      res.json({
        success: true,
        message: 'User roles retrieved successfully',
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const permissions = await this.userService.getUserPermissions(parseInt(userId, 10));

      res.json({
        success: true,
        message: 'User permissions retrieved successfully',
        data: permissions.map(p => p.name),
      });
    } catch (error) {
      next(error);
    }
  }

  private formatUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.getFullName?.(),
      phoneNumber: user.phoneNumber,
      avatarUrl: user.avatarUrl,
      departmentId: user.departmentId,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
