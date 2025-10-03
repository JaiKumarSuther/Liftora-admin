# Liftora Admin Panel - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend Components](#frontend-components)
4. [Dashboard Pages](#dashboard-pages)
5. [API Integration](#api-integration)
6. [Backend Endpoints](#backend-endpoints)
7. [Authentication System](#authentication-system)
8. [State Management](#state-management)
9. [UI/UX Components](#uiux-components)
10. [Error Handling](#error-handling)
11. [Performance Optimizations](#performance-optimizations)
12. [Development Guidelines](#development-guidelines)

## Overview

The Liftora Admin Panel is a comprehensive React-based administrative interface built with Next.js 14, providing real-time management capabilities for the Liftora fitness and productivity application. The panel features a modern dark theme, responsive design, and full integration with backend APIs.

### Key Features
- **Real-time Dashboard** with analytics and KPIs
- **User Management** with advanced filtering and search
- **Content Management** for motivational quotes
- **Rewards System** administration
- **Subscription Management** with billing integration
- **AI Interactions** monitoring
- **Streaks & Routines** tracking
- **Comprehensive Analytics** and reporting

## Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Redux Toolkit, React Query
- **HTTP Client**: Axios with interceptors
- **Icons**: React Icons (Feather Icons)
- **Notifications**: Sonner
- **Authentication**: JWT tokens with Redux store

### Project Structure
```
Liftora-Admin/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard pages
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # Reusable components
│   ├── UI/                     # UI components
│   ├── context/                # React contexts
│   └── auth/                   # Authentication components
├── utils/                       # Utility functions
├── types/                       # TypeScript definitions
├── store/                       # Redux store
├── hooks/                       # Custom React hooks
└── constants/                   # Application constants
```

## Frontend Components

### Core UI Components

#### 1. Header Component (`components/UI/Header.tsx`)
- **Purpose**: Top navigation bar with user profile dropdown
- **Features**: 
  - Responsive design with mobile optimization
  - User avatar display with fallback initials
  - Dropdown menu for user actions
  - Dynamic title display

#### 2. Sidebar Component (`components/UI/Sidebar.tsx`)
- **Purpose**: Main navigation sidebar
- **Features**:
  - 8 main navigation items
  - Mobile-responsive with overlay
  - Active state management
  - Loading states during navigation
  - Logo display

#### 3. Modal Component (`components/UI/Modal.tsx`)
- **Purpose**: Reusable modal dialog
- **Features**:
  - Backdrop click to close
  - Keyboard escape support
  - Customizable title and content
  - Animation support

#### 4. LoadingSpinner Component (`components/UI/LoadingSpinner.tsx`)
- **Purpose**: Loading indicator
- **Features**:
  - Multiple sizes (sm, md, lg)
  - Customizable colors
  - Smooth animations

### Data Display Components

#### 5. UserTable Component (`components/UI/UserTable.tsx`)
- **Purpose**: Display user data in tabular format
- **Features**:
  - Sortable columns
  - Action buttons (view, edit, delete)
  - Status badges
  - Responsive design

#### 6. FilterDropdown Component (`components/UI/FilterDropdown.tsx`)
- **Purpose**: Filter selection dropdown
- **Features**:
  - Custom options
  - Search functionality
  - Keyboard navigation
  - Clear selection option

#### 7. SearchBar Component (`components/UI/SearchBar.tsx`)
- **Purpose**: Search input with debouncing
- **Features**:
  - Real-time search
  - Debounced input (300ms)
  - Clear button
  - Loading states

### Chart and Analytics Components

#### 8. AnimatedChart Component (`components/UI/AnimatedChart.tsx`)
- **Purpose**: Data visualization with animations
- **Features**:
  - Line and bar chart support
  - Smooth animations
  - Responsive design
  - Customizable colors

#### 9. KPICard Component (`components/UI/KPICard.tsx`)
- **Purpose**: Key Performance Indicator display
- **Features**:
  - Icon integration
  - Color-coded backgrounds
  - Trend indicators
  - Hover effects

#### 10. LineChart Component (`components/UI/LineChart.tsx`)
- **Purpose**: Time-series data visualization
- **Features**:
  - Interactive tooltips
  - Responsive scaling
  - Multiple data series
  - Custom styling

### Specialized Components

#### 11. EventTable Component (`components/UI/EventTable.tsx`)
- **Purpose**: Event management display
- **Features**:
  - Status filtering
  - Date formatting
  - Action buttons
  - Pagination

#### 12. PaymentTable Component (`components/UI/PaymentTable.tsx`)
- **Purpose**: Payment history display
- **Features**:
  - Transaction status
  - Amount formatting
  - Date sorting
  - Export functionality

## Dashboard Pages

### 1. Main Dashboard (`app/dashboard/page.tsx`)
- **Route**: `/dashboard`
- **Purpose**: Overview of all system metrics
- **Features**:
  - Real-time KPI cards
  - User growth charts
  - Revenue analytics
  - Engagement metrics
  - Recent activity feed

**API Integrations**:
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/analytics/advanced` - Advanced analytics
- `GET /admin/analytics/user-retention` - User retention data

### 2. User Management (`app/dashboard/user-management/page.tsx`)
- **Route**: `/dashboard/user-management`
- **Purpose**: Comprehensive user administration
- **Features**:
  - User listing with pagination
  - Advanced search and filtering
  - User profile management
  - Subscription status updates
  - Verification management
  - AI conversation history
  - User routines and streaks

**API Integrations**:
- `GET /admin/users` - User listing with filters
- `GET /admin/users/:id` - User details
- `PUT /admin/users/:id` - Update user
- `GET /admin/users/:id/ai-conversations` - AI conversations
- `GET /admin/users/:id/routines` - User routines
- `GET /admin/users/:id/streaks` - User streaks

### 3. Motivational Quotes (`app/dashboard/motivational-quotes/page.tsx`)
- **Route**: `/dashboard/motivational-quotes`
- **Purpose**: Content management for motivational quotes
- **Features**:
  - Quote CRUD operations
  - Month/day scheduling
  - Author attribution
  - Theme categorization
  - Bulk operations

**API Integrations**:
- `GET /admin/quotes/motivational` - List quotes
- `POST /admin/quotes/motivational` - Create quote
- `PUT /admin/quotes/motivational/:id` - Update quote
- `DELETE /admin/quotes/motivational/:id` - Delete quote

### 4. Rewards Management (`app/dashboard/rewards-management/page.tsx`)
- **Route**: `/dashboard/rewards-management`
- **Purpose**: Rewards system administration
- **Features**:
  - Reward event configuration
  - Points system management
  - Cooldown settings
  - Occurrence limits
  - Event categorization

**API Integrations**:
- `GET /admin/rewards/events` - List reward events
- `POST /admin/rewards/events` - Create reward event
- `PUT /admin/rewards/event/:id` - Update reward event
- `DELETE /admin/rewards/event/:id` - Delete reward event

### 5. AI Interactions (`app/dashboard/ai-interactions/page.tsx`)
- **Route**: `/dashboard/ai-interactions`
- **Purpose**: AI conversation monitoring
- **Features**:
  - User AI interaction overview
  - Conversation history access
  - Usage analytics
  - Performance metrics

### 6. Billing & Analytics (`app/dashboard/billing-analytics/page.tsx`)
- **Route**: `/dashboard/billing-analytics`
- **Purpose**: Financial analytics and reporting
- **Features**:
  - Revenue tracking
  - Subscription analytics
  - Conversion metrics
  - Revenue trends visualization

### 7. Streaks & Routines (`app/dashboard/streaks-routines/page.tsx`)
- **Route**: `/dashboard/streaks-routines`
- **Purpose**: User activity monitoring
- **Features**:
  - Routine monitoring
  - Streak tracking
  - Performance metrics
  - User engagement analysis

**API Integrations**:
- `GET /admin/routines` - List all routines
- `GET /admin/users/:id/streaks` - User streaks
- `GET /users/streaks/all` - All user streaks

### 8. Subscription Management (`app/dashboard/subscription-management/page.tsx`)
- **Route**: `/dashboard/subscription-management`
- **Purpose**: Subscription lifecycle management
- **Features**:
  - Subscription overview
  - Status management
  - Plan switching
  - Billing information
  - Payment history

**API Integrations**:
- `GET /admin/subscriptions` - List subscriptions
- `POST /admin/subscriptions/cancel/:id` - Cancel subscription
- `POST /admin/subscriptions/pause/:id` - Pause subscription
- `POST /admin/subscriptions/resume/:id` - Resume subscription
- `POST /admin/subscriptions/update-plan/:id` - Update plan

### 9. Settings (`app/dashboard/settings/page.tsx`)
- **Route**: `/dashboard/settings`
- **Purpose**: System configuration
- **Features**:
  - Admin profile management
  - Password updates
  - System preferences
  - Notification settings

**API Integrations**:
- `GET /admin/profile` - Get admin profile
- `PUT /admin/profile` - Update admin profile
- `PUT /admin/password` - Update password

## API Integration

### API Client Configuration (`utils/apiClient.ts`)
- **Base URL**: Configurable via environment variables
- **Version**: API v2
- **Timeout**: 10 seconds default
- **Interceptors**: Request and response handling

**Request Interceptor**:
- Automatic JWT token attachment
- Token retrieval from Redux store

**Response Interceptor**:
- 401 error handling with automatic logout
- Server error notifications
- Network error handling

### API Services (`utils/apiServices.ts`)

#### Authentication Services
```typescript
authService.login(email: string, password: string)
```

#### Statistics Services
```typescript
statsService.getStats(params)
statsService.getAdvancedAnalytics(params)
statsService.getUserRetentionReport(params)
```

#### User Services
```typescript
userService.getUsers(params)
userService.getUserById(userId)
userService.updateUser(userId, data)
userService.getUserAIConversations(userId)
userService.getUserRoutines(userId)
userService.getUserStreaks(userId)
```

#### Content Services
```typescript
quotesService.getAllMotivationalQuotes(params)
quotesService.createMotivationalQuote(data)
quotesService.updateMotivationalQuote(quoteId, data)
quotesService.deleteMotivationalQuote(quoteId)
```

#### Rewards Services
```typescript
rewardsService.getAllRewardEvents()
rewardsService.createRewardEvent(data)
rewardsService.updateRewardEvent(eventId, data)
rewardsService.deleteRewardEvent(eventId)
```

#### Routine Services
```typescript
routineService.getAllRoutines()
routineService.getAllUserStreaks()
```

### Custom Hooks (`hooks/useApiQueries.ts`)
- React Query integration for data fetching
- Automatic caching and background updates
- Error handling and loading states
- Optimistic updates for mutations

**Available Hooks**:
- `useStats()` - Dashboard statistics
- `useUsers()` - User management
- `useUpdateUser()` - User updates
- `useAdvancedAnalytics()` - Analytics data
- `useQuotes()` - Motivational quotes
- `useRewards()` - Rewards data

## Backend Endpoints

### Admin Routes (`/api/v2/admin/`)

#### Authentication
- `POST /admin/login` - Admin authentication

#### Statistics & Analytics
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/analytics/advanced` - Advanced analytics
- `GET /admin/analytics/user-retention` - User retention reports

#### User Management
- `GET /admin/users` - List users with pagination
- `GET /admin/users/:id` - Get user details
- `PUT /admin/users/:id` - Update user information
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/users/:id/ai-conversations` - User AI conversations
- `GET /admin/users/:id/routines` - User routines
- `GET /admin/users/:id/streaks` - User streaks
- `GET /admin/users/streaks/all` - All user streaks

#### Content Management
- `GET /admin/quotes/motivational` - List motivational quotes
- `POST /admin/quotes/motivational` - Create motivational quote
- `PUT /admin/quotes/motivational/:id` - Update motivational quote
- `DELETE /admin/quotes/motivational/:id` - Delete motivational quote

#### Rewards System
- `GET /admin/rewards/events` - List reward events
- `POST /admin/rewards/events` - Create reward event
- `GET /admin/rewards/event/:id` - Get reward event
- `PUT /admin/rewards/event/:id` - Update reward event
- `DELETE /admin/rewards/event/:id` - Delete reward event

#### Subscription Management
- `GET /admin/subscriptions` - List subscriptions
- `GET /admin/subscriptions/:id/status` - Get subscription status
- `POST /admin/subscriptions/cancel/:id` - Cancel subscription
- `POST /admin/subscriptions/pause/:id` - Pause subscription
- `POST /admin/subscriptions/resume/:id` - Resume subscription
- `POST /admin/subscriptions/update-plan/:id` - Update subscription plan
- `POST /admin/subscriptions/create` - Create subscription

#### Notifications
- `POST /admin/notifications` - Create notification
- `GET /admin/notifications` - Get all notifications
- `POST /admin/send-email` - Send email notification

#### Admin Profile
- `GET /admin/profile` - Get admin profile
- `PUT /admin/profile` - Update admin profile
- `PUT /admin/password` - Update admin password

### Backend Modules

#### Admin Module (`app/admin/`)
- `admin.controller.js` - Main admin logic
- `admin.routes.js` - Route definitions
- `admin.authenticate.js` - Admin authentication middleware

#### User Module (`app/user/`)
- User CRUD operations
- Profile management
- Authentication handling

#### Rewards Module (`app/rewards/`)
- Reward event management
- User rewards tracking
- Points system

#### Motivational Quotes Module (`app/motivational-quotes/`)
- Quote management
- AI-generated quotes
- Scheduling system

#### Streak Module (`app/streak/`)
- Streak tracking
- User activity monitoring

#### Billing Module (`app/billing/`)
- Subscription management
- Payment processing
- Stripe integration

## Authentication System

### Frontend Authentication
- **Context Provider**: `AuthContext` with React Context API
- **State Management**: Redux store for token persistence
- **Token Storage**: localStorage for persistence
- **Route Protection**: `ProtectedRoute` component
- **Automatic Logout**: On 401 responses

### Authentication Flow
1. User submits login credentials
2. API validates credentials
3. JWT token returned and stored
4. Token attached to all subsequent requests
5. Automatic refresh and logout handling

### Security Features
- JWT token expiration handling
- Automatic token refresh
- Secure token storage
- Request/response interceptors
- CSRF protection via token validation

## State Management

### Redux Store (`store/index.ts`)
- **Auth Slice**: Authentication state management
- **Token Persistence**: Automatic save/restore
- **Middleware**: Redux Persist for localStorage

### React Query Integration
- **Caching**: Intelligent data caching
- **Background Updates**: Automatic data refresh
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Centralized error management

## UI/UX Components

### Design System
- **Color Scheme**: Dark theme with coral accents
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing system
- **Animations**: Framer Motion for smooth transitions

### Responsive Design
- **Mobile-First**: Responsive breakpoints
- **Touch-Friendly**: Mobile-optimized interactions
- **Adaptive Layout**: Flexible grid system
- **Progressive Enhancement**: Feature detection

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and roles
- **Color Contrast**: WCAG compliant colors
- **Focus Management**: Visible focus indicators

## Error Handling

### API Error Handling
- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Automatic logout and redirect
- **Server Errors**: User-friendly error messages
- **Validation Errors**: Real-time form validation

### UI Error Handling
- **Error Boundaries**: Component-level error catching
- **Toast Notifications**: User feedback for actions
- **Loading States**: Smooth loading experiences
- **Fallback UI**: Graceful degradation

### Error Types
- **Network Errors**: Connection issues
- **Validation Errors**: Form input validation
- **Server Errors**: Backend processing errors
- **Authentication Errors**: Token expiration

## Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Component lazy loading
- **Memoization**: React.memo and useMemo
- **Virtual Scrolling**: Large list optimization
- **Image Optimization**: Next.js Image component

### API Optimizations
- **Parallel Queries**: Simultaneous API calls
- **Pagination**: Efficient data loading
- **Debounced Search**: Optimized search queries
- **Caching**: React Query intelligent caching
- **Background Refetching**: Keep data fresh

### Bundle Optimizations
- **Tree Shaking**: Unused code elimination
- **Compression**: Gzip/Brotli compression
- **CDN**: Static asset delivery
- **Service Workers**: Offline functionality

## Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Component Guidelines
- **Functional Components**: React hooks only
- **Props Interface**: TypeScript interfaces
- **Error Boundaries**: Component error handling
- **Loading States**: Consistent loading patterns

### API Integration Guidelines
- **Service Layer**: Centralized API calls
- **Error Handling**: Consistent error patterns
- **Loading States**: User feedback
- **Caching Strategy**: Appropriate cache settings

### Testing Guidelines
- **Unit Tests**: Component testing
- **Integration Tests**: API integration
- **E2E Tests**: User workflow testing
- **Performance Tests**: Load testing

## Environment Configuration

### Required Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://liftora-production-0730.up.railway.app
NEXT_PUBLIC_API_VERSION=v2
NEXT_PUBLIC_API_TIMEOUT=10000
JWT_SECRET_KEY=your-jwt-secret
```

### Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development server: `npm run dev`
5. Access admin panel: `http://localhost:3000`

### Production Deployment
1. Build application: `npm run build`
2. Configure production environment
3. Deploy to hosting platform
4. Configure domain and SSL
5. Monitor application performance

## Security Considerations

### Frontend Security
- **Input Validation**: Client-side validation
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based protection
- **Secure Headers**: Security headers configuration

### API Security
- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **Rate Limiting**: Request throttling
- **Input Sanitization**: Server-side validation

### Data Protection
- **Encryption**: Sensitive data encryption
- **Secure Storage**: Secure token storage
- **Data Privacy**: GDPR compliance
- **Audit Logging**: Activity tracking

## Monitoring and Analytics

### Application Monitoring
- **Error Tracking**: Real-time error monitoring
- **Performance Metrics**: Application performance
- **User Analytics**: Usage patterns
- **API Monitoring**: Backend performance

### Business Analytics
- **User Metrics**: User growth and engagement
- **Revenue Tracking**: Financial performance
- **Content Analytics**: Content performance
- **Feature Usage**: Feature adoption rates

## Troubleshooting

### Common Issues
1. **Authentication Failures**: Check token validity
2. **API Errors**: Verify backend connectivity
3. **Loading Issues**: Check network connection
4. **UI Rendering**: Verify component props

### Debug Tools
- **React DevTools**: Component inspection
- **Redux DevTools**: State management debugging
- **Network Tab**: API request monitoring
- **Console Logs**: Error tracking

### Support Resources
- **Documentation**: Comprehensive API docs
- **Error Logs**: Detailed error information
- **Performance Metrics**: Application monitoring
- **User Feedback**: Issue reporting system

---

This documentation provides a complete overview of the Liftora Admin Panel, covering all components, API integrations, and system architecture. For specific implementation details, refer to the individual component files and API documentation.
