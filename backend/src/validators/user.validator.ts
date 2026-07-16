import { ValidationError } from '../errors/AppError';

export class UserValidator {
  static validateCreateUser(data: any): void {
    if (!data.firstName || data.firstName.trim().length < 2) {
      throw new ValidationError('First name must be at least 2 characters');
    }

    if (!data.lastName || data.lastName.trim().length < 2) {
      throw new ValidationError('Last name must be at least 2 characters');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new ValidationError('Invalid email address');
    }

    if (!data.password || data.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    if (data.phoneNumber && !this.isValidPhoneNumber(data.phoneNumber)) {
      throw new ValidationError('Invalid phone number format');
    }
  }

  static validateUpdateUser(data: any): void {
    if (data.firstName !== undefined) {
      if (data.firstName.trim().length < 2) {
        throw new ValidationError('First name must be at least 2 characters');
      }
    }

    if (data.lastName !== undefined) {
      if (data.lastName.trim().length < 2) {
        throw new ValidationError('Last name must be at least 2 characters');
      }
    }

    if (data.phoneNumber !== undefined && data.phoneNumber) {
      if (!this.isValidPhoneNumber(data.phoneNumber)) {
        throw new ValidationError('Invalid phone number format');
      }
    }

    if (data.departmentId !== undefined) {
      if (!Number.isInteger(data.departmentId) || data.departmentId < 1) {
        throw new ValidationError('Invalid department ID');
      }
    }

    if (data.isActive !== undefined) {
      if (typeof data.isActive !== 'boolean') {
        throw new ValidationError('isActive must be a boolean');
      }
    }
  }

  static validateBulkCreateUsers(data: any[]): void {
    if (!Array.isArray(data)) {
      throw new ValidationError('Data must be an array');
    }

    if (data.length === 0) {
      throw new ValidationError('At least one user must be provided');
    }

    if (data.length > 1000) {
      throw new ValidationError('Maximum 1000 users can be created at once');
    }

    data.forEach((user, index) => {
      try {
        this.validateCreateUser(user);
      } catch (error) {
        throw new ValidationError(`User at index ${index}: ${(error as Error).message}`);
      }
    });
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
