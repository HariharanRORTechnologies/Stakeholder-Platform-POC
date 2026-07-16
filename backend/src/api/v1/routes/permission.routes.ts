import { Router } from 'express';
import { PermissionController } from '../../../controllers/permissionController';
import { PermissionService } from '../../../services/permissionService';
import { AuthMiddleware } from '../../../middleware/auth.middleware';
import { Pool } from 'mysql2/promise';

export function createPermissionRoutes(db: Pool): Router {
  const router = Router();
  const permissionService = new PermissionService(db);
  const permissionController = new PermissionController(permissionService);

  router.use(AuthMiddleware.verifyToken);

  router.post(
    '/',
    AuthMiddleware.requirePermission('permissions.create'),
    permissionController.createPermission.bind(permissionController)
  );

  router.get(
    '/',
    AuthMiddleware.requirePermission('permissions.read'),
    permissionController.listPermissions.bind(permissionController)
  );

  router.get(
    '/categories',
    AuthMiddleware.requirePermission('permissions.read'),
    permissionController.getCategories.bind(permissionController)
  );

  router.get(
    '/category/:category',
    AuthMiddleware.requirePermission('permissions.read'),
    permissionController.getPermissionsByCategory.bind(permissionController)
  );

  router.get(
    '/:permissionId',
    AuthMiddleware.requirePermission('permissions.read'),
    permissionController.getPermission.bind(permissionController)
  );

  router.put(
    '/:permissionId',
    AuthMiddleware.requirePermission('permissions.update'),
    permissionController.updatePermission.bind(permissionController)
  );

  router.delete(
    '/:permissionId',
    AuthMiddleware.requirePermission('permissions.delete'),
    permissionController.deletePermission.bind(permissionController)
  );

  router.post(
    '/:permissionId/activate',
    AuthMiddleware.requirePermission('permissions.update'),
    permissionController.activatePermission.bind(permissionController)
  );

  router.post(
    '/:permissionId/deactivate',
    AuthMiddleware.requirePermission('permissions.update'),
    permissionController.deactivatePermission.bind(permissionController)
  );

  router.post(
    '/seed/default',
    AuthMiddleware.requireRole('Super Admin'),
    permissionController.seedPermissions.bind(permissionController)
  );

  return router;
}
