import axios, { AxiosInstance } from 'axios';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserListFilters,
  UserListResponse,
  UserDetailResponse,
} from '../types/user.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class UserService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/v1/users`,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(config => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
  }

  async listUsers(filters: UserListFilters): Promise<UserListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.departmentId) params.append('departmentId', filters.departmentId.toString());
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.roleId) params.append('roleId', filters.roleId.toString());
      if (filters.searchTerm) params.append('search', filters.searchTerm);

      const response = await this.api.get<any>('/', { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUser(userId: number): Promise<UserDetailResponse> {
    try {
      const response = await this.api.get<any>(`/${userId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const response = await this.api.post<any>('/', data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUser(userId: number, data: UpdateUserRequest): Promise<User> {
    try {
      const response = await this.api.put<any>(`/${userId}`, data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteUser(userId: number, hardDelete: boolean = false): Promise<void> {
    try {
      await this.api.delete(`/${userId}`, {
        data: { hardDelete },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deactivateUser(userId: number): Promise<void> {
    try {
      await this.api.post(`/${userId}/deactivate`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async activateUser(userId: number): Promise<void> {
    try {
      await this.api.post(`/${userId}/activate`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(userId: number, newPassword: string): Promise<void> {
    try {
      await this.api.post(`/${userId}/reset-password`, { newPassword });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async unlockAccount(userId: number): Promise<void> {
    try {
      await this.api.post(`/${userId}/unlock`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyEmail(userId: number): Promise<void> {
    try {
      await this.api.post(`/${userId}/verify-email`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async assignRole(userId: number, roleId: number): Promise<void> {
    try {
      await this.api.post(`/${userId}/roles`, { roleId });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeRole(userId: number, roleId: number): Promise<void> {
    try {
      await this.api.delete(`/${userId}/roles/${roleId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserRoles(userId: number): Promise<any[]> {
    try {
      const response = await this.api.get(`/${userId}/roles`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const response = await this.api.get(`/${userId}/permissions`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
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

export const userService = new UserService();
