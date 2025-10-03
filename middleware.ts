import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// JWT token validation function
function isValidJWT(token: string): boolean {
  try {
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  console.log(`Middleware: ${pathname}, Token: ${token ? 'Present' : 'Missing'}`);
  if (token) {
    console.log(`Token value: ${token.substring(0, 20)}...`);
    console.log(`Token valid: ${isValidJWT(token)}`);
  }

  // Protect dashboard routes - require valid JWT token
  if (pathname.startsWith('/dashboard')) {
    if (!token || !isValidJWT(token)) {
      console.log('Redirecting to login - no valid token');
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    console.log('Access granted to dashboard');
  }

  // Make auth pages private - redirect to dashboard if already authenticated
  if (pathname === '/' && token && isValidJWT(token)) {
    console.log('Redirecting authenticated user to dashboard');
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Temporarily disabled to test
    // '/dashboard/:path*',
    // '/',
  ],
};




