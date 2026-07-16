import { Pool } from 'mysql2/promise';
import { BaseRepository } from './baseRepository';
import { Registration, RegistrationStatus, Attendance } from '../models/Registration.model';

export class RegistrationRepository extends BaseRepository {
  constructor(db: Pool) {
    super(db);
  }

  async findById(id: number): Promise<Registration | null> {
    const sql = 'SELECT * FROM registrations WHERE id = ? AND deleted_at IS NULL';
    const data = await this.queryOne<any>(sql, [id]);
    return data ? this.mapToRegistration(data) : null;
  }

  async findByEventAndUser(eventId: number, userId: number): Promise<Registration | null> {
    const sql = 'SELECT * FROM registrations WHERE event_id = ? AND user_id = ? AND deleted_at IS NULL';
    const data = await this.queryOne<any>(sql, [eventId, userId]);
    return data ? this.mapToRegistration(data) : null;
  }

  async findByEvent(eventId: number, page: number = 1, limit: number = 20): Promise<{ registrations: Registration[]; total: number }> {
    const offset = (page - 1) * limit;
    const countSql = 'SELECT COUNT(*) as total FROM registrations WHERE event_id = ? AND deleted_at IS NULL';
    const countResult = await this.queryOne<{ total: number }>(countSql, [eventId]);

    const sql = `
      SELECT r.* FROM registrations r
      WHERE r.event_id = ? AND r.deleted_at IS NULL
      ORDER BY r.registration_date DESC
      LIMIT ? OFFSET ?
    `;
    const data = await this.query<any>(sql, [eventId, limit, offset]);

    return {
      registrations: data.map(d => this.mapToRegistration(d)),
      total: countResult?.total || 0,
    };
  }

  async findByUser(userId: number): Promise<Registration[]> {
    const sql = `
      SELECT * FROM registrations
      WHERE user_id = ? AND deleted_at IS NULL
      ORDER BY registration_date DESC
    `;
    const data = await this.query<any>(sql, [userId]);
    return data.map(d => this.mapToRegistration(d));
  }

  async findByStatus(eventId: number, status: RegistrationStatus): Promise<Registration[]> {
    const sql = `
      SELECT * FROM registrations
      WHERE event_id = ? AND status = ? AND deleted_at IS NULL
    `;
    const data = await this.query<any>(sql, [eventId, status]);
    return data.map(d => this.mapToRegistration(d));
  }

  async create(registration: Registration): Promise<number> {
    const sql = `
      INSERT INTO registrations (
        event_id, user_id, status, registration_date, notes
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      registration.eventId,
      registration.userId,
      registration.status || RegistrationStatus.PENDING,
      registration.registrationDate,
      registration.notes || null,
    ];

    const result = await this.execute(sql, values);
    return result.insertId;
  }

  async update(id: number, updates: Partial<Registration>): Promise<boolean> {
    const allowedFields = ['status', 'approved_by', 'checked_in_at', 'attended_at', 'notes'];

    const updateFields = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey) && updates[key as keyof Registration] !== undefined;
      })
      .map(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `${dbKey} = ?`;
      });

    if (updateFields.length === 0) return false;

    const values = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey) && updates[key as keyof Registration] !== undefined;
      })
      .map(key => (updates as any)[key]);

    const sql = `UPDATE registrations SET ${updateFields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    values.push(id);

    const result = await this.execute(sql, values);
    return result.affectedRows > 0;
  }

  async changeStatus(id: number, status: RegistrationStatus): Promise<boolean> {
    const sql = 'UPDATE registrations SET status = ? WHERE id = ? AND deleted_at IS NULL';
    const result = await this.execute(sql, [status, id]);
    return result.affectedRows > 0;
  }

  async getCountByStatus(eventId: number, status: RegistrationStatus): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status = ? AND deleted_at IS NULL';
    const result = await this.queryOne<{ count: number }>(sql, [eventId, status]);
    return result?.count || 0;
  }

  async softDelete(id: number): Promise<boolean> {
    const sql = 'UPDATE registrations SET deleted_at = NOW() WHERE id = ?';
    const result = await this.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  async getAttendanceRecord(registrationId: number): Promise<Attendance | null> {
    const sql = 'SELECT * FROM attendance WHERE registration_id = ?';
    const data = await this.queryOne<any>(sql, [registrationId]);
    return data ? this.mapToAttendance(data) : null;
  }

  async recordCheckIn(registrationId: number): Promise<number> {
    const sql = `
      INSERT INTO attendance (registration_id, event_id, user_id, checked_in_at)
      SELECT r.id, r.event_id, r.user_id, NOW()
      FROM registrations r WHERE r.id = ?
    `;
    const result = await this.execute(sql, [registrationId]);
    return result.insertId;
  }

  private mapToRegistration(data: any): Registration {
    return new Registration({
      id: data.id,
      eventId: data.event_id,
      userId: data.user_id,
      status: data.status,
      registrationDate: data.registration_date,
      approvedBy: data.approved_by,
      checkedInAt: data.checked_in_at,
      attendedAt: data.attended_at,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at,
    });
  }

  private mapToAttendance(data: any): Attendance {
    return new Attendance({
      id: data.id,
      registrationId: data.registration_id,
      eventId: data.event_id,
      userId: data.user_id,
      checkedInAt: data.checked_in_at,
      checkedOutAt: data.checked_out_at,
      duration: data.duration,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}
