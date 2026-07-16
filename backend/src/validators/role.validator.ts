import { ValidationError } from '../errors/AppError';

export class RoleValidator {
  static validateCreateRole(data: any): void {
    if (!data.name || data.name.trim().length < 2) {
      throw new ValidationError('Role name must be at least 2 characters');
    }

    if (!Number.isInteger(data.level) || data.level < 1 || data.level > 10) {
      throw new ValidationError('Role level must be an integer between 1 and 10');
    }

    if (data.permissions !== undefined && !Array.isArray(data.permissions)) {
      throw new ValidationError('Permissions must be an array');
    }

    if (data.permissions && data.permissions.some((id: any) => !Number.isInteger(id))) {
      throw new ValidationError('All permission IDs must be integers');
    }
  }

  static validateUpdateRole(data: any): void {
    if (data.name !== undefined) {
      if (data.name.trim().length < 2) {
        throw new ValidationError('Role name must be at least 2 characters');
      }
    }

    if (data.level !== undefined) {
      if (!Number.isInteger(data.level) || data.level < 1 || data.level > 10) {
        throw new ValidationError('Role level must be an integer between 1 and 10');
      }
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
      throw new ValidationError('Description must be a string');
    }
  }

  static validatePermissionAssignment(permissionIds: any): void {
    if (!Array.isArray(permissionIds)) {
      throw new ValidationError('Permission IDs must be an array');
    }

    if (permissionIds.length === 0) {
      throw new ValidationError('At least one permission must be provided');
    }

    if (permissionIds.some((id: any) => !Number.isInteger(id) || id < 1)) {
      throw new ValidationError('All permission IDs must be positive integers');
    }
  }

  static validateRoleLevel(level: number): void {
    if (!Number.isInteger(level) || level < 1 || level > 10) {
      throw new ValidationError('Role level must be an integer between 1 and 10');
    }
  }
}
