import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const publicRoutes = ['/', '/auth', '/contact'];
  
  if (pathname.includes('/_next') || pathname.includes('/favicon.ico') || pathname.includes('/images')) {
    return NextResponse.next();
  }

  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const userRole = request.cookies.get('userRole')?.value;
  const token = request.cookies.get('token')?.value;

  // ✅ AJOUT: Logs pour debug
  console.log('🔐 Middleware check:', {
    pathname,
    isAuthenticated,
    userRole,
    hasToken: !!token
  });

  // Rediriger vers login si non authentifié
  if (!isAuthenticated || !token) {
    console.log('➡️ Redirecting to login - not authenticated');
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check Admin Routes
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'ADMIN' && userRole !== 'admin') {
      console.log('➡️ Redirecting to login - user is not an Admin');
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check Rep Routes
  if (pathname.startsWith('/rep')) {
    if (userRole !== 'REP' && userRole !== 'representative') {
      console.log('➡️ Redirecting to login - user is not a Rep');
      const loginUrl = new URL('/auth', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ✅ AJOUT: Ajouter le token aux headers
  const requestHeaders = new Headers(request.headers);
  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};