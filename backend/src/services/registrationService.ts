import { Pool } from 'mysql2/promise';
import { RegistrationRepository } from '../repositories/registrationRepository';
import { EventRepository } from '../repositories/eventRepository';
import { Registration, RegistrationStatus } from '../models/Registration.model';
import { ValidationError, NotFoundError, AuthorizationError } from '../errors/AppError';
import { auditLog } from '../utils/auditLog';

export class RegistrationService {
  private registrationRepository: RegistrationRepository;
  private eventRepository: EventRepository;

  constructor(db: Pool) {
    this.registrationRepository = new RegistrationRepository(db);
    this.eventRepository = new EventRepository(db);
  }

  async getRegistrations(eventId: number, page: number = 1, limit: number = 20): Promise<{ registrations: Registration[]; total: number }> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    return this.registrationRepository.findByEvent(eventId, page, limit);
  }

  async getRegistrationById(id: number): Promise<Registration> {
    const registration = await this.registrationRepository.findById(id);
    if (!registration) {
      throw new NotFoundError('Registration not found');
    }
    return registration;
  }

  async getUserRegistrations(userId: number): Promise<Registration[]> {
    return this.registrationRepository.findByUser(userId);
  }

  async registerForEvent(eventId: number, userId: number): Promise<Registration> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (!event.isRegistrationOpen()) {
      throw new ValidationError('Event registration is closed');
    }

    const existing = await this.registrationRepository.findByEventAndUser(eventId, userId);
    if (existing) {
      throw new ValidationError('Already registered for this event');
    }

    const registrationCount = await this.eventRepository.getRegistrationCount(eventId);
    if (!event.hasCapacityAvailable(registrationCount)) {
      throw new ValidationError('Event is at full capacity. You have been added to waitlist');
    }

    const registration = new Registration({
      eventId,
      userId,
      status: RegistrationStatus.PENDING,
      registrationDate: new Date(),
    });

    const registrationId = await this.registrationRepository.create(registration);

    await auditLog.log({
      userId,
      action: 'registration.created',
      resourceType: 'registration',
      resourceId: registrationId,
      details: { eventId },
    });

    return this.getRegistrationById(registrationId);
  }

  async approveRegistration(id: number, userId: number, userRole: string): Promise<Registration> {
    if (userRole !== 'admin' && userRole !== 'manager') {
      throw new AuthorizationError('Only admins can approve registrations');
    }

    const registration = await this.getRegistrationById(id);

    await this.registrationRepository.update(id, {
      status: RegistrationStatus.CONFIRMED,
      approvedBy: userId,
    });

    await auditLog.log({
      userId,
      action: 'registration.approved',
      resourceType: 'registration',
      resourceId: id,
    });

    return this.getRegistrationById(id);
  }

  async checkIn(id: number, userId: number): Promise<Registration> {
    const registration = await this.getRegistrationById(id);

    if (registration.status !== RegistrationStatus.CONFIRMED && registration.status !== RegistrationStatus.PENDING) {
      throw new ValidationError('Can only check in confirmed or pending registrations');
    }

    await this.registrationRepository.update(id, {
      status: RegistrationStatus.CHECKED_IN,
      checkedInAt: new Date(),
    });

    await auditLog.log({
      userId,
      action: 'registration.checked_in',
      resourceType: 'registration',
      resourceId: id,
    });

    return this.getRegistrationById(id);
  }

  async markAttended(id: number, userId: number): Promise<Registration> {
    const registration = await this.getRegistrationById(id);

    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new ValidationError('Cannot mark cancelled registration as attended');
    }

    await this.registrationRepository.update(id, {
      status: RegistrationStatus.ATTENDED,
      attendedAt: new Date(),
    });

    await auditLog.log({
      userId,
      action: 'registration.attended',
      resourceType: 'registration',
      resourceId: id,
    });

    return this.getRegistrationById(id);
  }

  async cancelRegistration(id: number, userId: number, userRole: string): Promise<Registration> {
    const registration = await this.getRegistrationById(id);

    if (!registration.canBeCancelled()) {
      throw new ValidationError('Cannot cancel this registration');
    }

    if (registration.userId !== userId && userRole !== 'admin') {
      throw new AuthorizationError('Can only cancel your own registration');
    }

    await this.registrationRepository.changeStatus(id, RegistrationStatus.CANCELLED);

    await auditLog.log({
      userId,
      action: 'registration.cancelled',
      resourceType: 'registration',
      resourceId: id,
    });

    return this.getRegistrationById(id);
  }

  async getAttendanceStats(eventId: number): Promise<{
    total: number;
    confirmed: number;
    checkedIn: number;
    attended: number;
    noShow: number;
    cancelled: number;
  }> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const [total, confirmed, checkedIn, attended, noShow, cancelled] = await Promise.all([
      this.registrationRepository.getCountByStatus(eventId, RegistrationStatus.CONFIRMED),
      this.registrationRepository.getCountByStatus(eventId, RegistrationStatus.CONFIRMED),
      this.registrationRepository.getCountByStatus(eventId, RegistrationStatus.CHECKED_IN),
      this.registrationRepository.getCountByStatus(eventId, RegistrationStatus.ATTENDED),
      this.registrationRepository.getCountByStatus(eventId, RegistrationStatus.NO_SHOW),
      this.registrationRepository.getCountByStatus(eventId, RegistrationStatus.CANCELLED),
    ]);

    return { total: confirmed + attended, confirmed, checkedIn, attended, noShow, cancelled };
  }
}
