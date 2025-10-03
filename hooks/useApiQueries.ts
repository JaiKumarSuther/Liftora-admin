import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  statsService, 
  userService, 
  quotesService, 
  rewardsService, 
  routineService 
} from '@/utils/apiServices';
import { 
  AdminStats, 
  AdminUser, 
  MotivationalQuote, 
  RewardEvent, 
  UserRoutine, 
  UserStreak, 
  AIConversation 
} from '@/types';

// Query Keys
export const queryKeys = {
  stats: ['stats'] as const,
  advancedAnalytics: ['analytics', 'advanced'] as const,
  userRetention: ['analytics', 'user-retention'] as const,
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  userAIConversations: (id: number) => ['users', id, 'ai-conversations'] as const,
  userRoutines: (id: number) => ['users', id, 'routines'] as const,
  userStreaks: (id: number) => ['users', id, 'streaks'] as const,
  allRoutines: ['routines'] as const,
  allUserStreaks: ['user-streaks'] as const,
  quotes: ['quotes'] as const,
  quote: (id: number) => ['quotes', id] as const,
  rewardEvents: ['reward-events'] as const,
  rewardEvent: (id: number) => ['reward-events', id] as const,
};

// Stats Hooks
export const useStats = (params?: {
  startDate?: string;
  endDate?: string;
  subscriptionStatus?: string;
  planType?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.stats, params],
    queryFn: () => statsService.getStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdvancedAnalytics = (params?: {
  startDate?: string;
  endDate?: string;
  interval?: 'day' | 'week' | 'month';
}) => {
  return useQuery({
    queryKey: [...queryKeys.advancedAnalytics, params],
    queryFn: () => statsService.getAdvancedAnalytics(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserRetentionReport = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.userRetention, params],
    queryFn: () => statsService.getUserRetentionReport(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// User Hooks
export const useUsers = (params?: {
  status?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...queryKeys.users, params],
    queryFn: () => userService.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });
};

export const useUserAIConversations = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.userAIConversations(userId),
    queryFn: () => userService.getUserAIConversations(userId),
    enabled: !!userId,
  });
};

export const useUserRoutines = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.userRoutines(userId),
    queryFn: () => userService.getUserRoutines(userId),
    enabled: !!userId,
  });
};

export const useUserStreaks = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.userStreaks(userId),
    queryFn: () => userService.getUserStreaks(userId),
    enabled: !!userId,
  });
};

// User Mutations
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: any }) => 
      userService.updateUser(userId, data),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

// Routines Hooks
export const useAllRoutines = () => {
  return useQuery({
    queryKey: queryKeys.allRoutines,
    queryFn: () => routineService.getAllRoutines(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllUserStreaks = () => {
  return useQuery({
    queryKey: queryKeys.allUserStreaks,
    queryFn: () => routineService.getAllUserStreaks(),
    staleTime: 5 * 60 * 1000,
  });
};

// Quotes Hooks
export const useMotivationalQuotes = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...queryKeys.quotes, params],
    queryFn: () => quotesService.getAllMotivationalQuotes(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quotesService.createMotivationalQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes });
    },
  });
};

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quoteId, data }: { quoteId: number; data: any }) => 
      quotesService.updateMotivationalQuote(quoteId, data),
    onSuccess: (_, { quoteId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quote(quoteId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes });
    },
  });
};

export const useDeleteQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quotesService.deleteMotivationalQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes });
    },
  });
};

// Rewards Hooks
export const useRewardEvents = () => {
  return useQuery({
    queryKey: queryKeys.rewardEvents,
    queryFn: () => rewardsService.getAllRewardEvents(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRewardEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rewardsService.createRewardEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rewardEvents });
    },
  });
};

export const useUpdateRewardEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: number; data: any }) => 
      rewardsService.updateRewardEvent(eventId, data),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rewardEvent(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.rewardEvents });
    },
  });
};

export const useDeleteRewardEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rewardsService.deleteRewardEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rewardEvents });
    },
  });
};
