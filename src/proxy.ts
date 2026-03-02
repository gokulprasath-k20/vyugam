import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwtToken } from '@/lib/auth'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') {
            return NextResponse.next()
        }

        const token = request.cookies.get('adminToken')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            const payload = await verifyJwtToken(token)
            if (!payload) {
                throw new Error("Invalid token")
            }
            return NextResponse.next()
        } catch {

            const response = NextResponse.redirect(new URL('/admin/login', request.url))
            response.cookies.delete('adminToken')
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
