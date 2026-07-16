import { Router } from 'express';
import { RoleController } from '../../../controllers/roleController';
import { RoleService } from '../../../services/roleService';
import { AuthMiddleware } from '../../../middleware/auth.middleware';
import { Pool } from 'mysql2/promise';

export function createRoleRoutes(db: Pool): Router {
  const router = Router();
  const roleService = new RoleService(db);
  const roleController = new RoleController(roleService);

  router.use(AuthMiddleware.verifyToken);

  router.post(
    '/',
    AuthMiddleware.requirePermission('roles.create'),
    roleController.createRole.bind(roleController)
  );

  router.get(
    '/',
    AuthMiddleware.requirePermission('roles.read'),
    roleController.listRoles.bind(roleController)
  );

  router.get(
    '/:roleId',
    AuthMiddleware.requirePermission('roles.read'),
    roleController.getRole.bind(roleController)
  );

  router.put(
    '/:roleId',
    AuthMiddleware.requirePermission('roles.update'),
    roleController.updateRole.bind(roleController)
  );

  router.delete(
    '/:roleId',
    AuthMiddleware.requirePermission('roles.delete'),
    roleController.deleteRole.bind(roleController)
  );

  router.post(
    '/:roleId/activate',
    AuthMiddleware.requirePermission('roles.update'),
    roleController.activateRole.bind(roleController)
  );

  router.post(
    '/:roleId/deactivate',
    AuthMiddleware.requirePermission('roles.update'),
    roleController.deactivateRole.bind(roleController)
  );

  router.get(
    '/:roleId/permissions',
    AuthMiddleware.requirePermission('roles.read'),
    roleController.getRolePermissions.bind(roleController)
  );

  router.post(
    '/:roleId/permissions',
    AuthMiddleware.requirePermission('roles.update'),
    roleController.addPermission.bind(roleController)
  );

  router.delete(
    '/:roleId/permissions/:permissionId',
    AuthMiddleware.requirePermission('roles.update'),
    roleController.removePermission.bind(roleController)
  );

  router.put(
    '/:roleId/permissions',
    AuthMiddleware.requirePermission('roles.update'),
    roleController.setPermissions.bind(roleController)
  );

  return router;
}
