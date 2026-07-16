import { Pool } from 'mysql2/promise';
import { BaseRepository } from './baseRepository';
import { User } from '../models/User.model';
import { AuthProvider } from '../types/auth.types';

export class UserRepository extends BaseRepository {
  constructor(db: Pool) {
    super(db);
  }

  async findById(id: number): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL';
    const data = await this.queryOne<any>(sql, [id]);
    return data ? this.mapToUser(data) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL';
    const data = await this.queryOne<any>(sql, [email.toLowerCase()]);
    return data ? this.mapToUser(data) : null;
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      departmentId?: number;
      isActive?: boolean;
      roleId?: number;
    }
  ): Promise<{ users: User[]; total: number }> {
    let whereClause = 'WHERE u.deleted_at IS NULL';
    const values: any[] = [];

    if (filters?.departmentId) {
      whereClause += ' AND u.department_id = ?';
      values.push(filters.departmentId);
    }

    if (filters?.isActive !== undefined) {
      whereClause += ' AND u.is_active = ?';
      values.push(filters.isActive);
    }

    if (filters?.roleId) {
      whereClause += ' AND ur.role_id = ?';
    }

    const countSql = `SELECT COUNT(*) as total FROM users u ${
      filters?.roleId ? 'JOIN user_roles ur ON u.id = ur.user_id' : ''
    } ${whereClause}`;
    const countResult = await this.queryOne<{ total: number }>(countSql, values);

    const offset = (page - 1) * limit;
    const sql = `
      SELECT DISTINCT u.* FROM users u
      ${filters?.roleId ? 'JOIN user_roles ur ON u.id = ur.user_id' : ''}
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const data = await this.query<any>(sql, [...values, limit, offset]);

    return {
      users: data.map(d => this.mapToUser(d)),
      total: countResult?.total || 0,
    };
  }

  async create(user: User): Promise<number> {
    const sql = `
      INSERT INTO users (
        email, first_name, last_name, password_hash, phone_number,
        department_id, auth_provider, is_active, is_email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user.email.toLowerCase(),
      user.firstName,
      user.lastName,
      user.passwordHash,
      user.phoneNumber || null,
      user.departmentId || null,
      user.authProvider || AuthProvider.LOCAL,
      user.isActive !== false,
      false,
    ];

    const result = await this.execute(sql, values);
    return result.insertId;
  }

  async update(id: number, updates: Partial<User>): Promise<boolean> {
    const allowedFields = [
      'first_name',
      'last_name',
      'phone_number',
      'avatar_url',
      'department_id',
      'is_active',
      'is_email_verified',
      'email_verified_at',
      'last_login_at',
      'last_login_ip',
      'failed_login_attempts',
      'locked_until',
      'mfa_enabled',
      'mfa_method',
      'mfa_secret',
    ];

    const updateFields = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey);
      })
      .map(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `${dbKey} = ?`;
      });

    if (updateFields.length === 0) return false;

    const values = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey);
      })
      .map(key => (updates as any)[key]);

    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    values.push(id);

    const result = await this.execute(sql, values);
    return result.affectedRows > 0;
  }

  async updatePassword(id: number, passwordHash: string): Promise<boolean> {
    const sql = 'UPDATE users SET password_hash = ? WHERE id = ? AND deleted_at IS NULL';
    const result = await this.execute(sql, [passwordHash, id]);
    return result.affectedRows > 0;
  }

  async recordLoginAttempt(userId: number, success: boolean, ipAddress?: string): Promise<void> {
    if (success) {
      const sql = `
        UPDATE users
        SET last_login_at = NOW(), last_login_ip = ?, failed_login_attempts = 0
        WHERE id = ?
      `;
      await this.execute(sql, [ipAddress || null, userId]);
    } else {
      const sql = `
        UPDATE users
        SET failed_login_attempts = failed_login_attempts + 1
        WHERE id = ?
      `;
      await this.execute(sql, [userId]);

      const user = await this.findById(userId);
      if (user && user.failedLoginAttempts >= 5) {
        await this.lockAccount(userId);
      }
    }
  }

  async lockAccount(userId: number): Promise<void> {
    const lockDuration = 30 * 60 * 1000;
    const lockedUntil = new Date(Date.now() + lockDuration);
    const sql = 'UPDATE users SET locked_until = ? WHERE id = ?';
    await this.execute(sql, [lockedUntil, userId]);
  }

  async unlockAccount(userId: number): Promise<void> {
    const sql = 'UPDATE users SET locked_until = NULL, failed_login_attempts = 0 WHERE id = ?';
    await this.execute(sql, [userId]);
  }

  async verifyEmail(userId: number): Promise<boolean> {
    const sql = `
      UPDATE users
      SET is_email_verified = TRUE, email_verified_at = NOW()
      WHERE id = ?
    `;
    const result = await this.execute(sql, [userId]);
    return result.affectedRows > 0;
  }

  async softDelete(userId: number): Promise<boolean> {
    const sql = 'UPDATE users SET deleted_at = NOW() WHERE id = ?';
    const result = await this.execute(sql, [userId]);
    return result.affectedRows > 0;
  }

  async hardDelete(userId: number): Promise<boolean> {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await this.execute(sql, [userId]);
    return result.affectedRows > 0;
  }

  private mapToUser(data: any): User {
    return new User({
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      passwordHash: data.password_hash,
      phoneNumber: data.phone_number,
      avatarUrl: data.avatar_url,
      departmentId: data.department_id,
      authProvider: data.auth_provider,
      isActive: Boolean(data.is_active),
      isEmailVerified: Boolean(data.is_email_verified),
      emailVerifiedAt: data.email_verified_at,
      lastLoginAt: data.last_login_at,
      lastLoginIp: data.last_login_ip,
      failedLoginAttempts: data.failed_login_attempts,
      lockedUntil: data.locked_until,
      mfaEnabled: Boolean(data.mfa_enabled),
      mfaMethod: data.mfa_method,
      mfaSecret: data.mfa_secret,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at,
    });
  }
}
