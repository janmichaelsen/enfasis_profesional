import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const proxy = auth((request) => {
    const session = request.auth;
    const { pathname } = request.nextUrl;

    // Si intenta entrar al login pero ya tiene sesión iniciada, lo mandamos al dashboard para que no quede estancado
    if (pathname.startsWith('/login') && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }


    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        // Si no hay sesión iniciada, lo mandamos al login
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Si no ha verificado el OTP, lo mandamos al OTP
        if (!session.user?.isTwoFactorVerified) {
            return NextResponse.redirect(new URL('/auth/otp', request.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
};