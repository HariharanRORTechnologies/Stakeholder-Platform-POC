import axios, { AxiosInstance } from 'axios';
import {
  LoginCredentials,
  RegisterData,
  TokenPair,
  PasswordReset,
  ChangePassword,
  MFASetup,
  AuthResponse,
  LoginResponse,
  RegisterResponse,
} from '../types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/v1/auth`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(config => {
      const accessToken = this.getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.api.post('/refresh-token', { refreshToken });
              const { accessToken, refreshToken: newRefreshToken } = response.data.data;

              this.setAccessToken(accessToken);
              this.setRefreshToken(newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/auth/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/login', credentials);

      if (response.data.mfaPending) {
        return response.data;
      }

      const { accessToken, refreshToken } = response.data.data!;
      this.setAccessToken(accessToken);
      this.setRefreshToken(refreshToken);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await this.api.post<RegisterResponse>('/register', data);

      const { accessToken, refreshToken } = response.data.data!;
      this.setAccessToken(accessToken);
      this.setRefreshToken(refreshToken);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const response = await this.api.post<AuthResponse<TokenPair>>(
        '/refresh-token',
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data!;
      this.setAccessToken(accessToken);
      this.setRefreshToken(newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken, expiresIn: 3600 };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async setupMFA(): Promise<MFASetup> {
    try {
      const response = await this.api.post<AuthResponse<MFASetup>>('/mfa/setup');
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async confirmMFA(secret: string, token: string): Promise<{ backupCodes: string[] }> {
    try {
      const response = await this.api.post<AuthResponse<{ backupCodes: string[] }>>(
        '/mfa/confirm',
        { secret, token }
      );
      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async disableMFA(): Promise<void> {
    try {
      await this.api.post('/mfa/disable');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyMFA(userId: number, token: string): Promise<TokenPair> {
    try {
      const response = await this.api.post<AuthResponse<TokenPair>>('/mfa/verify', {
        userId,
        token,
      });

      const { accessToken, refreshToken } = response.data.data!;
      this.setAccessToken(accessToken);
      this.setRefreshToken(refreshToken);

      return response.data.data!;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async requestPasswordReset(email: string): Promise<string> {
    try {
      const response = await this.api.post<AuthResponse>('/password/reset-request', {
        email,
      });
      return response.data.message;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(data: PasswordReset): Promise<void> {
    try {
      await this.api.post('/password/reset', data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(data: ChangePassword): Promise<void> {
    try {
      await this.api.post('/password/change', data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/logout');
    } catch (error) {
      this.clearTokens();
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      await this.api.get('/verify');
      return true;
    } catch {
      return false;
    }
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || 'An error occurred';
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}

export const authService = new AuthService();
