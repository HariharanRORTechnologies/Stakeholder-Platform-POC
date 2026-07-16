import { Router } from 'express';
import { AuthController } from '../../../controllers/authController';
import { AuthMiddleware } from '../../../middleware/auth.middleware';
import { AuthService } from '../../../services/authService';
import { Pool } from 'mysql2/promise';

export function createAuthRoutes(db: Pool): Router {
  const router = Router();
  const authService = new AuthService(db);
  const authController = new AuthController(authService);

  router.post('/login', authController.login.bind(authController));

  router.post('/register', authController.register.bind(authController));

  router.post(
    '/refresh-token',
    authController.refreshToken.bind(authController)
  );

  router.post(
    '/mfa/setup',
    AuthMiddleware.verifyToken,
    authController.setupMFA.bind(authController)
  );

  router.post(
    '/mfa/confirm',
    AuthMiddleware.verifyToken,
    authController.confirmMFA.bind(authController)
  );

  router.post(
    '/mfa/disable',
    AuthMiddleware.verifyToken,
    authController.disableMFA.bind(authController)
  );

  router.post(
    '/mfa/verify',
    authController.verifyMFA.bind(authController)
  );

  router.post(
    '/password/reset-request',
    authController.requestPasswordReset.bind(authController)
  );

  router.post(
    '/password/reset',
    authController.resetPassword.bind(authController)
  );

  router.post(
    '/password/change',
    AuthMiddleware.verifyToken,
    authController.changePassword.bind(authController)
  );

  router.post(
    '/logout',
    AuthMiddleware.verifyToken,
    authController.logout.bind(authController)
  );

  router.get(
    '/verify',
    AuthMiddleware.verifyToken,
    (req, res) => {
      res.json({
        success: true,
        message: 'Token is valid',
        data: req.user,
      });
    }
  );

  return router;
}
