import { NextResponse } from 'next/server';
import { signJwtToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { role, password } = await request.json();

        const adminPassword = process.env.ADMIN_PASSWORD;
        const deptPassword = process.env.DEPT_PASSWORD;

        if (!adminPassword || !deptPassword) {
            console.error("ADMIN_PASSWORD or DEPT_PASSWORD environment variables are not set.");
            return NextResponse.json({ error: 'Server configuration error. Please contact support.' }, { status: 500 });
        }

        if (!role || !password) {
            return NextResponse.json({ error: 'Role and password are required' }, { status: 400 });
        }

        let isValid = false;
        let jwtRole = "department";
        let department = role;

        if (role === 'Admin') {
            if (password === adminPassword) {
                isValid = true;
                jwtRole = "admin";
                department = "ALL";
            }
        } else {
            // For now, all departments share a common DEPT_PASSWORD default (e.g. 'vyugam2026'), 
            // or we could check for specific ones perfectly e.g. process.env[`${role.toUpperCase()}_PASSWORD`]
            const specificDeptPassword = process.env[`${role.toUpperCase()}_PASSWORD`];
            const validPassword = specificDeptPassword || deptPassword;

            if (password === validPassword) {
                isValid = true;
                jwtRole = "department";
                department = role;
            }
        }

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await signJwtToken({ role: jwtRole, department });

        const cookieStore = await cookies();
        cookieStore.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json({ success: true, user: { role: jwtRole, department } });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
