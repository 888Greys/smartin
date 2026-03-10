import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getBearerToken, verifyAuthToken } from '@/lib/auth-token';

export async function GET(request: NextRequest) {
    try {
        const token = getBearerToken(request);
        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = verifyAuthToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
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
