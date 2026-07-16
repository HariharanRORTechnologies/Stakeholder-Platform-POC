export interface JWTPayload {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  departmentId?: number;
  phoneNumber?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MFASetup {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

export interface MFAVerification {
  userId: number;
  token: string;
}

export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  mfaPending?: boolean;
}

export interface LoginResponse extends AuthResponse {
  data?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface RegisterResponse extends AuthResponse {
  data?: {
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  departmentId?: number;
  isActive: boolean;
}
