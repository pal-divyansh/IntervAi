import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Get the pathname
  const { pathname } = req.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/interview',
    '/interview/[interview_id]',
    '/interview/[interview_id]/start',
    '/api/auth/callback',
  ];

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || 
    (path.includes('[interview_id]') && pathname.startsWith(path.split('[')[0]))
  );

  // Get the session
  const { data: { session } } = await supabase.auth.getSession();

  // If it's a public path, allow access
  if (isPublicPath) {
    return res;
  }

  // If there's no session and it's not a public path, redirect to home
  if (!session) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  return res;
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
