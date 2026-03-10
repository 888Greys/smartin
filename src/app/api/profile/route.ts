import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getBearerToken, verifyAuthToken } from '@/lib/auth-token';

export async function GET(request: Request) {
    try {
        const token = getBearerToken(request);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyAuthToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
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
                referredBy: true,
                referralCount: true,
                referralEarnings: true,
                balance: true,
                totalEarnings: true,
                isVerified: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ profile: user });
    } catch {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}

export async function PUT(request: Request) {
    try {
        const token = getBearerToken(request);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyAuthToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { fullName, phone, idNumber, dateOfBirth, profilePhoto, gender, occupation, address } = body;

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: {
                fullName: fullName || undefined,
                phone: phone || undefined,
                idNumber: idNumber || undefined,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                profilePhoto: profilePhoto !== undefined ? profilePhoto : undefined,
                gender: gender || undefined,
                occupation: occupation || undefined,
                address: address || undefined,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                idNumber: true,
                dateOfBirth: true,
                tier: true,
                referralCode: true,
                referralCount: true,
                referralEarnings: true,
            },
        });

        return NextResponse.json({
            message: 'Profile updated successfully',
            profile: updatedUser
        });
    } catch {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
