import apiClient from './apiClient';
import { toast } from 'sonner';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Making login request to:', '/admin/login');
      console.log('Request payload:', { email, password: '***' });
      
      const response = await apiClient.post('/admin/login', { email, password });
      
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      
      if (response.data.success) {
        toast.success('Login successful!');
        return response.data;
      } else {
        console.error('Login failed - API returned success: false');
        toast.error(response.data.message || 'Login failed');
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('API Error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  },
};

// Stats Services
export const statsService = {
  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
    subscriptionStatus?: string;
    planType?: string;
  }) => {
    try {
      const response = await apiClient.get('/admin/stats', { params });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      toast.error(message);
      throw error;
    }
  },

  getAdvancedAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
    interval?: 'day' | 'week' | 'month';
  }) => {
    try {
      const response = await apiClient.get('/admin/analytics/advanced', { params });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch analytics';
      toast.error(message);
      throw error;
    }
  },

  getUserRetentionReport: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const response = await apiClient.get('/admin/analytics/user-retention', { params });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch retention report';
      toast.error(message);
      throw error;
    }
  },
};

// User Services
export const userService = {
  getUsers: async (params?: {
    status?: string;
    search?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await apiClient.get('/admin/users', { params });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      toast.error(message);
      throw error;
    }
  },

  getUserById: async (userId: number) => {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user';
      toast.error(message);
      throw error;
    }
  },

  updateUser: async (userId: number, data: {
    name?: string;
    email?: string;
    subscriptionStatus?: string;
    alertsToggle?: boolean;
    isVerified?: boolean;
  }) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, data);
      if (response.data.success) {
        toast.success('User updated successfully!');
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);
      throw error;
    }
  },

  getUserAIConversations: async (userId: number) => {
    try {
      const response = await apiClient.get(`/admin/users/${userId}/ai-conversations`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch AI conversations';
      toast.error(message);
      throw error;
    }
  },

  getUserRoutines: async (userId: number) => {
    try {
      const response = await apiClient.get(`/admin/users/${userId}/routines`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user routines';
      toast.error(message);
      throw error;
    }
  },

  getUserStreaks: async (userId: number) => {
    try {
      const response = await apiClient.get(`/users/${userId}/streaks`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user streaks';
      toast.error(message);
      throw error;
    }
  },
};

// Routines Services
export const routineService = {
  getAllRoutines: async () => {
    try {
      const response = await apiClient.get('/admin/routines');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch routines';
      toast.error(message);
      throw error;
    }
  },

  getAllUserStreaks: async () => {
    try {
      const response = await apiClient.get('/users/streaks/all'); // Get all user streaks
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch all user streaks';
      toast.error(message);
      throw error;
    }
  },
};

// Quotes Services
export const quotesService = {
  getAllMotivationalQuotes: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await apiClient.get('/admin/quotes/motivational', { params });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch quotes';
      toast.error(message);
      throw error;
    }
  },

  createMotivationalQuote: async (data: {
    quote: string;
    author?: string;
    month: number;
    day: number;
    theme?: string;
  }) => {
    try {
      const response = await apiClient.post('/admin/quotes/motivational', data);
      if (response.data.success) {
        toast.success('Quote created successfully!');
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create quote';
      toast.error(message);
      throw error;
    }
  },

  updateMotivationalQuote: async (quoteId: number, data: {
    quote?: string;
    author?: string;
    month?: number;
    day?: number;
    theme?: string;
  }) => {
    try {
      const response = await apiClient.put(`/admin/quotes/motivational/${quoteId}`, data);
      if (response.data.success) {
        toast.success('Quote updated successfully!');
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update quote';
      toast.error(message);
      throw error;
    }
  },

  deleteMotivationalQuote: async (quoteId: number) => {
    try {
      const response = await apiClient.delete(`/admin/quotes/motivational/${quoteId}`);
      if (response.data.success) {
        toast.success('Quote deleted successfully!');
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete quote';
      toast.error(message);
      throw error;
    }
  },
};

// Rewards Services
export const rewardsService = {
  getAllRewardEvents: async () => {
    try {
      const response = await apiClient.get('/admin/rewards/events');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch reward events';
      toast.error(message);
      throw error;
    }
  },

  updateRewardEvent: async (eventId: number, data: {
    event_code?: string;
    event_name?: string;
    event_description?: string;
    event_category?: string;
    points?: number;
    max_occurrences?: number;
    cooldown_hours?: number;
    is_active?: boolean;
    metadata?: any;
  }) => {
    try {
      const response = await apiClient.put(`/admin/rewards/event/${eventId}`, data);
      if (response.data.success) {
        toast.success('Reward event updated successfully!');
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update reward event';
      toast.error(message);
      throw error;
    }
  },

  createRewardEvent: async (data: {
    event_code: string;
    event_name: string;
    event_description?: string;
    event_category: string;
    points: number;
    max_occurrences?: number;
    cooldown_hours?: number;
    is_active?: boolean;
    metadata?: any;
  }) => {
    try {
      const response = await apiClient.post('/admin/rewards/events', data);
      if (response.data.success) {
        toast.success('Reward event created successfully!');
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create reward event';
      toast.error(message);
      throw error;
    }
  },

  deleteRewardEvent: async (eventId: number) => {
    try {
      const response = await apiClient.delete(`/admin/rewards/event/${eventId}`);
      if (response.data.success) {
        toast.success('Reward event deleted successfully!');
      }
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete reward event';
      toast.error(message);
      throw error;
    }
  },
};
