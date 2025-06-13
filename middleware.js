import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  const url = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/static') ||
    url.pathname.includes('.') ||
    url.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Allow access to interview pages without authentication
  if (url.pathname.startsWith('/interview/')) {
    return NextResponse.next();
  }

  // For all other routes, check authentication
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createMiddlewareClient({ req: request, res: response });
  const { data: { session } } = await supabase.auth.getSession();

  // If there's no session and user is not on the home page, redirect to home
  if (!session && url.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
