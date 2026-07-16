import express, { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { EventController } from '../../../controllers/eventController';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { permissionMiddleware } from '../../../middleware/permission.middleware';

export function createEventRoutes(db: Pool): Router {
  const router = express.Router();
  const controller = new EventController(db);

  router.get('/', authMiddleware, (req, res, next) => controller.getEvents(req, res, next));

  router.get('/upcoming', authMiddleware, (req, res, next) => controller.getUpcomingEvents(req, res, next));

  router.get('/my-events', authMiddleware, (req, res, next) => controller.getMyEvents(req, res, next));

  router.get('/:id', authMiddleware, (req, res, next) => controller.getEventById(req, res, next));

  router.post(
    '/',
    authMiddleware,
    permissionMiddleware('events.create'),
    (req, res, next) => controller.createEvent(req, res, next)
  );

  router.put(
    '/:id',
    authMiddleware,
    permissionMiddleware('events.update'),
    (req, res, next) => controller.updateEvent(req, res, next)
  );

  router.patch(
    '/:id/status',
    authMiddleware,
    permissionMiddleware('events.update'),
    (req, res, next) => controller.changeEventStatus(req, res, next)
  );

  router.post(
    '/:id/publish',
    authMiddleware,
    permissionMiddleware('events.approve'),
    (req, res, next) => controller.publishEvent(req, res, next)
  );

  router.delete(
    '/:id',
    authMiddleware,
    permissionMiddleware('events.delete'),
    (req, res, next) => controller.deleteEvent(req, res, next)
  );

  return router;
}
