import express, { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { RegistrationController } from '../../../controllers/registrationController';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { permissionMiddleware } from '../../../middleware/permission.middleware';

export function createRegistrationRoutes(db: Pool): Router {
  const router = express.Router();
  const controller = new RegistrationController(db);

  router.get(
    '/user/my-registrations',
    authMiddleware,
    (req, res, next) => controller.getUserRegistrations(req, res, next)
  );

  router.get(
    '/event/:eventId',
    authMiddleware,
    (req, res, next) => controller.getRegistrations(req, res, next)
  );

  router.get(
    '/event/:eventId/stats',
    authMiddleware,
    (req, res, next) => controller.getAttendanceStats(req, res, next)
  );

  router.get(
    '/:id',
    authMiddleware,
    (req, res, next) => controller.getRegistrationById(req, res, next)
  );

  router.post(
    '/event/:eventId/register',
    authMiddleware,
    (req, res, next) => controller.registerForEvent(req, res, next)
  );

  router.post(
    '/:id/approve',
    authMiddleware,
    permissionMiddleware('events.approve'),
    (req, res, next) => controller.approveRegistration(req, res, next)
  );

  router.post(
    '/:id/check-in',
    authMiddleware,
    (req, res, next) => controller.checkIn(req, res, next)
  );

  router.post(
    '/:id/attended',
    authMiddleware,
    (req, res, next) => controller.markAttended(req, res, next)
  );

  router.post(
    '/:id/cancel',
    authMiddleware,
    (req, res, next) => controller.cancelRegistration(req, res, next)
  );

  return router;
}
