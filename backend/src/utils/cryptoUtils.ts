import crypto from 'crypto';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { envConfig } from '../config/env.config';

export class CryptoUtils {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, envConfig.BCRYPT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static generateMFASecret(email: string): {
    secret: string;
    qrCode: string;
  } {
    const secret = speakeasy.generateSecret({
      name: `${envConfig.MFA_ISSUER} (${email})`,
      issuer: envConfig.MFA_ISSUER,
      length: 32,
    });

    return {
      secret: secret.base32,
      qrCode: secret.otpauth_url || '',
    };
  }

  static async generateMFAQRCode(secret: string, email: string): Promise<string> {
    const otpauth = speakeasy.otpauthURL({
      secret,
      encoding: 'base32',
      label: `${envConfig.MFA_ISSUER} (${email})`,
      issuer: envConfig.MFA_ISSUER,
    });

    return QRCode.toDataURL(otpauth);
  }

  static verifyMFAToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: envConfig.MFA_WINDOW,
    });
  }

  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(this.generateRandomToken(6));
    }
    return codes;
  }

  static async hashBackupCode(code: string): Promise<string> {
    return bcrypt.hash(code, 8);
  }

  static async verifyBackupCode(code: string, hash: string): Promise<boolean> {
    return bcrypt.compare(code, hash);
  }

  static encrypt(data: string, key?: string): string {
    const encryptionKey = key || envConfig.JWT_SECRET;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey.padEnd(32, '0')), iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  }

  static decrypt(encryptedData: string, key?: string): string {
    const encryptionKey = key || envConfig.JWT_SECRET;
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey.padEnd(32, '0')), iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  static generateEmailVerificationToken(): string {
    return this.generateRandomToken(32);
  }

  static generatePasswordResetToken(): string {
    return this.generateRandomToken(32);
  }
}
