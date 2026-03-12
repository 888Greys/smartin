import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signAuthToken } from '@/lib/auth-token';

// This route ONLY works outside of production.
// It creates (or finds) a dev user and returns a real JWT so the dashboard works.
export async function POST() {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const DEV_EMAIL = 'dev@smartinvest.local';
    const DEV_PASSWORD = 'devpassword123';

    let user = await prisma.user.findUnique({ where: { email: DEV_EMAIL } });

    if (!user) {
        const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);
        user = await prisma.user.create({
            data: {
                email: DEV_EMAIL,
                passwordHash,
                balance: 200,
                totalEarnings: 4500,
                totalDeposits: 5000,
                isVerified: true,
                referralCode: 'DEV001',
                fullName: 'Dev User',
                tier: 'premium',
            },
        });
    }

    const token = signAuthToken({ userId: user.id, email: user.email });

    return NextResponse.json({ token, user: { id: user.id, email: user.email } });
}
