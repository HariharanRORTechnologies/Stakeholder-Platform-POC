import { Pool } from 'mysql2/promise';
import { BaseRepository } from './baseRepository';
import { Feedback, FeedbackStatus } from '../models/Feedback.model';

export class FeedbackRepository extends BaseRepository {
  constructor(db: Pool) {
    super(db);
  }

  async findById(id: number): Promise<Feedback | null> {
    const sql = 'SELECT * FROM feedback WHERE id = ? AND deleted_at IS NULL';
    const data = await this.queryOne<any>(sql, [id]);
    return data ? this.mapToFeedback(data) : null;
  }

  async findByEvent(eventId: number, page: number = 1, limit: number = 20): Promise<{ feedback: Feedback[]; total: number }> {
    const offset = (page - 1) * limit;
    const countSql = 'SELECT COUNT(*) as total FROM feedback WHERE event_id = ? AND deleted_at IS NULL';
    const countResult = await this.queryOne<{ total: number }>(countSql, [eventId]);

    const sql = `
      SELECT * FROM feedback
      WHERE event_id = ? AND deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const data = await this.query<any>(sql, [eventId, limit, offset]);

    return {
      feedback: data.map(d => this.mapToFeedback(d)),
      total: countResult?.total || 0,
    };
  }

  async findByUserAndEvent(userId: number, eventId: number): Promise<Feedback | null> {
    const sql = 'SELECT * FROM feedback WHERE user_id = ? AND event_id = ? AND deleted_at IS NULL';
    const data = await this.queryOne<any>(sql, [userId, eventId]);
    return data ? this.mapToFeedback(data) : null;
  }

  async create(feedback: Feedback): Promise<number> {
    const sql = `
      INSERT INTO feedback (
        event_id, user_id, rating, title, content, status, is_anonymous
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      feedback.eventId,
      feedback.userId,
      feedback.rating,
      feedback.title || null,
      feedback.content,
      feedback.status || FeedbackStatus.PENDING,
      feedback.isAnonymous || false,
    ];

    const result = await this.execute(sql, values);
    return result.insertId;
  }

  async update(id: number, updates: Partial<Feedback>): Promise<boolean> {
    const allowedFields = ['rating', 'title', 'content', 'status'];

    const updateFields = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map(key => `${key} = ?`);

    if (updateFields.length === 0) return false;

    const values = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map(key => (updates as any)[key]);

    const sql = `UPDATE feedback SET ${updateFields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    values.push(id);

    const result = await this.execute(sql, values);
    return result.affectedRows > 0;
  }

  async getAverageRating(eventId: number): Promise<number> {
    const sql = 'SELECT AVG(rating) as avg_rating FROM feedback WHERE event_id = ? AND status = ?';
    const result = await this.queryOne<{ avg_rating: number }>(sql, [eventId, FeedbackStatus.SUBMITTED]);
    return result?.avg_rating || 0;
  }

  async softDelete(id: number): Promise<boolean> {
    const sql = 'UPDATE feedback SET deleted_at = NOW() WHERE id = ?';
    const result = await this.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  private mapToFeedback(data: any): Feedback {
    return new Feedback({
      id: data.id,
      eventId: data.event_id,
      userId: data.user_id,
      rating: data.rating,
      title: data.title,
      content: data.content,
      status: data.status,
      isAnonymous: Boolean(data.is_anonymous),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at,
    });
  }
}
