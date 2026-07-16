import axios, { AxiosInstance } from 'axios';

class FeedbackService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1/feedback`,
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

  async getFeedback(eventId: number, page: number = 1, limit: number = 20): Promise<any> {
    const response = await this.api.get(`/event/${eventId}?page=${page}&limit=${limit}`);
    return response.data;
  }

  async submitFeedback(
    eventId: number,
    rating: number,
    content: string,
    title?: string,
    isAnonymous?: boolean
  ): Promise<any> {
    const response = await this.api.post(`/event/${eventId}/submit`, {
      rating,
      content,
      title,
      isAnonymous,
    });
    return response.data;
  }

  async getUserCertificates(): Promise<any> {
    const response = await this.api.get('/certificates/my-certificates');
    return response.data;
  }

  async issueCertificate(eventId: number, userId: number, title: string, description?: string): Promise<any> {
    const response = await this.api.post(`/certificates/event/${eventId}/user/${userId}`, {
      title,
      description,
    });
    return response.data;
  }

  async verifyCertificate(code: string): Promise<any> {
    const response = await this.api.get(`/certificates/verify/${code}`);
    return response.data;
  }

  async getFeedbackStats(eventId: number): Promise<any> {
    const response = await this.api.get(`/event/${eventId}/stats`);
    return response.data;
  }
}

export const feedbackService = new FeedbackService();
