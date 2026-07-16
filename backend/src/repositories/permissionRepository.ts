import { Pool } from 'mysql2/promise';
import { BaseRepository } from './baseRepository';
import { Permission } from '../models/Permission.model';

export class PermissionRepository extends BaseRepository {
  constructor(db: Pool) {
    super(db);
  }

  async findById(id: number): Promise<Permission | null> {
    const sql = 'SELECT * FROM permissions WHERE id = ?';
    const data = await this.queryOne<any>(sql, [id]);
    return data ? this.mapToPermission(data) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const sql = 'SELECT * FROM permissions WHERE name = ? AND is_active = TRUE';
    const data = await this.queryOne<any>(sql, [name]);
    return data ? this.mapToPermission(data) : null;
  }

  async findAll(
    page: number = 1,
    limit: number = 50,
    filters?: {
      isActive?: boolean;
      category?: string;
      searchTerm?: string;
    }
  ): Promise<{ permissions: Permission[]; total: number }> {
    let whereClause = 'WHERE 1=1';
    const values: any[] = [];

    if (filters?.isActive !== undefined) {
      whereClause += ' AND is_active = ?';
      values.push(filters.isActive);
    }

    if (filters?.category) {
      whereClause += ' AND category = ?';
      values.push(filters.category);
    }

    if (filters?.searchTerm) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.searchTerm}%`;
      values.push(searchTerm, searchTerm);
    }

    const countSql = `SELECT COUNT(*) as total FROM permissions ${whereClause}`;
    const countResult = await this.queryOne<{ total: number }>(countSql, values);

    const offset = (page - 1) * limit;
    const sql = `
      SELECT * FROM permissions
      ${whereClause}
      ORDER BY category ASC, name ASC
      LIMIT ? OFFSET ?
    `;
    const data = await this.query<any>(sql, [...values, limit, offset]);

    return {
      permissions: data.map(d => this.mapToPermission(d)),
      total: countResult?.total || 0,
    };
  }

  async findByCategory(category: string): Promise<Permission[]> {
    const sql = 'SELECT * FROM permissions WHERE category = ? AND is_active = TRUE ORDER BY name';
    const data = await this.query<any>(sql, [category]);
    return data.map(d => this.mapToPermission(d));
  }

  async findByRole(roleId: number): Promise<Permission[]> {
    const sql = `
      SELECT p.* FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ? AND p.is_active = TRUE
      ORDER BY p.category, p.name
    `;
    const data = await this.query<any>(sql, [roleId]);
    return data.map(d => this.mapToPermission(d));
  }

  async create(permission: Permission): Promise<number> {
    const sql = `
      INSERT INTO permissions (name, description, category, is_active)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      permission.name,
      permission.description || null,
      permission.category,
      permission.isActive !== false,
    ];

    const result = await this.execute(sql, values);
    return result.insertId;
  }

  async update(id: number, updates: Partial<Permission>): Promise<boolean> {
    const allowedFields = ['name', 'description', 'category', 'is_active'];

    const updateFields = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey) && updates[key as keyof Permission] !== undefined;
      })
      .map(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `${dbKey} = ?`;
      });

    if (updateFields.length === 0) return false;

    const values = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey) && updates[key as keyof Permission] !== undefined;
      })
      .map(key => (updates as any)[key]);

    const sql = `UPDATE permissions SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(id);

    const result = await this.execute(sql, values);
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM permissions WHERE id = ?';
    const result = await this.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  async getRoleCount(permissionId: number): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM role_permissions WHERE permission_id = ?';
    const result = await this.queryOne<{ count: number }>(sql, [permissionId]);
    return result?.count || 0;
  }

  async canDeletePermission(permissionId: number): Promise<boolean> {
    const roleCount = await this.getRoleCount(permissionId);
    return roleCount === 0;
  }

  async getCategories(): Promise<string[]> {
    const sql = 'SELECT DISTINCT category FROM permissions WHERE is_active = TRUE ORDER BY category';
    const data = await this.query<any>(sql, []);
    return data.map(d => d.category);
  }

  async getPermissionsByCategory(category: string): Promise<Permission[]> {
    const sql = 'SELECT * FROM permissions WHERE category = ? AND is_active = TRUE ORDER BY name';
    const data = await this.query<any>(sql, [category]);
    return data.map(d => this.mapToPermission(d));
  }

  async bulkCreate(permissions: Permission[]): Promise<number[]> {
    const ids: number[] = [];
    for (const permission of permissions) {
      const id = await this.create(permission);
      ids.push(id);
    }
    return ids;
  }

  private mapToPermission(data: any): Permission {
    return new Permission({
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      isActive: Boolean(data.is_active),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}
