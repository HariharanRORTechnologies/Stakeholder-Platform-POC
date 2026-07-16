import { Pool } from 'mysql2/promise';
import { EventRepository } from '../repositories/eventRepository';
import { Event, EventStatus, EventType } from '../models/Event.model';
import { ValidationError, NotFoundError, AuthorizationError } from '../errors/AppError';
import { auditLog } from '../utils/auditLog';

export class EventService {
  private eventRepository: EventRepository;

  constructor(db: Pool) {
    this.eventRepository = new EventRepository(db);
  }

  async getEvents(
    page: number,
    limit: number,
    filters: any,
    userId: number,
    userRole: string
  ): Promise<{ events: Event[]; total: number }> {
    return this.eventRepository.findAll(page, limit, filters);
  }

  async getEventById(id: number): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    return event;
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    return this.eventRepository.findUpcoming(limit);
  }

  async getMyEvents(organizerId: number): Promise<Event[]> {
    return this.eventRepository.findByOrganizer(organizerId);
  }

  async createEvent(
    data: {
      title: string;
      description?: string;
      eventType: EventType | string;
      startDate: Date;
      endDate: Date;
      location?: string;
      maxCapacity: number;
      registrationDeadline?: Date;
      organizerId: number;
      departmentId?: number;
      categoryId?: number;
      budget?: number;
      imageUrl?: string;
    },
    userId: number
  ): Promise<Event> {
    this.validateEventData(data);

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      throw new ValidationError('Event end date must be after start date');
    }

    if (data.registrationDeadline && new Date(data.registrationDeadline) > new Date(data.startDate)) {
      throw new ValidationError('Registration deadline must be before event start date');
    }

    const event = new Event({
      ...data,
      status: EventStatus.DRAFT,
      isPublished: false,
      createdBy: userId,
    });

    const eventId = await this.eventRepository.create(event);

    await auditLog.log({
      userId,
      action: 'event.created',
      resourceType: 'event',
      resourceId: eventId,
      details: { title: data.title },
    });

    return this.getEventById(eventId);
  }

  async updateEvent(
    id: number,
    data: Partial<Event>,
    userId: number,
    userRole: string
  ): Promise<Event> {
    const event = await this.getEventById(id);

    if (event.createdBy !== userId && userRole !== 'admin') {
      throw new AuthorizationError('Only event organizer can update event');
    }

    if (!event.canBeModified() && userRole !== 'admin') {
      throw new ValidationError('Can only modify draft events');
    }

    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw new ValidationError('Event end date must be after start date');
      }
    }

    await this.eventRepository.update(id, data);

    await auditLog.log({
      userId,
      action: 'event.updated',
      resourceType: 'event',
      resourceId: id,
      details: data,
    });

    return this.getEventById(id);
  }

  async publishEvent(id: number, userId: number, userRole: string): Promise<Event> {
    const event = await this.getEventById(id);

    if (userRole !== 'admin' && userRole !== 'manager') {
      throw new AuthorizationError('Only admins can publish events');
    }

    await this.eventRepository.publish(id, userId);

    await auditLog.log({
      userId,
      action: 'event.published',
      resourceType: 'event',
      resourceId: id,
    });

    return this.getEventById(id);
  }

  async changeEventStatus(
    id: number,
    status: EventStatus,
    userId: number,
    userRole: string
  ): Promise<Event> {
    const event = await this.getEventById(id);

    if (event.createdBy !== userId && userRole !== 'admin') {
      throw new AuthorizationError('Only event organizer can change status');
    }

    await this.eventRepository.changeStatus(id, status);

    await auditLog.log({
      userId,
      action: 'event.status_changed',
      resourceType: 'event',
      resourceId: id,
      details: { status },
    });

    return this.getEventById(id);
  }

  async deleteEvent(id: number, userId: number, userRole: string): Promise<void> {
    const event = await this.getEventById(id);

    if (event.createdBy !== userId && userRole !== 'admin') {
      throw new AuthorizationError('Only event organizer can delete event');
    }

    const registrationCount = await this.eventRepository.getRegistrationCount(id);
    if (registrationCount > 0 && userRole !== 'admin') {
      throw new ValidationError('Cannot delete event with existing registrations');
    }

    await this.eventRepository.softDelete(id);

    await auditLog.log({
      userId,
      action: 'event.deleted',
      resourceType: 'event',
      resourceId: id,
    });
  }

  private validateEventData(data: any): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationError('Event title is required');
    }

    if (data.title.length > 255) {
      throw new ValidationError('Event title must be less than 255 characters');
    }

    if (!data.startDate || !data.endDate) {
      throw new ValidationError('Event dates are required');
    }

    if (!data.maxCapacity || data.maxCapacity <= 0) {
      throw new ValidationError('Event capacity must be greater than 0');
    }

    const validEventTypes = Object.values(EventType);
    if (!validEventTypes.includes(data.eventType)) {
      throw new ValidationError('Invalid event type');
    }
  }
}
