# Authentication System Documentation

This document explains the complete JWT-based authentication system implemented in the Liftora Admin Panel.

## Overview

The authentication system uses JWT tokens stored in HTTP-only cookies for secure authentication, with middleware protection and client-side route guards.

## Components

### 1. JWT Token Management (`utils/auth.ts`)

**Functions:**
- `decodeJWT(token)` - Decode JWT payload
- `isValidJWT(token)` - Check if token is valid and not expired
- `getTokenFromCookies()` - Get token from browser cookies
- `setTokenInCookies(token)` - Set token in cookies with security flags
- `clearTokenFromCookies()` - Clear authentication cookie
- `isAuthenticated()` - Check if user is authenticated
- `getUserFromToken()` - Extract user info from token

**Security Features:**
- Token expiration validation
- Secure cookie settings (SameSite, Secure, HttpOnly)
- 30-day token expiration

### 2. Middleware Protection (`middleware.ts`)

**Features:**
- JWT token validation on server-side
- Automatic redirect for unauthenticated users
- Protection of dashboard routes
- Prevention of accessing auth pages when logged in

**Routes Protected:**
- `/dashboard/*` - Requires valid JWT token
- `/` - Redirects to dashboard if authenticated

**Token Validation:**
- Checks JWT structure (3 parts)
- Validates expiration time
- Handles malformed tokens gracefully

### 3. AuthContext (`components/context/AuthContext.tsx`)

**Features:**
- Centralized authentication state management
- Automatic token validation on app load
- Cookie and localStorage synchronization
- Login/logout functionality

**State Management:**
- User information
- Loading states
- Token management
- Redux integration

### 4. Protected Routes (`components/ProtectedRoute.tsx`)

**Features:**
- Client-side route protection
- Loading states during authentication checks
- Automatic redirects based on auth status
- Configurable authentication requirements

**Usage:**
```tsx
// Protect routes that require authentication
<ProtectedRoute requireAuth={true}>
  <DashboardContent />
</ProtectedRoute>

// Protect auth pages (redirect if already logged in)
<ProtectedRoute requireAuth={false}>
  <LoginForm />
</ProtectedRoute>
```

## Authentication Flow

### Login Process

1. **User submits credentials** → LoginForm
2. **API call to backend** → `/api/v2/admin/login`
3. **JWT token received** → AuthContext
4. **Token stored in cookies** → `setTokenInCookies()`
5. **User state updated** → Redux store
6. **Redirect to dashboard** → `router.replace('/dashboard')`

### Logout Process

1. **User clicks logout** → UI component
2. **Clear user state** → AuthContext
3. **Clear cookies** → `clearTokenFromCookies()`
4. **Clear localStorage** → Remove stored data
5. **Redirect to login** → `router.replace('/')`

### Route Protection

1. **User navigates to protected route** → Next.js router
2. **Middleware checks cookie** → `middleware.ts`
3. **Token validation** → `isValidJWT()`
4. **Allow/deny access** → Redirect or continue

## Security Features

### Cookie Security
```typescript
// Secure cookie settings
auth_token=${token}; path=/; SameSite=Lax; max-age=2592000; Secure; HttpOnly=false
```

- **SameSite=Lax** - CSRF protection
- **Secure** - HTTPS only (production)
- **max-age=2592000** - 30-day expiration
- **HttpOnly=false** - Client-side access for validation

### JWT Validation
- **Structure validation** - Ensures 3-part JWT format
- **Expiration check** - Prevents expired token usage
- **Error handling** - Graceful fallback for invalid tokens

### Route Protection
- **Server-side** - Middleware protection
- **Client-side** - ProtectedRoute component
- **Automatic redirects** - Seamless user experience

## Usage Examples

### Protecting Dashboard Routes
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen">
        {children}
      </div>
    </ProtectedRoute>
  );
}
```

### Protecting Auth Pages
```tsx
// app/page.tsx
export default function LoginPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <LoginForm />
    </ProtectedRoute>
  );
}
```

### Checking Authentication Status
```tsx
import { useAuth } from '@/components/context/AuthContext';

function MyComponent() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <LoginPrompt />;
  
  return <AuthenticatedContent />;
}
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost
NEXT_PUBLIC_API_PORT_8002=8002
NEXT_PUBLIC_API_VERSION=v2
NEXT_PUBLIC_API_TIMEOUT=10000
```

## API Endpoints

- **Login**: `POST /api/v2/admin/login`
- **Logout**: Client-side only (clear cookies)
- **Token Validation**: Middleware automatic

## Error Handling

### Invalid Token
- Automatic redirect to login
- Clear invalid cookies
- Show appropriate error messages

### Network Errors
- Retry mechanisms
- Fallback to cached data
- User-friendly error messages

### Expired Token
- Automatic logout
- Redirect to login
- Clear expired cookies

## Testing

### Manual Testing
1. **Login** - Verify token is set in cookies
2. **Navigate** - Check protected routes work
3. **Logout** - Verify cookies are cleared
4. **Expired token** - Test automatic logout

### Browser DevTools
- **Application tab** - Check cookies
- **Network tab** - Verify API calls
- **Console** - Check authentication logs

## Troubleshooting

### Common Issues

1. **Token not set in cookies**
   - Check browser security settings
   - Verify HTTPS in production
   - Check console for errors

2. **Middleware not working**
   - Verify middleware.ts is in root
   - Check matcher configuration
   - Test token validation function

3. **Redirect loops**
   - Check ProtectedRoute configuration
   - Verify middleware logic
   - Check cookie settings

### Debug Mode
Enable console logging in middleware and AuthContext for debugging:
```typescript
console.log('Middleware:', pathname, token ? 'Present' : 'Missing');
console.log('Auth cookie set:', cookieValue);
```

## Best Practices

1. **Always use HTTPS in production**
2. **Set appropriate cookie expiration**
3. **Validate tokens on both client and server**
4. **Handle edge cases gracefully**
5. **Provide clear error messages**
6. **Test authentication flows thoroughly**

## Security Considerations

1. **JWT tokens are stored in cookies** (not localStorage)
2. **Cookies have security flags** (SameSite, Secure)
3. **Token expiration is validated** on every request
4. **Automatic logout** on token expiration
5. **CSRF protection** via SameSite cookies
6. **XSS protection** via HttpOnly cookies (where possible)
