import axios, { AxiosInstance } from 'axios';

class NotificationService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1/notifications`,
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

  async getNotifications(page: number = 1, limit: number = 20): Promise<any> {
    const response = await this.api.get(`/?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUnreadNotifications(): Promise<any> {
    const response = await this.api.get('/unread');
    return response.data;
  }

  async getUnreadCount(): Promise<any> {
    const response = await this.api.get('/unread/count');
    return response.data;
  }

  async markAsRead(id: number): Promise<any> {
    const response = await this.api.post(`/${id}/read`, {});
    return response.data;
  }

  async markMultipleAsRead(ids: number[]): Promise<any> {
    const response = await this.api.post('/read-multiple', { ids });
    return response.data;
  }
}

export const notificationService = new NotificationService();
