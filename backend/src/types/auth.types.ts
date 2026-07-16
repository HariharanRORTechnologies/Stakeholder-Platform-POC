export enum AuthProvider {
  LOCAL = 'local',
  LDAP = 'ldap',
}

export enum MFAMethod {
  TOTP = 'totp',
  SMS = 'sms',
  EMAIL = 'email',
}

export interface JWTPayload {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  permissions: string[];
  iat: number;
  exp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LDAPCredentials {
  username: string;
  password: string;
}

export interface MFASetupResponse {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

export interface MFAVerification {
  token: string;
  method: MFAMethod;
}

export interface AuthSession {
  userId: number;
  email: string;
  issuedAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  departmentId?: number;
  phoneNumber?: string;
}
