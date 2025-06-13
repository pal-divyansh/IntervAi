import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Get the pathname of the request
  const { pathname } = req.nextUrl;
  
  // Allow access to the interview pages without authentication
  if (pathname.startsWith('/interview/')) {
    return res;
  }
  
  // For all other routes, check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // If user is not authenticated and the current path is not the login page, redirect to login
  if (!session && pathname !== '/') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
