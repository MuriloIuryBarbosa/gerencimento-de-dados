import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs' // Força o uso do runtime Node.js

export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/ordem-compra',
    '/proforma',
    '/requisicoes',
    '/conteineres',
    '/follow-up',
    '/executivo',
    '/settings'
  ]

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register'
  ]

  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname === route
  )

  // If accessing a protected route, check authentication
  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      // No token, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify JWT token
      const secret = process.env.JWT_SECRET
      if (!secret) {
        console.error('JWT_SECRET not configured')
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
      }

      jwt.verify(token, secret)

      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      // Token is invalid or expired, redirect to login
      console.error('JWT verification failed:', error)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If accessing login/register while authenticated, redirect to dashboard
  if (isPublicRoute && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const token = request.cookies.get('auth-token')?.value

    if (token) {
      try {
        const secret = process.env.JWT_SECRET
        if (secret) {
          jwt.verify(token, secret)
          // User is authenticated, redirect to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch (error) {
        // Token is invalid, continue to login/register
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}