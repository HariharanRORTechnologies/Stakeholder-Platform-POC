export enum RegistrationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  ATTENDED = 'attended',
  NO_SHOW = 'no_show',
  CANCELLED = 'cancelled',
  WAITLISTED = 'waitlisted',
}

export class Registration {
  id: number;
  eventId: number;
  userId: number;
  status: RegistrationStatus;
  registrationDate: Date;
  approvedBy?: number;
  checkedInAt?: Date;
  attendedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(data: Partial<Registration> = {}) {
    Object.assign(this, data);
  }

  isConfirmed(): boolean {
    return this.status === RegistrationStatus.CONFIRMED;
  }

  isAttended(): boolean {
    return this.status === RegistrationStatus.ATTENDED || this.status === RegistrationStatus.CHECKED_IN;
  }

  canBeCancelled(): boolean {
    return (
      this.status !== RegistrationStatus.CANCELLED &&
      this.status !== RegistrationStatus.ATTENDED
    );
  }
}

export class Attendance {
  id: number;
  registrationId: number;
  eventId: number;
  userId: number;
  checkedInAt: Date;
  checkedOutAt?: Date;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Attendance> = {}) {
    Object.assign(this, data);
  }

  getDuration(): number {
    if (!this.checkedOutAt) return 0;
    return Math.round((this.checkedOutAt.getTime() - this.checkedInAt.getTime()) / 1000 / 60);
  }
}
