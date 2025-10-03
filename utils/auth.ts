// Authentication utility functions

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Decode and validate JWT token
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is valid and not expired
 */
export function isValidJWT(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp > currentTime;
}

/**
 * Get token from cookies (client-side)
 */
export function getTokenFromCookies(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth_token=')
  );
  
  if (authCookie) {
    return authCookie.split('=')[1];
  }
  
  return null;
}

/**
 * Set token in cookies (client-side)
 */
export function setTokenInCookies(token: string): void {
  if (typeof document === 'undefined') return;
  
  // Only use Secure flag in production (HTTPS)
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  const cookieValue = `auth_token=${token}; path=/; SameSite=Lax; max-age=2592000${secureFlag}; HttpOnly=false`;
  document.cookie = cookieValue;
  console.log('Auth cookie set:', cookieValue);
}

/**
 * Clear token from cookies (client-side)
 */
export function clearTokenFromCookies(): void {
  if (typeof document === 'undefined') return;
  
  // Only use Secure flag in production (HTTPS)
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureFlag}`;
  console.log('Auth cookie cleared');
}

/**
 * Check if user is authenticated (client-side)
 */
export function isAuthenticated(): boolean {
  const token = getTokenFromCookies();
  return token ? isValidJWT(token) : false;
}

/**
 * Get user info from token (client-side)
 */
export function getUserFromToken(): JWTPayload | null {
  const token = getTokenFromCookies();
  return token ? decodeJWT(token) : null;
}
