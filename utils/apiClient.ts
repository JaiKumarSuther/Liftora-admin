import axios from 'axios';
import { store } from '@/store';
import { toast } from 'sonner';

// Create multiple API clients for different ports
const createApiClient = (port: string) => {
  const client = axios.create({
    baseURL: `http://localhost:${port}/api/v2`,
    timeout: 10000,
  });

  client.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        store.dispatch({ type: 'auth/clearToken' });
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('Network error. Please check your connection.');
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// API clients for different services
export const api8001 = createApiClient('8001'); // User management
export const api8002 = createApiClient('8002'); // Auth and analytics
export const api8003 = createApiClient('8003'); // Routines, quotes, rewards
export const api8004 = createApiClient('8004'); // Stats

// Default export for backward compatibility
export default api8001;



