import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'smartinvest-secret-key-change-in-production';

// DEV USER DATA - for local development without database
const DEV_USER = {
    id: 'dev-user-123',
    email: 'dev@smartinvest.com',
    balance: 5000,
    totalEarnings: 1250,
    totalDeposits: 10000,
    totalWithdrawals: 0,
    createdAt: new Date().toISOString(),
    fullName: 'Dev User',
    phone: '0712345678',
    idNumber: null,
    dateOfBirth: null,
    profilePhoto: null,
    gender: null,
    occupation: null,
    address: null,
    tier: 'premium',
    referralCode: 'DEV123ABC',
    referralCount: 5,
    referralEarnings: 250,
    hasBiometrics: false,
};

interface JWTPayload {
    userId: string;
    email: string;
}

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        let payload: JWTPayload;
        try {
            payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
        } catch {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        // DEV MODE - return mock user data
        if (payload.userId === 'dev-user-123' || payload.email === 'dev@smartinvest.com') {
            return NextResponse.json({
                success: true,
                user: DEV_USER
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                balance: true,
                totalEarnings: true,
                totalDeposits: true,
                totalWithdrawals: true,
                createdAt: true,
                fullName: true,
                phone: true,
                idNumber: true,
                dateOfBirth: true,
                profilePhoto: true,
                gender: true,
                occupation: true,
                address: true,
                tier: true,
                referralCode: true,
                referralCount: true,
                referralEarnings: true,
                passkeys: {
                    select: { id: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                ...user,
                hasBiometrics: user.passkeys.length > 0,
                passkeys: undefined, // Don't expose passkey details
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json({ error: 'Failed to get user data' }, { status: 500 });
    }
}
