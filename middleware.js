import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth',
  '/auth/callback',
  '/api/auth',
  '/api/auth/callback',
  '/favicon.ico',
  '/logo.png',
  '/login.png'
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Skip middleware for static files, API routes, and auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next();
  }

  // Allow access to interview pages without authentication
  if (pathname.startsWith('/interview/')) {
    return NextResponse.next();
  }

  // For all other routes, check authentication
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  const { data: { session } } = await supabase.auth.getSession();

  // If there's no session, redirect to home
  if (!session) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
  ],
};
