export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  channel: string;
  isRead: boolean;
  sentAt?: string;
  readAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export const NOTIFICATION_TYPES = {
  EVENT_CREATED: 'event_created',
  EVENT_UPDATED: 'event_updated',
  REGISTRATION_CONFIRMED: 'registration_confirmed',
  EVENT_REMINDER: 'event_reminder',
  ATTENDANCE_RECORDED: 'attendance_recorded',
  CERTIFICATE_ISSUED: 'certificate_issued',
  FEEDBACK_REQUEST: 'feedback_request',
  SYSTEM: 'system',
};

export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  IN_APP: 'in_app',
  PUSH: 'push',
};
