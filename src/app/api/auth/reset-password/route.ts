import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { resetCodes } from '../forgot-password/route';

export async function POST(request: NextRequest) {
    try {
        const { email, code, newPassword } = await request.json();

        if (!email || !code || !newPassword) {
            return NextResponse.json({ error: 'Email, code, and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        // Verify code
        const stored = resetCodes.get(email.toLowerCase());

        if (!stored) {
            return NextResponse.json({ error: 'No reset code found. Please request a new one.' }, { status: 400 });
        }

        if (Date.now() > stored.expires) {
            resetCodes.delete(email.toLowerCase());
            return NextResponse.json({ error: 'Reset code has expired. Please request a new one.' }, { status: 400 });
        }

        if (stored.code !== code) {
            return NextResponse.json({ error: 'Invalid reset code' }, { status: 400 });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 12);

        // Update user password
        await prisma.user.update({
            where: { email: email.toLowerCase() },
            data: { passwordHash }
        });

        // Clear the reset code
        resetCodes.delete(email.toLowerCase());

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
