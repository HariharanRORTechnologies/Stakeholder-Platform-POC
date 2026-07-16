import { Pool } from 'mysql2/promise';
import { NotificationRepository } from '../repositories/notificationRepository';
import { Notification, NotificationChannel, NotificationType } from '../models/Notification.model';
import { NotFoundError } from '../errors/AppError';
import { logger } from '../utils/logger';

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor(db: Pool) {
    this.notificationRepository = new NotificationRepository(db);
  }

  async getNotifications(userId: number, page: number = 1, limit: number = 20): Promise<{ notifications: Notification[]; total: number }> {
    return this.notificationRepository.findByUser(userId, page, limit);
  }

  async getNotificationById(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }
    return notification;
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.findUnread(userId);
  }

  async sendNotification(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    channel: NotificationChannel,
    recipientAddress?: string,
    metadata?: Record<string, any>
  ): Promise<Notification> {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      channel,
      recipientAddress,
      isRead: false,
      metadata,
    });

    const notificationId = await this.notificationRepository.create(notification);

    try {
      await this.deliverNotification(notificationId, channel, recipientAddress || '');
    } catch (error) {
      logger.error(`Failed to deliver notification ${notificationId}`, { error });
    }

    return this.getNotificationById(notificationId);
  }

  async markAsRead(id: number): Promise<Notification> {
    await this.notificationRepository.markAsRead(id);
    return this.getNotificationById(id);
  }

  async markMultipleAsRead(ids: number[]): Promise<boolean> {
    return this.notificationRepository.markMultipleAsRead(ids);
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.getUnreadCount(userId);
  }

  async sendBulkNotifications(
    userIds: number[],
    type: NotificationType,
    title: string,
    message: string,
    channels: NotificationChannel[]
  ): Promise<number> {
    let count = 0;

    for (const userId of userIds) {
      for (const channel of channels) {
        try {
          await this.sendNotification(userId, type, title, message, channel);
          count++;
        } catch (error) {
          logger.error(`Failed to send notification to user ${userId}`, { error });
        }
      }
    }

    return count;
  }

  private async deliverNotification(id: number, channel: NotificationChannel, recipient: string): Promise<void> {
    switch (channel) {
      case NotificationChannel.EMAIL:
        await this.sendEmail(id, recipient);
        break;
      case NotificationChannel.SMS:
        await this.sendSMS(id, recipient);
        break;
      case NotificationChannel.PUSH:
        await this.sendPush(id);
        break;
      case NotificationChannel.IN_APP:
        await this.notificationRepository.markAsDelivered(id);
        break;
    }
  }

  private async sendEmail(id: number, recipient: string): Promise<void> {
    const notification = await this.getNotificationById(id);

    logger.info(`Sending email notification to ${recipient}`, {
      notificationId: id,
      type: notification.type,
    });

    await this.notificationRepository.markAsDelivered(id);
  }

  private async sendSMS(id: number, recipient: string): Promise<void> {
    const notification = await this.getNotificationById(id);

    logger.info(`Sending SMS notification to ${recipient}`, {
      notificationId: id,
      type: notification.type,
    });

    await this.notificationRepository.markAsDelivered(id);
  }

  private async sendPush(id: number): Promise<void> {
    const notification = await this.getNotificationById(id);

    logger.info(`Sending push notification`, {
      notificationId: id,
      userId: notification.userId,
      type: notification.type,
    });

    await this.notificationRepository.markAsDelivered(id);
  }
}
