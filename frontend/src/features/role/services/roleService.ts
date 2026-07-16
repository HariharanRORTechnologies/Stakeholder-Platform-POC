import axios, { AxiosInstance } from 'axios';
import {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleListFilters,
  RoleListResponse,
  RoleDetailResponse,
} from '../types/role.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class RoleService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/v1/roles`,
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

  async listRoles(filters: RoleListFilters): Promise<RoleListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.isSystem !== undefined) params.append('isSystem', filters.isSystem.toString());
      if (filters.searchTerm) params.append('search', filters.searchTerm);

      const response = await this.api.get<any>('/', { params });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRole(roleId: number): Promise<RoleDetailResponse> {
    try {
      const response = await this.api.get<any>(`/${roleId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createRole(data: CreateRoleRequest): Promise<Role> {
    try {
      const response = await this.api.post<any>('/', data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateRole(roleId: number, data: UpdateRoleRequest): Promise<Role> {
    try {
      const response = await this.api.put<any>(`/${roleId}`, data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteRole(roleId: number): Promise<void> {
    try {
      await this.api.delete(`/${roleId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deactivateRole(roleId: number): Promise<void> {
    try {
      await this.api.post(`/${roleId}/deactivate`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async activateRole(roleId: number): Promise<void> {
    try {
      await this.api.post(`/${roleId}/activate`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRolePermissions(roleId: number): Promise<any[]> {
    try {
      const response = await this.api.get(`/${roleId}/permissions`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addPermission(roleId: number, permissionId: number): Promise<void> {
    try {
      await this.api.post(`/${roleId}/permissions`, { permissionId });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removePermission(roleId: number, permissionId: number): Promise<void> {
    try {
      await this.api.delete(`/${roleId}/permissions/${permissionId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async setPermissions(roleId: number, permissionIds: number[]): Promise<void> {
    try {
      await this.api.put(`/${roleId}/permissions`, { permissionIds });
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

export const roleService = new RoleService();
