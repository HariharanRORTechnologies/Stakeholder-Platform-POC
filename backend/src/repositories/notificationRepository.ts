import { Pool } from 'mysql2/promise';
import { BaseRepository } from './baseRepository';
import { Notification, NotificationType, NotificationChannel } from '../models/Notification.model';

export class NotificationRepository extends BaseRepository {
  constructor(db: Pool) {
    super(db);
  }

  async findById(id: number): Promise<Notification | null> {
    const sql = 'SELECT * FROM notifications WHERE id = ?';
    const data = await this.queryOne<any>(sql, [id]);
    return data ? this.mapToNotification(data) : null;
  }

  async findByUser(userId: number, page: number = 1, limit: number = 20): Promise<{ notifications: Notification[]; total: number }> {
    const offset = (page - 1) * limit;
    const countSql = 'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?';
    const countResult = await this.queryOne<{ total: number }>(countSql, [userId]);

    const sql = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const data = await this.query<any>(sql, [userId, limit, offset]);

    return {
      notifications: data.map(d => this.mapToNotification(d)),
      total: countResult?.total || 0,
    };
  }

  async findUnread(userId: number): Promise<Notification[]> {
    const sql = `
      SELECT * FROM notifications
      WHERE user_id = ? AND is_read = FALSE
      ORDER BY created_at DESC
    `;
    const data = await this.query<any>(sql, [userId]);
    return data.map(d => this.mapToNotification(d));
  }

  async create(notification: Notification): Promise<number> {
    const sql = `
      INSERT INTO notifications (
        user_id, type, title, message, channel, recipient_address,
        is_read, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      notification.userId,
      notification.type,
      notification.title,
      notification.message,
      notification.channel,
      notification.recipientAddress || null,
      notification.isRead || false,
      notification.metadata ? JSON.stringify(notification.metadata) : null,
    ];

    const result = await this.execute(sql, values);
    return result.insertId;
  }

  async markAsRead(id: number): Promise<boolean> {
    const sql = 'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ?';
    const result = await this.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  async markMultipleAsRead(ids: number[]): Promise<boolean> {
    if (ids.length === 0) return false;
    const placeholders = ids.map(() => '?').join(',');
    const sql = `UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id IN (${placeholders})`;
    const result = await this.execute(sql, ids);
    return result.affectedRows > 0;
  }

  async markAsDelivered(id: number): Promise<boolean> {
    const sql = 'UPDATE notifications SET sent_at = NOW() WHERE id = ?';
    const result = await this.execute(sql, [id]);
    return result.affectedRows > 0;
  }

  async getUnreadCount(userId: number): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE';
    const result = await this.queryOne<{ count: number }>(sql, [userId]);
    return result?.count || 0;
  }

  private mapToNotification(data: any): Notification {
    return new Notification({
      id: data.id,
      userId: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      channel: data.channel,
      recipientAddress: data.recipient_address,
      isRead: Boolean(data.is_read),
      sentAt: data.sent_at,
      readAt: data.read_at,
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}
