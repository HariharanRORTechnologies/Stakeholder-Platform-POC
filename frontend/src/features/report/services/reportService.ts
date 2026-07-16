import axios, { AxiosInstance } from 'axios';

class ReportService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1/reports`,
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

  async getReports(page: number = 1, limit: number = 20): Promise<any> {
    const response = await this.api.get(`/?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getDashboard(): Promise<any> {
    const response = await this.api.get('/dashboard');
    return response.data;
  }

  async generateReport(_type: string, eventIds?: number[], startDate?: string, endDate?: string): Promise<any> {
    const response = await this.api.post('/event-summary', {
      eventIds,
      startDate,
      endDate,
    });
    return response.data;
  }

  async exportReport(id: number, format: string): Promise<any> {
    const response = await this.api.post(`/${id}/export`, { format });
    return response.data;
  }

  async deleteReport(id: number): Promise<any> {
    const response = await this.api.delete(`/${id}`);
    return response.data;
  }
}

export const reportService = new ReportService();
