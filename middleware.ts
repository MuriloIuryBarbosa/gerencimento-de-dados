import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/ordem-compra',
    '/proforma',
    '/requisicoes',
    '/conteineres',
    '/followup',
    '/executivo',
    '/settings'
  ]

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // For now, we'll allow all routes since we don't have proper session management
  // In production, you'd check for valid JWT tokens or session cookies here

  if (isProtectedRoute) {
    // TODO: Implement proper authentication check
    // For now, we'll allow access but the ProtectedRoute component will handle client-side checks
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