import { Pool } from 'mysql2/promise';
import { BaseRepository } from './baseRepository';
import { Event, EventStatus } from '../models/Event.model';

export class EventRepository extends BaseRepository {
  constructor(db: Pool) {
    super(db);
  }

  async findById(id: number): Promise<Event | null> {
    const sql = 'SELECT * FROM events WHERE id = ? AND deleted_at IS NULL';
    const data = await this.queryOne<any>(sql, [id]);
    return data ? this.mapToEvent(data) : null;
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: EventStatus;
      eventType?: string;
      departmentId?: number;
      organizerId?: number;
      isPublished?: boolean;
      searchTerm?: string;
    }
  ): Promise<{ events: Event[]; total: number }> {
    let whereClause = 'WHERE e.deleted_at IS NULL';
    const values: any[] = [];

    if (filters?.status) {
      whereClause += ' AND e.status = ?';
      values.push(filters.status);
    }

    if (filters?.eventType) {
      whereClause += ' AND e.event_type = ?';
      values.push(filters.eventType);
    }

    if (filters?.departmentId) {
      whereClause += ' AND e.department_id = ?';
      values.push(filters.departmentId);
    }

    if (filters?.organizerId) {
      whereClause += ' AND e.organizer_id = ?';
      values.push(filters.organizerId);
    }

    if (filters?.isPublished !== undefined) {
      whereClause += ' AND e.is_published = ?';
      values.push(filters.isPublished);
    }

    if (filters?.searchTerm) {
      whereClause += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      const searchTerm = `%${filters.searchTerm}%`;
      values.push(searchTerm, searchTerm);
    }

    const countSql = `SELECT COUNT(*) as total FROM events e ${whereClause}`;
    const countResult = await this.queryOne<{ total: number }>(countSql, values);

    const offset = (page - 1) * limit;
    const sql = `
      SELECT e.* FROM events e
      ${whereClause}
      ORDER BY e.start_date DESC
      LIMIT ? OFFSET ?
    `;
    const data = await this.query<any>(sql, [...values, limit, offset]);

    return {
      events: data.map(d => this.mapToEvent(d)),
      total: countResult?.total || 0,
    };
  }

  async findUpcoming(limit: number = 10): Promise<Event[]> {
    const sql = `
      SELECT * FROM events
      WHERE deleted_at IS NULL AND status = ? AND start_date > NOW()
      ORDER BY start_date ASC
      LIMIT ?
    `;
    const data = await this.query<any>(sql, [EventStatus.PUBLISHED, limit]);
    return data.map(d => this.mapToEvent(d));
  }

  async findByOrganizer(organizerId: number): Promise<Event[]> {
    const sql = `
      SELECT * FROM events
      WHERE organizer_id = ? AND deleted_at IS NULL
      ORDER BY start_date DESC
    `;
    const data = await this.query<any>(sql, [organizerId]);
    return data.map(d => this.mapToEvent(d));
  }

  async create(event: Event): Promise<number> {
    const sql = `
      INSERT INTO events (
        title, description, event_type, status, start_date, end_date,
        location, max_capacity, registration_deadline, organizer_id,
        department_id, category_id, budget, image_url, created_by, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      event.title,
      event.description || null,
      event.eventType,
      event.status || EventStatus.DRAFT,
      event.startDate,
      event.endDate,
      event.location || null,
      event.maxCapacity,
      event.registrationDeadline || null,
      event.organizerId,
      event.departmentId || null,
      event.categoryId || null,
      event.budget || null,
      event.imageUrl || null,
      event.createdBy,
      event.isPublished || false,
    ];

    const result = await this.execute(sql, values);
    return result.insertId;
  }

  async update(id: number, updates: Partial<Event>): Promise<boolean> {
    const allowedFields = [
      'title',
      'description',
      'event_type',
      'status',
      'start_date',
      'end_date',
      'location',
      'max_capacity',
      'registration_deadline',
      'budget',
      'image_url',
      'is_published',
      'approved_by',
    ];

    const updateFields = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey) && updates[key as keyof Event] !== undefined;
      })
      .map(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `${dbKey} = ?`;
      });

    if (updateFields.length === 0) return false;

    const values = Object.keys(updates)
      .filter(key => {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        return allowedFields.includes(dbKey) && updates[key as keyof Event] !== undefined;
      })
      .map(key => (updates as any)[key]);

    const sql = `UPDATE events SET ${updateFields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    values.push(id);

    const result = await this.execute(sql, values);
    return result.affectedRows > 0;
  }

  async changeStatus(id: number, status: EventStatus): Promise<boolean> {
    const sql = 'UPDATE events SET status = ? WHERE id = ? AND deleted_at IS NULL';
    const result = await this.execute(sql, [status, id]);
    return result.affectedRows > 0;
  }

  async publish(id: number, approvedBy: number): Promise<boolean> {
    const sql = `
      UPDATE events
      SET status = ?, is_published = TRUE, approved_by = ?
      WHERE id = ? AND deleted_at IS NULL
    `;
    const result = await this.execute(sql, [EventStatus.PUBLISHED, approvedBy, id]);
    return result.affectedRows > 0;
  }

  async softDelete(id: number): Promise<boolean> {
    const sql = 'UPDATE events SET deleted_at = NOW() WHERE id = ?';
    const result = await this.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  async getRegistrationCount(eventId: number): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status != ?';
    const result = await this.queryOne<{ count: number }>(sql, [eventId, 'cancelled']);
    return result?.count || 0;
  }

  private mapToEvent(data: any): Event {
    return new Event({
      id: data.id,
      title: data.title,
      description: data.description,
      eventType: data.event_type,
      status: data.status,
      startDate: data.start_date,
      endDate: data.end_date,
      location: data.location,
      maxCapacity: data.max_capacity,
      registrationDeadline: data.registration_deadline,
      organizerId: data.organizer_id,
      departmentId: data.department_id,
      categoryId: data.category_id,
      budget: data.budget,
      imageUrl: data.image_url,
      createdBy: data.created_by,
      approvedBy: data.approved_by,
      isPublished: Boolean(data.is_published),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at,
    });
  }
}
