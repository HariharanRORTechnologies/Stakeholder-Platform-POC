import { Pool } from 'mysql2/promise';
import { BaseRepository } from './baseRepository';
import { Role } from '../models/Role.model';

export class RoleRepository extends BaseRepository {
  constructor(db: Pool) {
    super(db);
  }

  async findById(id: number): Promise<Role | null> {
    const sql = 'SELECT * FROM roles WHERE id = ?';
    const data = await this.queryOne<any>(sql, [id]);
    return data ? this.mapToRole(data) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const sql = 'SELECT * FROM roles WHERE name = ? AND is_active = TRUE';
    const data = await this.queryOne<any>(sql, [name]);
    return data ? this.mapToRole(data) : null;
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      isActive?: boolean;
      isSystem?: boolean;
      searchTerm?: string;
    }
  ): Promise<{ roles: Role[]; total: number }> {
    let whereClause = 'WHERE 1=1';
    const values: any[] = [];

    if (filters?.isActive !== undefined) {
      whereClause += ' AND is_active = ?';
      values.push(filters.isActive);
    }

    if (filters?.isSystem !== undefined) {
      whereClause += ' AND is_system = ?';
      values.push(filters.isSystem);
    }

    if (filters?.searchTerm) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.searchTerm}%`;
      values.push(searchTerm, searchTerm);
    }

    const countSql = `SELECT COUNT(*) as total FROM roles ${whereClause}`;
    const countResult = await this.queryOne<{ total: number }>(countSql, values);

    const offset = (page - 1) * limit;
    const sql = `
      SELECT * FROM roles
      ${whereClause}
      ORDER BY level ASC, name ASC
      LIMIT ? OFFSET ?
    `;
    const data = await this.query<any>(sql, [...values, limit, offset]);

    return {
      roles: data.map(d => this.mapToRole(d)),
      total: countResult?.total || 0,
    };
  }

  async create(role: Role): Promise<number> {
    const sql = `
      INSERT INTO roles (name, description, level, is_system, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      role.name,
      role.description || null,
      role.level,
      role.isSystem || false,
      role.isActive !== false,
    ];

    const result = await this.execute(sql, values);
    return result.insertId;
  }

  async update(id: number, updates: Partial<Role>): Promise<boolean> {
    const allowedFields = ['name', 'description', 'level', 'is_active'];

    const updateFields = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey) && updates[key as keyof Role] !== undefined;
      })
      .map(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `${dbKey} = ?`;
      });

    if (updateFields.length === 0) return false;

    const values = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey) && updates[key as keyof Role] !== undefined;
      })
      .map(key => (updates as any)[key]);

    const sql = `UPDATE roles SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(id);

    const result = await this.execute(sql, values);
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM roles WHERE id = ? AND is_system = FALSE';
    const result = await this.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  async getPermissions(roleId: number): Promise<any[]> {
    const sql = `
      SELECT p.* FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ? AND p.is_active = TRUE
      ORDER BY p.category, p.name
    `;
    return this.query(sql, [roleId]);
  }

  async addPermission(roleId: number, permissionId: number): Promise<boolean> {
    const sql = 'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)';
    const result = await this.execute(sql, [roleId, permissionId]);
    return result.affectedRows > 0;
  }

  async removePermission(roleId: number, permissionId: number): Promise<boolean> {
    const sql = 'DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?';
    const result = await this.execute(sql, [roleId, permissionId]);
    return result.affectedRows > 0;
  }

  async removeAllPermissions(roleId: number): Promise<boolean> {
    const sql = 'DELETE FROM role_permissions WHERE role_id = ?';
    const result = await this.execute(sql, [roleId]);
    return result.affectedRows > 0;
  }

  async getUserCount(roleId: number): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM user_roles WHERE role_id = ? AND is_active = TRUE';
    const result = await this.queryOne<{ count: number }>(sql, [roleId]);
    return result?.count || 0;
  }

  async canDeleteRole(roleId: number): Promise<boolean> {
    const userCount = await this.getUserCount(roleId);
    return userCount === 0;
  }

  private mapToRole(data: any): Role {
    return new Role({
      id: data.id,
      name: data.name,
      description: data.description,
      level: data.level,
      isSystem: Boolean(data.is_system),
      isActive: Boolean(data.is_active),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}
