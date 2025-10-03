// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatarUrl?: string;
}

export interface UserTableData {
  id: string; // Account ID (e.g., #876213)
  name: string;
  email: string;
  accountCreated: string; // e.g., '12 Dec, 2020'
  status: 'Active' | 'Inactive' | 'Banned' | 'Warning' | 'Deleted';
  avatarUrl?: string;
}

// Authentication types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface EditUserFormData {
  name?: string;
  email?: string;
  fullName?: string;
  contact?: string;
  gender?: string;
  age?: number;
  country?: string;
  bio?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  status: 'Active' | 'Inactive' | 'Banned' | 'Warning';
}

// Event Management types
export interface EventEntry {
  id: string; // e.g., '#876123'
  eventName: string; // Event name
  createdById: string; // creator id displayed in header checkbox row
  eventType: string; // Type of event
  description: string; // Event description
  location: string; // e.g., '21, Broad Street NY'
  repeat: string; // Repeat frequency
  date: string; // e.g., '12 Dec, 2020'
  time: string; // e.g., '3pm'
  participants: number; // Number of participants
  status?: 'pending' | 'approved' | 'rejected' | 'flagged'; // Event status
}

// KPI and Report types
export interface KPIData {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

export interface ReportData {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
}

// Component prop types
export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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

// Admin API Types
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  subscriptionStatus: string | null;
  createdAt: string;
  isVerified: number; // 0 or 1 from API
  alertsToggle: number; // 0 or 1 from API
  profilePic: string | null;
}

export interface AdminSubscription {
  id: number;
  userId: number;
  status: string;
  plan: string;
  totalPaid: number;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  billingCycle?: string;
  amount?: number;
  nextBillingDate?: string;
}

export interface AdminStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    newThisMonth: number;
  };
  subscriptions: {
    total: number;
    active: number;
    cancelled: number;
    revenue: {
      total: number;
      monthlyTrend: Array<{ month: string; revenue: number }>;
    };
  };
  rewards: {
    total: number;
    avgGemsPerUser: number;
  };
  content: {
    totalQuotes: number;
    totalAIQuotes: number;
    notifications: number;
  };
  growth: {
    dailySignups: Array<{ date: string; count: number }>;
  };
}

export interface MotivationalQuote {
  id: number;
  quote: string;
  author?: string;
  month: number;
  day: number;
  sequential_day?: number;
  theme?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RewardEvent {
  id: number;
  event_code: string;
  event_name: string;
  event_description?: string;
  event_category: string;
  points: number;
  max_occurrences?: number;
  cooldown_hours?: number;
  is_active: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoutine {
  id: number;
  user_id: number;
  name?: string;
  description?: string;
  tasks: any[];
  createdAt: string;
  updatedAt: string;
}

export interface UserStreak {
  id: number;
  user_id: number;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIConversation {
  id: number;
  user_id: number;
  prompt: string;
  response: string;
  createdAt: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

// Backend API entity types (minimal shapes used in mappings)
export interface BackendHostEvent {
  id: string | number;
  userId: string | number;
  eventName: string;
  eventType: string;
  description: string;
  number_of_guest?: number | null;
  location: string;
  repeat: string;
  date: string | Date;
  time: string;
  status?: 'pending' | 'approved' | 'rejected' | 'flagged';
}

export interface BackendUser {
  id: string | number;
  fullName?: string | null;
  name?: string | null;
  email: string;
  createdAt: string | Date;
  isOnline?: boolean;
  status?: 'Active' | 'Inactive' | 'Banned' | 'Warning' | 'Deleted';
}

// User Management Action types
export interface UserAction {
  type: 'ban' | 'warning' | 'activate' | 'deactivate';
  userId: string;
  reason?: string;
  emailSubject?: string;
  emailMessage?: string;
}

export interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  actionType: 'ban' | 'warning' | 'status_change';
}

// Content Moderation types
export interface ContentFlag {
  id: string;
  reporterId: string;
  contentType: 'post' | 'event' | 'comment' | 'message';
  contentId: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'fake' | 'violence' | 'hate_speech' | 'adult_content' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminAction?: 'approved' | 'removed' | 'warned' | 'no_action';
  adminNotes?: string;
  createdAt: string;
  reporter?: {
    fullName: string;
    email: string;
  };
  reviewer?: {
    fullName: string;
    email: string;
  };
}

// User Reports types
export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportType: 'inappropriate_behavior' | 'harassment' | 'fake_profile' | 'spam' | 'scam' | 'underage' | 'violence' | 'hate_speech' | 'other';
  description?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  adminAction?: 'no_action' | 'warning' | 'suspension' | 'ban' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
  reporter?: {
    fullName: string;
    email: string;
  };
  reportedUser?: {
    fullName: string;
    email: string;
  };
  reviewer?: {
    fullName: string;
    email: string;
  };
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  eventId?: string;
  amount: number;
  currency: string;
  paymentType: 'deposit' | 'refund' | 'payout' | 'fee' | 'commission';
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  description?: string;
  processedAt?: string;
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
  event?: {
    eventName: string;
    eventType: string;
  };
}
