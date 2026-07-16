import { ValidationError } from '../errors/AppError';
import { envConfig } from '../config/env.config';
import { LoginCredentials, UserRegistration, PasswordReset } from '../types/auth.types';

export class AuthValidator {
  static validateLoginCredentials(credentials: LoginCredentials): void {
    if (!credentials.email || !credentials.password) {
      throw new ValidationError('Email and password are required');
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (credentials.password.length < 1) {
      throw new ValidationError('Password is required');
    }
  }

  static validateRegistration(data: UserRegistration): void {
    this.validateEmail(data.email);
    this.validatePassword(data.password);

    if (!data.firstName || data.firstName.trim().length < 2) {
      throw new ValidationError('First name must be at least 2 characters');
    }

    if (!data.lastName || data.lastName.trim().length < 2) {
      throw new ValidationError('Last name must be at least 2 characters');
    }

    if (data.password !== data.confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }

    if (data.phoneNumber && !this.isValidPhoneNumber(data.phoneNumber)) {
      throw new ValidationError('Invalid phone number format');
    }
  }

  static validateEmail(email: string): void {
    if (!email || !this.isValidEmail(email)) {
      throw new ValidationError('Invalid email address');
    }
  }

  static validatePassword(password: string): void {
    if (!password) {
      throw new ValidationError('Password is required');
    }

    if (password.length < envConfig.PASSWORD_MIN_LENGTH) {
      throw new ValidationError(
        `Password must be at least ${envConfig.PASSWORD_MIN_LENGTH} characters`
      );
    }

    if (envConfig.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      throw new ValidationError('Password must contain at least one uppercase letter');
    }

    if (envConfig.PASSWORD_REQUIRE_NUMBERS && !/[0-9]/.test(password)) {
      throw new ValidationError('Password must contain at least one number');
    }

    if (envConfig.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new ValidationError('Password must contain at least one special character');
    }
  }

  static validatePasswordReset(data: PasswordReset): void {
    if (!data.token) {
      throw new ValidationError('Reset token is required');
    }

    this.validatePassword(data.newPassword);

    if (data.newPassword !== data.confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }
  }

  static validateMFAToken(token: string): void {
    if (!token || token.length !== 6 || !/^\d{6}$/.test(token)) {
      throw new ValidationError('Invalid MFA token. Must be 6 digits');
    }
  }

  static validateBackupCode(code: string): void {
    if (!code || code.length < 6) {
      throw new ValidationError('Invalid backup code');
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }
}
