import axios, { AxiosInstance } from 'axios';
import {
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionListFilters,
  PermissionListResponse,
  PermissionDetailResponse,
} from '../types/permission.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class PermissionService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/v1/permissions`,
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

  async listPermissions(filters: PermissionListFilters): Promise<PermissionListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.category) params.append('category', filters.category);
      if (filters.searchTerm) params.append('search', filters.searchTerm);

      const response = await this.api.get<any>('/', { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPermission(permissionId: number): Promise<PermissionDetailResponse> {
    try {
      const response = await this.api.get<any>(`/${permissionId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createPermission(data: CreatePermissionRequest): Promise<Permission> {
    try {
      const response = await this.api.post<any>('/', data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePermission(
    permissionId: number,
    data: UpdatePermissionRequest
  ): Promise<Permission> {
    try {
      const response = await this.api.put<any>(`/${permissionId}`, data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deletePermission(permissionId: number): Promise<void> {
    try {
      await this.api.delete(`/${permissionId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deactivatePermission(permissionId: number): Promise<void> {
    try {
      await this.api.post(`/${permissionId}/deactivate`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async activatePermission(permissionId: number): Promise<void> {
    try {
      await this.api.post(`/${permissionId}/activate`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await this.api.get('/categories');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPermissionsByCategory(category: string): Promise<Permission[]> {
    try {
      const response = await this.api.get(`/category/${category}`);
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

export const permissionService = new PermissionService();
