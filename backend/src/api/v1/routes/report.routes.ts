import express, { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { ReportController } from '../../../controllers/reportController';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { permissionMiddleware } from '../../../middleware/permission.middleware';

export function createReportRoutes(db: Pool): Router {
  const router = express.Router();
  const controller = new ReportController(db);

  router.get(
    '/',
    authMiddleware,
    permissionMiddleware('reports.read'),
    (req, res, next) => controller.getReports(req, res, next)
  );

  router.get(
    '/dashboard',
    authMiddleware,
    permissionMiddleware('reports.read'),
    (req, res, next) => controller.getDashboard(req, res, next)
  );

  router.get(
    '/:id',
    authMiddleware,
    permissionMiddleware('reports.read'),
    (req, res, next) => controller.getReportById(req, res, next)
  );

  router.post(
    '/event-summary',
    authMiddleware,
    permissionMiddleware('reports.create'),
    (req, res, next) => controller.generateEventSummary(req, res, next)
  );

  router.post(
    '/:id/export',
    authMiddleware,
    permissionMiddleware('reports.export'),
    (req, res, next) => controller.exportReport(req, res, next)
  );

  router.delete(
    '/:id',
    authMiddleware,
    permissionMiddleware('reports.delete'),
    (req, res, next) => controller.deleteReport(req, res, next)
  );

  return router;
}
