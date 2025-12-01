import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route handling
 *
 * Note: Authentication is primarily handled client-side via AuthContext.
 * This middleware handles basic route setup and doesn't block protected routes
 * because the cookie from the API backend (port 4001) is not accessible here
 * (different origin than frontend on port 4000).
 *
 * Client-side protection is done in:
 * - app/(authenticated)/layout.tsx - redirects to /login if not authenticated
 */

export function middleware(request: NextRequest) {
  // Let client-side auth handle protection
  // The authenticated layout will check auth state and redirect if needed
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions (images, etc.)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|json|xml|txt|pdf|zip|woff|woff2|ttf|eot)|public).*)',
  ],
};
