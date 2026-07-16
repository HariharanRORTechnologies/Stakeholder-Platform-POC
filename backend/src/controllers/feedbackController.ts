import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { FeedbackService } from '../services/feedbackService';
import { ValidationError } from '../errors/AppError';

export class FeedbackController {
  private feedbackService: FeedbackService;

  constructor(db: Pool) {
    this.feedbackService = new FeedbackService(db);
  }

  async getFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId);
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

      const result = await this.feedbackService.getFeedback(eventId, page, limit);

      res.json({
        success: true,
        data: result.feedback,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async submitFeedback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = (req as any).userId;
      const { rating, title, content, isAnonymous } = req.body;

      const feedback = await this.feedbackService.submitFeedback(
        eventId,
        userId,
        rating,
        content,
        title,
        isAnonymous
      );

      res.status(201).json({
        success: true,
        data: feedback,
        message: 'Feedback submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async issueCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = parseInt(req.params.userId);
      const { title, description } = req.body;

      const certificate = await this.feedbackService.issueCertificate(
        eventId,
        userId,
        title,
        description
      );

      res.status(201).json({
        success: true,
        data: certificate,
        message: 'Certificate issued successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserCertificates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const certificates = await this.feedbackService.getUserCertificates(userId);

      res.json({
        success: true,
        data: certificates,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyCertificate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.params;
      if (!code) throw new ValidationError('Verification code is required');

      const certificate = await this.feedbackService.verifyCertificate(code);

      res.json({
        success: true,
        data: certificate,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeedbackStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId);

      const stats = await this.feedbackService.getEventFeedbackStats(eventId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
