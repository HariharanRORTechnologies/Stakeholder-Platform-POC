import { Router } from 'express';
import { UserController } from '../../../controllers/userController';
import { UserService } from '../../../services/userService';
import { AuthMiddleware } from '../../../middleware/auth.middleware';
import { Pool } from 'mysql2/promise';

export function createUserRoutes(db: Pool): Router {
  const router = Router();
  const userService = new UserService(db);
  const userController = new UserController(userService);

  router.use(AuthMiddleware.verifyToken);

  router.post(
    '/',
    AuthMiddleware.requirePermission('users.create'),
    userController.createUser.bind(userController)
  );

  router.get(
    '/',
    AuthMiddleware.requirePermission('users.read'),
    userController.listUsers.bind(userController)
  );

  router.get(
    '/:userId',
    AuthMiddleware.requirePermission('users.read'),
    userController.getUser.bind(userController)
  );

  router.put(
    '/:userId',
    AuthMiddleware.requirePermission('users.update'),
    userController.updateUser.bind(userController)
  );

  router.delete(
    '/:userId',
    AuthMiddleware.requirePermission('users.delete'),
    userController.deleteUser.bind(userController)
  );

  router.post(
    '/:userId/deactivate',
    AuthMiddleware.requirePermission('users.update'),
    userController.deactivateUser.bind(userController)
  );

  router.post(
    '/:userId/activate',
    AuthMiddleware.requirePermission('users.update'),
    userController.activateUser.bind(userController)
  );

  router.post(
    '/:userId/reset-password',
    AuthMiddleware.requirePermission('users.change_password'),
    userController.resetPassword.bind(userController)
  );

  router.post(
    '/:userId/unlock',
    AuthMiddleware.requirePermission('users.update'),
    userController.unlockAccount.bind(userController)
  );

  router.post(
    '/:userId/verify-email',
    AuthMiddleware.requirePermission('users.update'),
    userController.verifyEmail.bind(userController)
  );

  router.post(
    '/:userId/roles/:roleId',
    AuthMiddleware.requirePermission('roles.assign'),
    userController.assignRole.bind(userController)
  );

  router.delete(
    '/:userId/roles/:roleId',
    AuthMiddleware.requirePermission('roles.assign'),
    userController.removeRole.bind(userController)
  );

  router.get(
    '/:userId/roles',
    AuthMiddleware.requirePermission('roles.read'),
    userController.getUserRoles.bind(userController)
  );

  router.get(
    '/:userId/permissions',
    AuthMiddleware.requirePermission('users.read'),
    userController.getUserPermissions.bind(userController)
  );

  return router;
}
