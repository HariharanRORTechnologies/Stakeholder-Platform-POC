import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { RegistrationService } from '../services/registrationService';
import { ValidationError } from '../errors/AppError';

export class RegistrationController {
  private registrationService: RegistrationService;

  constructor(db: Pool) {
    this.registrationService = new RegistrationService(db);
  }

  async getRegistrations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId);
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

      const result = await this.registrationService.getRegistrations(eventId, page, limit);

      res.json({
        success: true,
        data: result.registrations,
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

  async getRegistrationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new ValidationError('Invalid registration ID');

      const registration = await this.registrationService.getRegistrationById(id);

      res.json({
        success: true,
        data: registration,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserRegistrations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const registrations = await this.registrationService.getUserRegistrations(userId);

      res.json({
        success: true,
        data: registrations,
      });
    } catch (error) {
      next(error);
    }
  }

  async registerForEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = (req as any).userId;

      const registration = await this.registrationService.registerForEvent(eventId, userId);

      res.status(201).json({
        success: true,
        data: registration,
        message: 'Successfully registered for event',
      });
    } catch (error) {
      next(error);
    }
  }

  async approveRegistration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).userId;
      const userRole = (req as any).userRole;

      const registration = await this.registrationService.approveRegistration(id, userId, userRole);

      res.json({
        success: true,
        data: registration,
        message: 'Registration approved',
      });
    } catch (error) {
      next(error);
    }
  }

  async checkIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).userId;

      const registration = await this.registrationService.checkIn(id, userId);

      res.json({
        success: true,
        data: registration,
        message: 'Successfully checked in',
      });
    } catch (error) {
      next(error);
    }
  }

  async markAttended(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).userId;

      const registration = await this.registrationService.markAttended(id, userId);

      res.json({
        success: true,
        data: registration,
        message: 'Marked as attended',
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelRegistration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userId = (req as any).userId;
      const userRole = (req as any).userRole;

      const registration = await this.registrationService.cancelRegistration(id, userId, userRole);

      res.json({
        success: true,
        data: registration,
        message: 'Registration cancelled',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId);

      const stats = await this.registrationService.getAttendanceStats(eventId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
