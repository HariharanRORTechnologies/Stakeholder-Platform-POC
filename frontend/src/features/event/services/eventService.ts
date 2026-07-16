import axios, { AxiosInstance } from 'axios';
import { Event, CreateEventRequest, UpdateEventRequest, EventListResponse } from '../types/event.types';

class EventService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1/events`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
      }
    );
  }

  async getEvents(page: number = 1, limit: number = 20, filters?: any): Promise<EventListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.departmentId) params.append('departmentId', filters.departmentId.toString());
      if (filters.organizerId) params.append('organizerId', filters.organizerId.toString());
      if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished.toString());
      if (filters.search) params.append('search', filters.search);
    }

    const response = await this.api.get<EventListResponse>(`/?${params.toString()}`);
    return response.data;
  }

  async getEventById(id: number): Promise<{ success: boolean; data: Event }> {
    const response = await this.api.get<{ success: boolean; data: Event }>(`/${id}`);
    return response.data;
  }

  async getUpcomingEvents(limit: number = 10): Promise<{ success: boolean; data: Event[] }> {
    const response = await this.api.get<{ success: boolean; data: Event[] }>(`/upcoming?limit=${limit}`);
    return response.data;
  }

  async getMyEvents(): Promise<{ success: boolean; data: Event[] }> {
    const response = await this.api.get<{ success: boolean; data: Event[] }>('/my-events');
    return response.data;
  }

  async createEvent(data: CreateEventRequest): Promise<{ success: boolean; data: Event }> {
    const response = await this.api.post<{ success: boolean; data: Event }>('/', data);
    return response.data;
  }

  async updateEvent(id: number, data: UpdateEventRequest): Promise<{ success: boolean; data: Event }> {
    const response = await this.api.put<{ success: boolean; data: Event }>(`/${id}`, data);
    return response.data;
  }

  async publishEvent(id: number): Promise<{ success: boolean; data: Event }> {
    const response = await this.api.post<{ success: boolean; data: Event }>(`/${id}/publish`, {});
    return response.data;
  }

  async changeStatus(id: number, status: string): Promise<{ success: boolean; data: Event }> {
    const response = await this.api.patch<{ success: boolean; data: Event }>(`/${id}/status`, { status });
    return response.data;
  }

  async deleteEvent(id: number): Promise<{ success: boolean }> {
    const response = await this.api.delete<{ success: boolean }>(`/${id}`);
    return response.data;
  }
}

export const eventService = new EventService();
