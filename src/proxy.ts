import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

export const proxy = auth((request) => {
  const session = request.auth;
  const { pathname } = request.nextUrl;

  // Permitir acceso libre a /auth/otp
  if (pathname.startsWith('/auth/otp')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/login') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!session.user?.isTwoFactorVerified) {
      return NextResponse.redirect(new URL('/auth/otp', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/auth/otp'],
};