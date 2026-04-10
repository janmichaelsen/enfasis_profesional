import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {

    const session = request.cookies.get('authjs.session-token') ||
        request.cookies.get('__Secure-authjs.session-token');

    const { pathname } = request.nextUrl;


    if (pathname.startsWith('/login') && session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }


    if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
};