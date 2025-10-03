// Color constants - Dark theme design system
export const COLORS = {
  PRIMARY: {
    MAIN: '#FF6B6B', // Coral/salmon red for CTAs, active states, and highlights
    HOVER: '#FF5252', // Darker coral for hover states
    LIGHT: '#FF8787', // Lighter coral for accents
  },
  BACKGROUND: {
    APP: '#0F0F0F', // Main app background
    SIDEBAR: '#1A1A1A', // Sidebar background
    CARD: '#1A1A1A', // Card background
    ELEVATED: '#242424', // Elevated elements background
    INPUT: '#242424', // Input background
    HOVER: '#2D2D2D', // Hover states
  },
  TEXT: {
    PRIMARY: '#FFFFFF', // Primary text color
    SECONDARY: '#B0B0B0', // Secondary text color
    TERTIARY: '#808080', // Tertiary text color
    DISABLED: '#5A5A5A', // Disabled text color
  },
  BORDER: {
    PRIMARY: '#2A2A2A', // Primary border color
    SECONDARY: '#3A3A3A', // Secondary border color
    FOCUS: '#FF6B6B', // Focus border color
  },
  SEMANTIC: {
    SUCCESS: {
      MAIN: '#4CAF50',
      BG: 'rgba(76,175,80,0.15)',
      BORDER: 'rgba(76,175,80,0.3)',
    },
    WARNING: {
      MAIN: '#FFA726',
      BG: 'rgba(255,167,38,0.15)',
      BORDER: 'rgba(255,167,38,0.3)',
    },
    ERROR: {
      MAIN: '#EF5350',
      BG: 'rgba(239,83,80,0.15)',
      BORDER: 'rgba(239,83,80,0.3)',
    },
    INFO: {
      MAIN: '#29B6F6',
      BG: 'rgba(41,182,246,0.15)',
      BORDER: 'rgba(41,182,246,0.3)',
    },
  },
  SIDEBAR: {
    ACTIVE: '#FF6B6B', // Active sidebar item
    HOVER: '#242424', // Hover sidebar item
  },
} as const;

// Navigation constants
export const NAVIGATION = {
  ITEMS: [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'user-management', label: 'User Management', path: '/dashboard/user-management' },
    { id: 'event-management', label: 'Event Management', path: '/dashboard/event-management' },
  ],
  BOTTOM_ITEMS: [
    { id: 'settings', label: 'Settings' },
    { id: 'logout', label: 'Logout' },
  ],
} as const;

// Form validation constants
export const VALIDATION = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MESSAGE: 'Password must be at least 8 characters long',
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/user/signin',
    LOGOUT: '/user/logout',
    FORGOT_PASSWORD: '/user/resetPassword',
    SIGNUP: '/user/signup',
  },
  USERS: {
    LIST: '/user/getUsers',
    UPDATE: '/user/editUser',
    DELETE: '/user/account',
    UPLOAD_PROFILE_PIC: '/user/profilePic',
  },
  REPORTS: {
    DOWNLOAD: '/reports/download',
  },
  ADMIN: {
    STATS: '/admin/stats',
    DASHBOARD_ANALYTICS: '/admin/dashboard-analytics',
    PROFILE: '/admin/profile',
    PASSWORD: '/admin/password',
  }
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REMEMBER_ME: 'remember_me',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
  PASSWORD_RESET: 'Password reset link sent to your email.',
  USER_UPDATED: 'User updated successfully.',
  ACCOUNT_CREATED: 'Account created successfully!',
} as const;
