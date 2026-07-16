import { AuthProvider, MFAMethod } from '../types/auth.types';

export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  phoneNumber?: string;
  avatarUrl?: string;
  departmentId?: number;
  authProvider: AuthProvider;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  mfaEnabled: boolean;
  mfaMethod?: MFAMethod;
  mfaSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  isLocked(): boolean {
    if (!this.lockedUntil) return false;
    return this.lockedUntil > new Date();
  }

  isEmailConfirmed(): boolean {
    return this.isEmailVerified && !!this.emailVerifiedAt;
  }

  canLogin(): boolean {
    return this.isActive && !this.isLocked() && this.isEmailVerified;
  }
}
