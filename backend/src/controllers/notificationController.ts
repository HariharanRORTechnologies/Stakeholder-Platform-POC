import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { NotificationService } from '../services/notificationService';
import { ValidationError } from '../errors/AppError';

export class NotificationController {
  private notificationService: NotificationService;

  constructor(db: Pool) {
    this.notificationService = new NotificationService(db);
  }

  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

      const result = await this.notificationService.getNotifications(userId, page, limit);

      res.json({
        success: true,
        data: result.notifications,
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

  async getUnreadNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const notifications = await this.notificationService.getUnreadNotifications(userId);

      res.json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const count = await this.notificationService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new ValidationError('Invalid notification ID');

      const notification = await this.notificationService.markAsRead(id);

      res.json({
        success: true,
        data: notification,
        message: 'Notification marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  async markMultipleAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new ValidationError('Invalid notification IDs');
      }

      await this.notificationService.markMultipleAsRead(ids);

      res.json({
        success: true,
        message: 'Notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
}
