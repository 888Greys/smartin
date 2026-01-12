import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'smartinvest-secret-key-change-in-production';

// DEV CREDENTIALS - for local development without database
const DEV_EMAIL = 'dev@smartinvest.com';
const DEV_PASSWORD = 'dev123456';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // DEV MODE LOGIN - bypass database
        if (email.toLowerCase() === DEV_EMAIL && password === DEV_PASSWORD) {
            const token = jwt.sign(
                { userId: 'dev-user-123', email: DEV_EMAIL },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return NextResponse.json({
                success: true,
                message: 'Dev login successful',
                token,
                user: {
                    id: 'dev-user-123',
                    email: DEV_EMAIL,
                    balance: 5000,
                    totalEarnings: 1250,
                }
            });
        }

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                balance: user.balance,
                totalEarnings: user.totalEarnings,
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Failed to log in. Please try again.' },
            { status: 500 }
        );
    }
}
