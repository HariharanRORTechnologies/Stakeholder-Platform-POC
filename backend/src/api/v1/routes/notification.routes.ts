import express, { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { NotificationController } from '../../../controllers/notificationController';
import { authMiddleware } from '../../../middleware/auth.middleware';

export function createNotificationRoutes(db: Pool): Router {
  const router = express.Router();
  const controller = new NotificationController(db);

  router.get(
    '/',
    authMiddleware,
    (req, res, next) => controller.getNotifications(req, res, next)
  );

  router.get(
    '/unread',
    authMiddleware,
    (req, res, next) => controller.getUnreadNotifications(req, res, next)
  );

  router.get(
    '/unread/count',
    authMiddleware,
    (req, res, next) => controller.getUnreadCount(req, res, next)
  );

  router.post(
    '/:id/read',
    authMiddleware,
    (req, res, next) => controller.markAsRead(req, res, next)
  );

  router.post(
    '/read-multiple',
    authMiddleware,
    (req, res, next) => controller.markMultipleAsRead(req, res, next)
  );

  return router;
}
