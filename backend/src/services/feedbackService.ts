import { Pool } from 'mysql2/promise';
import { FeedbackRepository } from '../repositories/feedbackRepository';
import { CertificateRepository } from '../repositories/certificateRepository';
import { EventRepository } from '../repositories/eventRepository';
import { Feedback, FeedbackStatus, Certificate } from '../models/Feedback.model';
import { ValidationError, NotFoundError, AuthorizationError } from '../errors/AppError';
import { auditLog } from '../utils/auditLog';
import crypto from 'crypto';

export class FeedbackService {
  private feedbackRepository: FeedbackRepository;
  private certificateRepository: CertificateRepository;
  private eventRepository: EventRepository;

  constructor(db: Pool) {
    this.feedbackRepository = new FeedbackRepository(db);
    this.certificateRepository = new CertificateRepository(db);
    this.eventRepository = new EventRepository(db);
  }

  async getFeedback(eventId: number, page: number = 1, limit: number = 20): Promise<{ feedback: Feedback[]; total: number }> {
    return this.feedbackRepository.findByEvent(eventId, page, limit);
  }

  async getFeedbackById(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findById(id);
    if (!feedback) {
      throw new NotFoundError('Feedback not found');
    }
    return feedback;
  }

  async submitFeedback(
    eventId: number,
    userId: number,
    rating: number,
    content: string,
    title?: string,
    isAnonymous: boolean = false
  ): Promise<Feedback> {
    if (rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5');
    }

    if (!content.trim()) {
      throw new ValidationError('Feedback content is required');
    }

    const existing = await this.feedbackRepository.findByUserAndEvent(userId, eventId);
    if (existing) {
      throw new ValidationError('You have already submitted feedback for this event');
    }

    const feedback = new Feedback({
      eventId,
      userId,
      rating,
      title,
      content,
      status: FeedbackStatus.SUBMITTED,
      isAnonymous,
    });

    const feedbackId = await this.feedbackRepository.create(feedback);

    await auditLog.log({
      userId,
      action: 'feedback.submitted',
      resourceType: 'feedback',
      resourceId: feedbackId,
      details: { eventId, rating },
    });

    return this.getFeedbackById(feedbackId);
  }

  async issueCertificate(
    eventId: number,
    userId: number,
    title: string,
    description?: string
  ): Promise<Certificate> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const verificationCode = crypto.randomBytes(16).toString('hex');

    const certificate = new Certificate({
      eventId,
      userId,
      title,
      description,
      verificationCode,
      issuedDate: new Date(),
      isVerified: false,
    });

    const certificateId = await this.certificateRepository.create(certificate);

    await auditLog.log({
      userId,
      action: 'certificate.issued',
      resourceType: 'certificate',
      resourceId: certificateId,
      details: { eventId },
    });

    return this.getCertificateById(certificateId);
  }

  async getCertificate(id: number): Promise<Certificate> {
    const certificate = await this.certificateRepository.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }
    return certificate;
  }

  async getCertificateById(id: number): Promise<Certificate> {
    return this.getCertificate(id);
  }

  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return this.certificateRepository.findByUser(userId);
  }

  async verifyCertificate(verificationCode: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.verify(verificationCode);
    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }
    return certificate;
  }

  async getEventFeedbackStats(eventId: number): Promise<{
    totalResponses: number;
    averageRating: number;
    totalCertificatesIssued: number;
  }> {
    const { total } = await this.feedbackRepository.findByEvent(eventId, 1, 1);
    const averageRating = await this.feedbackRepository.getAverageRating(eventId);
    const { total: certCount } = await this.certificateRepository.findByEvent(eventId, 1, 1);

    return {
      totalResponses: total,
      averageRating,
      totalCertificatesIssued: certCount,
    };
  }
}
