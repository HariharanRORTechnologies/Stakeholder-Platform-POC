import { Pool } from 'mysql2/promise';
import { BaseRepository } from './baseRepository';
import { Certificate } from '../models/Feedback.model';

export class CertificateRepository extends BaseRepository {
  constructor(db: Pool) {
    super(db);
  }

  async findById(id: number): Promise<Certificate | null> {
    const sql = 'SELECT * FROM certificates WHERE id = ?';
    const data = await this.queryOne<any>(sql, [id]);
    return data ? this.mapToCertificate(data) : null;
  }

  async findByEventAndUser(eventId: number, userId: number): Promise<Certificate | null> {
    const sql = 'SELECT * FROM certificates WHERE event_id = ? AND user_id = ?';
    const data = await this.queryOne<any>(sql, [eventId, userId]);
    return data ? this.mapToCertificate(data) : null;
  }

  async findByUser(userId: number): Promise<Certificate[]> {
    const sql = 'SELECT * FROM certificates WHERE user_id = ? ORDER BY issued_date DESC';
    const data = await this.query<any>(sql, [userId]);
    return data.map(d => this.mapToCertificate(d));
  }

  async findByEvent(eventId: number, page: number = 1, limit: number = 20): Promise<{ certificates: Certificate[]; total: number }> {
    const offset = (page - 1) * limit;
    const countSql = 'SELECT COUNT(*) as total FROM certificates WHERE event_id = ?';
    const countResult = await this.queryOne<{ total: number }>(countSql, [eventId]);

    const sql = `
      SELECT * FROM certificates
      WHERE event_id = ?
      ORDER BY issued_date DESC
      LIMIT ? OFFSET ?
    `;
    const data = await this.query<any>(sql, [eventId, limit, offset]);

    return {
      certificates: data.map(d => this.mapToCertificate(d)),
      total: countResult?.total || 0,
    };
  }

  async create(certificate: Certificate): Promise<number> {
    const sql = `
      INSERT INTO certificates (
        event_id, user_id, title, description, template_url,
        certificate_url, issued_date, verification_code, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      certificate.eventId,
      certificate.userId,
      certificate.title,
      certificate.description || null,
      certificate.templateUrl || null,
      certificate.certificateUrl || null,
      certificate.issuedDate,
      certificate.verificationCode,
      certificate.isVerified || false,
    ];

    const result = await this.execute(sql, values);
    return result.insertId;
  }

  async update(id: number, updates: Partial<Certificate>): Promise<boolean> {
    const allowedFields = ['certificate_url', 'is_verified'];

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

    const sql = `UPDATE certificates SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(id);

    const result = await this.execute(sql, values);
    return result.affectedRows > 0;
  }

  async verify(verificationCode: string): Promise<Certificate | null> {
    const sql = 'SELECT * FROM certificates WHERE verification_code = ?';
    const data = await this.queryOne<any>(sql, [verificationCode]);
    return data ? this.mapToCertificate(data) : null;
  }

  private mapToCertificate(data: any): Certificate {
    return new Certificate({
      id: data.id,
      eventId: data.event_id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      templateUrl: data.template_url,
      certificateUrl: data.certificate_url,
      issuedDate: data.issued_date,
      verificationCode: data.verification_code,
      isVerified: Boolean(data.is_verified),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}
