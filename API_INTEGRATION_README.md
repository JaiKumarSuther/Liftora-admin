# Liftora Admin Panel - API Integration

This document outlines the API integration implemented in the Liftora Admin Panel.

## Overview

The admin panel has been completely integrated with the backend APIs, removing all dummy data and implementing real-time data fetching using React Query and Axios.

## API Configuration

### API Clients
- **api8001**: User management services (port 8001)
- **api8002**: Authentication and analytics services (port 8002)  
- **api8003**: Routines, quotes, and rewards services (port 8003)
- **api8004**: Statistics services (port 8004)

### Authentication
- JWT token-based authentication
- Automatic token refresh and logout on 401 errors
- Token stored in Redux store and localStorage

## Implemented Features

### 1. Dashboard (`/dashboard`)
- **Real-time stats**: Total users, active users, revenue, AI interactions
- **Advanced analytics**: User growth, subscription trends, engagement metrics
- **User retention reports**: Cohort analysis and retention rates
- **Interactive charts**: Revenue trends, user growth over time

### 2. User Management (`/dashboard/user-management`)
- **User listing**: Paginated user list with search and filters
- **User details**: View complete user profiles and activity
- **User editing**: Update user information, subscription status, verification
- **AI conversations**: View user AI interaction history
- **User routines**: Monitor user-created routines
- **User streaks**: Track user streak progress

### 3. Motivational Quotes (`/dashboard/motivational-quotes`)
- **Quote management**: Create, read, update, delete motivational quotes
- **Quote scheduling**: Assign quotes to specific months and days
- **Theme categorization**: Organize quotes by themes
- **Author attribution**: Track quote authors

### 4. Rewards Management (`/dashboard/rewards-management`)
- **Reward events**: Create and manage reward event configurations
- **Point systems**: Configure points, cooldowns, and occurrence limits
- **Event categories**: Organize rewards by task, streak, social, achievement
- **Metadata support**: Store additional event configuration data

### 5. Streaks & Routines (`/dashboard/streaks-routines`)
- **Routine monitoring**: View all user-created routines
- **Streak tracking**: Monitor user streak progress and statistics
- **User activity**: Track routine completion and streak maintenance
- **Performance metrics**: Calculate average streaks and engagement

### 6. AI Interactions (`/dashboard/ai-interactions`)
- **User overview**: List users with AI interaction capabilities
- **Conversation access**: View individual user AI conversation history
- **Usage analytics**: Track AI interaction patterns and frequency

### 7. Billing & Analytics (`/dashboard/billing-analytics`)
- **Revenue tracking**: Monitor total revenue and subscription income
- **Subscription analytics**: Track active, cancelled, and inactive subscriptions
- **Conversion metrics**: Calculate conversion rates and average revenue per user
- **Revenue trends**: Visualize revenue growth over time

### 8. Subscription Management (`/dashboard/subscription-management`)
- **Subscription overview**: Manage all user subscriptions
- **Status management**: Update subscription status (active, inactive, cancelled)
- **Plan management**: Switch users between free, premium, and pro plans
- **Billing information**: Track payment history and next billing dates

## API Endpoints Used

### Authentication
- `POST /api/v2/admin/login` - Admin login

### Statistics & Analytics
- `GET /api/v2/admin/stats` - Dashboard statistics
- `GET /api/v2/admin/analytics/advanced` - Advanced analytics
- `GET /api/v2/admin/analytics/user-retention` - User retention reports

### User Management
- `GET /api/v2/admin/users` - List users with pagination and filters
- `GET /api/v2/admin/users/:id` - Get user details
- `PUT /api/v2/admin/users/:id` - Update user information
- `GET /api/v2/admin/users/:id/ai-conversations` - Get user AI conversations
- `GET /api/v2/admin/users/:id/routines` - Get user routines
- `GET /api/v2/admin/users/:id/streaks` - Get user streaks

### Content Management
- `GET /api/v2/admin/quotes/motivational` - List motivational quotes
- `POST /api/v2/admin/quotes/motivational` - Create motivational quote
- `PUT /api/v2/admin/quotes/motivational/:id` - Update motivational quote
- `DELETE /api/v2/admin/quotes/motivational/:id` - Delete motivational quote

### Rewards System
- `GET /api/v2/admin/rewards/events` - List reward events
- `POST /api/v2/admin/rewards/events` - Create reward event
- `PUT /api/v2/admin/rewards/event/:id` - Update reward event
- `DELETE /api/v2/admin/rewards/event/:id` - Delete reward event

### Routines & Streaks
- `GET /api/v2/admin/routines` - List all routines
- `GET /api/v2/admin/users/:id/streaks` - Get user streaks

## Error Handling

- **Network errors**: Automatic retry with exponential backoff
- **Authentication errors**: Automatic logout and redirect to login
- **Server errors**: User-friendly error messages with toast notifications
- **Validation errors**: Form validation with real-time feedback

## Toast Notifications

All API operations include toast notifications using Sonner:
- **Success**: Green toast for successful operations
- **Error**: Red toast for failed operations
- **Loading**: Loading states during API calls

## Data Caching

React Query provides intelligent caching:
- **Stale time**: 2-10 minutes depending on data type
- **Cache invalidation**: Automatic cache updates after mutations
- **Background refetching**: Keep data fresh without user interaction
- **Optimistic updates**: Immediate UI updates for better UX

## Security Features

- **JWT token management**: Secure token storage and transmission
- **Request interceptors**: Automatic token attachment to requests
- **Response interceptors**: Handle authentication errors globally
- **Input validation**: Client-side validation for all forms

## Performance Optimizations

- **Parallel queries**: Multiple API calls executed simultaneously
- **Pagination**: Efficient data loading for large datasets
- **Debounced search**: Optimized search with debouncing
- **Lazy loading**: Components loaded only when needed
- **Memoization**: Expensive calculations cached with useMemo

## Development Notes

- All API calls are typed with TypeScript interfaces
- Error boundaries catch and handle component errors
- Loading states provide smooth user experience
- Responsive design works on all device sizes
- Dark theme optimized for admin usage

## Getting Started

1. Ensure backend services are running on ports 8001-8004
2. Update API base URLs in `utils/apiClient.ts` if needed
3. Configure authentication tokens in Redux store
4. Start the admin panel with `npm run dev`

The admin panel is now fully integrated with the backend APIs and ready for production use.
