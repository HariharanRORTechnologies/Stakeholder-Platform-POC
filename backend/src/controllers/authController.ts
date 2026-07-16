import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { logger } from '../utils/logger';
import { AppError } from '../errors/AppError';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const ipAddress = this.getClientIp(req);

      const tokenPair = await this.authService.login(
        { email, password },
        ipAddress
      );

      if (tokenPair.accessToken === 'mfa_pending') {
        res.status(202).json({
          success: false,
          message: 'MFA verification required',
          mfaPending: true,
          data: { userId: req.body.userId },
        });
        return;
      }

      this.setAuthCookies(res, tokenPair);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
          expiresIn: tokenPair.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, tokenPair } = await this.authService.register(req.body);

      this.setAuthCookies(res, tokenPair);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
          expiresIn: tokenPair.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      const tokenPair = await this.authService.refreshToken(refreshToken);

      this.setAuthCookies(res, tokenPair);

      res.json({
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
          expiresIn: tokenPair.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async setupMFA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const mfaSetup = await this.authService.setupMFA(userId);

      res.json({
        success: true,
        message: 'MFA setup initiated',
        data: {
          qrCode: mfaSetup.qrCode,
          secret: mfaSetup.secret,
          backupCodes: mfaSetup.backupCodes,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmMFA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { secret, token } = req.body;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const result = await this.authService.confirmMFA(userId, secret, token);

      res.json({
        success: true,
        message: 'MFA enabled successfully',
        data: {
          backupCodes: result.backupCodes,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async disableMFA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      await this.authService.disableMFA(userId);

      res.json({
        success: true,
        message: 'MFA disabled successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyMFA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.body.userId;
      const { token } = req.body;

      if (!userId || !token) {
        throw new AppError('UserId and MFA token are required', 400);
      }

      const tokenPair = await this.authService.verifyMFA(userId, token);

      this.setAuthCookies(res, tokenPair);

      res.json({
        success: true,
        message: 'MFA verified successfully',
        data: {
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
          expiresIn: tokenPair.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const message = await this.authService.requestPasswordReset(email);

      res.json({
        success: true,
        message,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      await this.authService.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      res.json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      await this.authService.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const token = this.extractToken(req);

      if (userId && token) {
        await this.authService.logout(userId, token);
      }

      this.clearAuthCookies(res);

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  private setAuthCookies(res: Response, tokenPair: any): void {
    const isDev = process.env.NODE_ENV === 'development';

    res.cookie('accessToken', tokenPair.accessToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: 'strict',
      maxAge: tokenPair.expiresIn * 1000,
      path: '/',
    });

    res.cookie('refreshToken', tokenPair.refreshToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }

  private extractToken(req: Request): string {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return '';
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }
}
