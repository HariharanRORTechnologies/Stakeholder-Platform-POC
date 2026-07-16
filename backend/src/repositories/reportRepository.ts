import { Pool } from 'mysql2/promise';
import { BaseRepository } from './baseRepository';
import { Report, ReportType } from '../models/Report.model';

export class ReportRepository extends BaseRepository {
  constructor(db: Pool) {
    super(db);
  }

  async findById(id: number): Promise<Report | null> {
    const sql = 'SELECT * FROM reports WHERE id = ?';
    const data = await this.queryOne<any>(sql, [id]);
    return data ? this.mapToReport(data) : null;
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ reports: Report[]; total: number }> {
    const offset = (page - 1) * limit;
    const countSql = 'SELECT COUNT(*) as total FROM reports';
    const countResult = await this.queryOne<{ total: number }>(countSql, []);

    const sql = `
      SELECT * FROM reports
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const data = await this.query<any>(sql, [limit, offset]);

    return {
      reports: data.map(d => this.mapToReport(d)),
      total: countResult?.total || 0,
    };
  }

  async findByType(type: ReportType): Promise<Report[]> {
    const sql = 'SELECT * FROM reports WHERE type = ? ORDER BY created_at DESC';
    const data = await this.query<any>(sql, [type]);
    return data.map(d => this.mapToReport(d));
  }

  async findByGeneratedBy(userId: number): Promise<Report[]> {
    const sql = 'SELECT * FROM reports WHERE generated_by = ? ORDER BY created_at DESC';
    const data = await this.query<any>(sql, [userId]);
    return data.map(d => this.mapToReport(d));
  }

  async create(report: Report): Promise<number> {
    const sql = `
      INSERT INTO reports (
        title, type, description, generated_by, start_date, end_date,
        event_ids, filters, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      report.title,
      report.type,
      report.description || null,
      report.generatedBy,
      report.startDate,
      report.endDate,
      report.eventIds ? JSON.stringify(report.eventIds) : null,
      report.filters ? JSON.stringify(report.filters) : null,
      report.status || 'pending',
    ];

    const result = await this.execute(sql, values);
    return result.insertId;
  }

  async update(id: number, updates: Partial<Report>): Promise<boolean> {
    const allowedFields = ['title', 'description', 'data', 'file_url', 'status'];

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
      .map(key => {
        const val = (updates as any)[key];
        return typeof val === 'object' ? JSON.stringify(val) : val;
      });

    const sql = `UPDATE reports SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(id);

    const result = await this.execute(sql, values);
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM reports WHERE id = ?';
    const result = await this.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  private mapToReport(data: any): Report {
    return new Report({
      id: data.id,
      title: data.title,
      type: data.type,
      description: data.description,
      generatedBy: data.generated_by,
      startDate: data.start_date,
      endDate: data.end_date,
      eventIds: data.event_ids ? JSON.parse(data.event_ids) : undefined,
      filters: data.filters ? JSON.parse(data.filters) : undefined,
      data: data.data ? JSON.parse(data.data) : undefined,
      fileUrl: data.file_url,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}
