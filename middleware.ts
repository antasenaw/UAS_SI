import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Routes that don't require authentication
const publicRoutes = ['/login', '/reset', '/debug-auth']

export const runtime = 'nodejs'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("[Middleware] Path:", pathname);

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log("[Middleware] Public route, allowing access");
    return NextResponse.next()
  }

  // Check for auth token in cookies or headers
  const allCookies = request.cookies.getAll();
  console.log("[Middleware] All cookies count:", allCookies.length);
  allCookies.forEach(cookie => {
    console.log("[Middleware] Cookie:", cookie.name, "=", cookie.value?.substring(0, 20) + "...");
  });
  
  const token = request.cookies.get('authToken')?.value
  console.log("[Middleware] Token from cookies:", token ? "Found (" + token.length + " chars)" : "NOT FOUND");

  if (!token) {
    // Redirect to login if no token
    console.log("[Middleware] No token, redirecting to /login");
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log("[Middleware] Token verified with payload:", decoded);
    console.log("[Middleware] Token verified, allowing access");
    return NextResponse.next()
  } catch (error) {
    // Token is invalid, redirect to login
    console.log("[Middleware] Token invalid:", error);
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/guru/:path*', '/siswa/:path*', '/admin', '/guru', '/siswa']
}
