import axios, { AxiosInstance } from 'axios';

class RegistrationService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1/registrations`,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) config.headers.Authorization = `Bearer ${token}`;
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

  async getRegistrations(eventId: number, page: number = 1, limit: number = 20): Promise<any> {
    const response = await this.api.get(`/event/${eventId}?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUserRegistrations(): Promise<any> {
    const response = await this.api.get('/user/my-registrations');
    return response.data;
  }

  async registerForEvent(eventId: number): Promise<any> {
    const response = await this.api.post(`/event/${eventId}/register`, {});
    return response.data;
  }

  async approveRegistration(id: number): Promise<any> {
    const response = await this.api.post(`/${id}/approve`, {});
    return response.data;
  }

  async checkIn(id: number): Promise<any> {
    const response = await this.api.post(`/${id}/check-in`, {});
    return response.data;
  }

  async markAttended(id: number): Promise<any> {
    const response = await this.api.post(`/${id}/attended`, {});
    return response.data;
  }

  async cancelRegistration(id: number): Promise<any> {
    const response = await this.api.post(`/${id}/cancel`, {});
    return response.data;
  }

  async getAttendanceStats(eventId: number): Promise<any> {
    const response = await this.api.get(`/event/${eventId}/stats`);
    return response.data;
  }
}

export const registrationService = new RegistrationService();
