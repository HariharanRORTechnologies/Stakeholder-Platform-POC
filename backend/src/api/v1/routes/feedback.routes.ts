import express, { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { FeedbackController } from '../../../controllers/feedbackController';
import { authMiddleware } from '../../../middleware/auth.middleware';

export function createFeedbackRoutes(db: Pool): Router {
  const router = express.Router();
  const controller = new FeedbackController(db);

  router.get(
    '/event/:eventId',
    authMiddleware,
    (req, res, next) => controller.getFeedback(req, res, next)
  );

  router.post(
    '/event/:eventId/submit',
    authMiddleware,
    (req, res, next) => controller.submitFeedback(req, res, next)
  );

  router.get(
    '/event/:eventId/stats',
    authMiddleware,
    (req, res, next) => controller.getFeedbackStats(req, res, next)
  );

  router.get(
    '/certificates/my-certificates',
    authMiddleware,
    (req, res, next) => controller.getUserCertificates(req, res, next)
  );

  router.post(
    '/certificates/event/:eventId/user/:userId',
    authMiddleware,
    (req, res, next) => controller.issueCertificate(req, res, next)
  );

  router.get(
    '/certificates/verify/:code',
    (req, res, next) => controller.verifyCertificate(req, res, next)
  );

  return router;
}
