import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'smartinvest-secret-key-change-in-production';

// GET - Fetch user's transaction history
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        let userId: string;
        try {
            const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
            userId = payload.userId;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

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
