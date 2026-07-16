export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
  PUSH = 'push',
}

export enum NotificationType {
  EVENT_CREATED = 'event_created',
  EVENT_UPDATED = 'event_updated',
  REGISTRATION_CONFIRMED = 'registration_confirmed',
  EVENT_REMINDER = 'event_reminder',
  ATTENDANCE_RECORDED = 'attendance_recorded',
  CERTIFICATE_ISSUED = 'certificate_issued',
  FEEDBACK_REQUEST = 'feedback_request',
  SYSTEM = 'system',
}

export class Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  recipientAddress?: string;
  isRead: boolean;
  sentAt?: Date;
  readAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Notification> = {}) {
    Object.assign(this, data);
  }

  isDelivered(): boolean {
    return this.sentAt !== undefined && this.sentAt !== null;
  }

  markAsRead(): void {
    this.isRead = true;
    this.readAt = new Date();
  }
}

export class NotificationTemplate {
  id: number;
  name: string;
  type: NotificationType;
  subject?: string;
  bodyTemplate: string;
  channels: NotificationChannel[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<NotificationTemplate> = {}) {
    Object.assign(this, data);
  }
}
