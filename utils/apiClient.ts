import axios from 'axios';
import { store } from '@/store';
import { toast } from 'sonner';

// Create API client
const createApiClient = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://liftora-production-0730.up.railway.app';
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v2';
  const timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');
  
  const client = axios.create({
    baseURL: `${baseURL}/api/${apiVersion}`,
    timeout,
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

// Default export for the main API client
export default createApiClient();
