import { Pool } from 'mysql2/promise';
import { UserRepository } from '../repositories/userRepository';
import { User } from '../models/User.model';
import { AuthValidator } from '../validators/auth.validator';
import { CryptoUtils } from '../utils/cryptoUtils';
import { logger } from '../utils/logger';
import { NotFoundError, ConflictError, ValidationError, AppError } from '../errors/AppError';
import { AuthProvider } from '../types/auth.types';

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  departmentId?: number;
  authProvider?: AuthProvider;
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
  users: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserService {
  private userRepository: UserRepository;

  constructor(private db: Pool) {
    this.userRepository = new UserRepository(db);
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    AuthValidator.validateEmail(data.email);
    AuthValidator.validatePassword(data.password);

    if (!data.firstName?.trim() || data.firstName.trim().length < 2) {
      throw new ValidationError('First name must be at least 2 characters');
    }

    if (!data.lastName?.trim() || data.lastName.trim().length < 2) {
      throw new ValidationError('Last name must be at least 2 characters');
    }

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    const passwordHash = await CryptoUtils.hashPassword(data.password);

    const user = new User({
      email: data.email.toLowerCase(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      passwordHash,
      phoneNumber: data.phoneNumber,
      departmentId: data.departmentId,
      authProvider: data.authProvider || AuthProvider.LOCAL,
      isActive: data.isActive !== false,
      isEmailVerified: false,
      failedLoginAttempts: 0,
      mfaEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userId = await this.userRepository.create(user);
    user.id = userId;

    logger.info(`User created: ${user.email}`, { userId });
    return user;
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async listUsers(filters: UserListFilters): Promise<UserListResponse> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);

    const { users, total } = await this.userRepository.findAll(page, limit, {
      departmentId: filters.departmentId,
      isActive: filters.isActive,
      roleId: filters.roleId,
    });

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const filtered = users.filter(
        u =>
          u.firstName.toLowerCase().includes(searchLower) ||
          u.lastName.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
      );

      return {
        users: await this.enrichUsers(filtered),
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      };
    }

    return {
      users: await this.enrichUsers(users),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUser(userId: number, data: UpdateUserRequest): Promise<User> {
    const user = await this.getUserById(userId);

    if (data.firstName !== undefined) {
      if (data.firstName.trim().length < 2) {
        throw new ValidationError('First name must be at least 2 characters');
      }
      data.firstName = data.firstName.trim();
    }

    if (data.lastName !== undefined) {
      if (data.lastName.trim().length < 2) {
        throw new ValidationError('Last name must be at least 2 characters');
      }
      data.lastName = data.lastName.trim();
    }

    if (data.phoneNumber !== undefined && data.phoneNumber) {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(data.phoneNumber)) {
        throw new ValidationError('Invalid phone number format');
      }
    }

    const updateData: Partial<User> = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.departmentId !== undefined) updateData.departmentId = data.departmentId;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const updated = await this.userRepository.update(userId, updateData);
    if (!updated) {
      throw new AppError('Failed to update user', 500);
    }

    const updatedUser = await this.getUserById(userId);
    logger.info(`User updated: ${updatedUser.email}`, { userId });
    return updatedUser;
  }

  async deactivateUser(userId: number): Promise<void> {
    const user = await this.getUserById(userId);

    const updated = await this.userRepository.update(userId, { isActive: false });
    if (!updated) {
      throw new AppError('Failed to deactivate user', 500);
    }

    logger.info(`User deactivated: ${user.email}`, { userId });
  }

  async activateUser(userId: number): Promise<void> {
    const user = await this.getUserById(userId);

    const updated = await this.userRepository.update(userId, { isActive: true });
    if (!updated) {
      throw new AppError('Failed to activate user', 500);
    }

    logger.info(`User activated: ${user.email}`, { userId });
  }

  async deleteUser(userId: number, hardDelete: boolean = false): Promise<void> {
    const user = await this.getUserById(userId);

    if (hardDelete) {
      const deleted = await this.userRepository.hardDelete(userId);
      if (!deleted) {
        throw new AppError('Failed to delete user', 500);
      }
      logger.info(`User hard deleted: ${user.email}`, { userId });
    } else {
      const deleted = await this.userRepository.softDelete(userId);
      if (!deleted) {
        throw new AppError('Failed to delete user', 500);
      }
      logger.info(`User soft deleted: ${user.email}`, { userId });
    }
  }

  async resetPassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.getUserById(userId);

    AuthValidator.validatePassword(newPassword);

    const passwordHash = await CryptoUtils.hashPassword(newPassword);
    const updated = await this.userRepository.updatePassword(userId, passwordHash);

    if (!updated) {
      throw new AppError('Failed to reset password', 500);
    }

    logger.info(`Password reset by admin for user: ${user.email}`, { userId });
  }

  async unlockAccount(userId: number): Promise<void> {
    const user = await this.getUserById(userId);

    await this.userRepository.unlockAccount(userId);
    logger.info(`Account unlocked: ${user.email}`, { userId });
  }

  async verifyEmail(userId: number): Promise<void> {
    const user = await this.getUserById(userId);

    const verified = await this.userRepository.verifyEmail(userId);
    if (!verified) {
      throw new AppError('Failed to verify email', 500);
    }

    logger.info(`Email verified: ${user.email}`, { userId });
  }

  async assignRole(userId: number, roleId: number): Promise<void> {
    const user = await this.getUserById(userId);

    const sql = `
      INSERT IGNORE INTO user_roles (user_id, role_id, is_active)
      VALUES (?, ?, TRUE)
    `;

    try {
      await this.userRepository['execute'](sql, [userId, roleId]);
      logger.info(`Role assigned to user: ${user.email}`, { userId, roleId });
    } catch (error) {
      throw new AppError('Failed to assign role', 500);
    }
  }

  async removeRole(userId: number, roleId: number): Promise<void> {
    const user = await this.getUserById(userId);

    const sql = `
      DELETE FROM user_roles
      WHERE user_id = ? AND role_id = ?
    `;

    try {
      await this.userRepository['execute'](sql, [userId, roleId]);
      logger.info(`Role removed from user: ${user.email}`, { userId, roleId });
    } catch (error) {
      throw new AppError('Failed to remove role', 500);
    }
  }

  async getUserRoles(userId: number): Promise<any[]> {
    const sql = `
      SELECT r.* FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ? AND ur.is_active = TRUE
    `;

    return this.userRepository['query'](sql, [userId]);
  }

  async getUserPermissions(userId: number): Promise<any[]> {
    const sql = `
      SELECT DISTINCT p.* FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ? AND ur.is_active = TRUE
    `;

    return this.userRepository['query'](sql, [userId]);
  }

  private async enrichUsers(users: User[]): Promise<any[]> {
    return Promise.all(
      users.map(async user => ({
        ...user,
        roles: await this.getUserRoles(user.id),
      }))
    );
  }
}
