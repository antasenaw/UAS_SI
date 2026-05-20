import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET)

// Routes that don't require authentication
const publicRoutes = ['/login', '/reset', '/debug-auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("[Middleware] Path:", pathname);

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log("[Middleware] Public route, allowing access");
    return NextResponse.next()
  }

  // Check for auth token in cookies or Authorization header
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined
  const token = request.cookies.get('authToken')?.value || bearerToken
  console.log("[Middleware] Token from cookies:", request.cookies.get('authToken')?.value ? "Found" : "NOT FOUND")
  console.log("[Middleware] Authorization header token:", bearerToken ? "Found" : "NOT FOUND")

  if (!token) {
    // Redirect to login if no token
    console.log("[Middleware] No token, redirecting to /login")
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify token
    const { payload } = await jwtVerify(token, SECRET_KEY)
    console.log("[Middleware] Token verified with payload:", payload);
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
