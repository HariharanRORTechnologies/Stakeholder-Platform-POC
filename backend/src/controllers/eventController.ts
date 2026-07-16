import { Request, Response, NextFunction } from 'express';
import { Pool } from 'mysql2/promise';
import { EventService } from '../services/eventService';
import { ValidationError } from '../errors/AppError';

export class EventController {
  private eventService: EventService;

  constructor(db: Pool) {
    this.eventService = new EventService(db);
  }

  async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

      const filters = {
        status: req.query.status,
        eventType: req.query.eventType,
        departmentId: req.query.departmentId ? parseInt(req.query.departmentId as string) : undefined,
        organizerId: req.query.organizerId ? parseInt(req.query.organizerId as string) : undefined,
        isPublished: req.query.isPublished ? req.query.isPublished === 'true' : undefined,
        searchTerm: req.query.search,
      };

      const userId = (req as any).userId;
      const userRole = (req as any).userRole;

      const result = await this.eventService.getEvents(page, limit, filters, userId, userRole);

      res.json({
        success: true,
        data: result.events,
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

  async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError('Invalid event ID');
      }

      const event = await this.eventService.getEventById(id);

      res.json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));

      const events = await this.eventService.getUpcomingEvents(limit);

      res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;

      const events = await this.eventService.getMyEvents(userId);

      res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { title, description, eventType, startDate, endDate, location, maxCapacity, registrationDeadline, budget, imageUrl, organizerId, departmentId, categoryId } = req.body;

      const event = await this.eventService.createEvent(
        {
          title,
          description,
          eventType,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          location,
          maxCapacity,
          registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
          budget,
          imageUrl,
          organizerId,
          departmentId,
          categoryId,
        },
        userId
      );

      res.status(201).json({
        success: true,
        data: event,
        message: 'Event created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError('Invalid event ID');
      }

      const userId = (req as any).userId;
      const userRole = (req as any).userRole;
      const updates = req.body;

      if (updates.startDate) updates.startDate = new Date(updates.startDate);
      if (updates.endDate) updates.endDate = new Date(updates.endDate);
      if (updates.registrationDeadline) updates.registrationDeadline = new Date(updates.registrationDeadline);

      const event = await this.eventService.updateEvent(id, updates, userId, userRole);

      res.json({
        success: true,
        data: event,
        message: 'Event updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async publishEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError('Invalid event ID');
      }

      const userId = (req as any).userId;
      const userRole = (req as any).userRole;

      const event = await this.eventService.publishEvent(id, userId, userRole);

      res.json({
        success: true,
        data: event,
        message: 'Event published successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async changeEventStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError('Invalid event ID');
      }

      const userId = (req as any).userId;
      const userRole = (req as any).userRole;
      const { status } = req.body;

      const event = await this.eventService.changeEventStatus(id, status, userId, userRole);

      res.json({
        success: true,
        data: event,
        message: 'Event status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError('Invalid event ID');
      }

      const userId = (req as any).userId;
      const userRole = (req as any).userRole;

      await this.eventService.deleteEvent(id, userId, userRole);

      res.json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
