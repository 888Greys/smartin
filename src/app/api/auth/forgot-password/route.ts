import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import { createRateLimitKey, rateLimiter } from '@/lib/rate-limit';

// In-memory store for reset codes (use Redis in production)
const resetCodes = new Map<string, { code: string; expires: number; attempts: number }>();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const rateLimit = rateLimiter.check(
            createRateLimitKey('forgot-password', request, email),
            5,
            15 * 60 * 1000
        );
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many reset requests. Try again later.' },
                { status: 429 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            // Don't reveal if email exists or not for security
            return NextResponse.json({
                success: true,
                message: 'If this email exists, a reset code has been sent'
            });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store code with 15-minute expiry
        resetCodes.set(email.toLowerCase(), {
            code,
            expires: Date.now() + 15 * 60 * 1000,
            attempts: 0,
        });

        // Send email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'smartinvest@innbucks.org',
            to: email,
            subject: 'Reset your smartInvest password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #0052ff;">Reset Your Password</h2>
                    <p>Use this code to reset your smartInvest password:</p>
                    <div style="background: #f0f5ff; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0052ff;">${code}</span>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">This code expires in 15 minutes.</p>
                    <p style="color: #64748b; font-size: 14px;">If you didn't request this, ignore this email.</p>
                </div>
            `,
        });

        return NextResponse.json({
            success: true,
            message: 'Reset code sent to your email'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({ error: 'Failed to send reset code' }, { status: 500 });
    }
}

// Export for use in reset-password route
export { resetCodes };
