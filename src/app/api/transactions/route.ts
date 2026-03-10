import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getBearerToken, verifyAuthToken } from '@/lib/auth-token';

// GET - Fetch user's transaction history
export async function GET(request: NextRequest) {
    try {
        const token = getBearerToken(request);
        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = verifyAuthToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        const userId = payload.userId;

        // Fetch transactions sorted by date (newest first)
        const transactions = await prisma.transaction.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
            take: 50, // Limit to 50 most recent
            select: {
                id: true,
                type: true,
                amount: true,
                status: true,
                reference: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            transactions: transactions
        });

    } catch (error) {
        console.error('Get transactions error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}
