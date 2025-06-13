import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const publicPaths = [
  '/',
  '/api/auth/callback',
  '/interview/.*', // Match any path that starts with /interview/
];

export async function middleware(req) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Skip middleware for public paths
  if (publicPaths.some(path => new RegExp(`^${path}$`).test(pathname))) {
    return res;
  }

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return res;
  }

  // For all other routes, check authentication
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // If there's no session, redirect to home
  if (!session) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
