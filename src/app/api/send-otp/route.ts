import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { otpStore } from '@/lib/otp-store';
import { createRateLimitKey, rateLimiter } from '@/lib/rate-limit';

// Create email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.spacemail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: parseInt(process.env.SMTP_PORT || '465') === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        const rateLimit = rateLimiter.check(
            createRateLimitKey('send-otp', request, email),
            5,
            10 * 60 * 1000
        );
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many OTP requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Generate OTP
        const otp = otpStore.generateOTP();

        // Store OTP with 10-minute expiry
        await otpStore.set(email, otp, 10);

        // Send email
        await transporter.sendMail({
            from: `"smartInvest" <${process.env.SMTP_FROM || 'smartinvest@innbucks.org'}>`,
            to: email,
            subject: 'Your smartInvest Verification Code',
            html: `
                <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="display: inline-block; width: 50px; height: 50px; background: #0052ff; border-radius: 12px; line-height: 50px; color: white; font-size: 24px; font-weight: 900;">S</div>
                    </div>
                    <h1 style="font-size: 24px; font-weight: 800; text-align: center; color: #1e293b; margin-bottom: 10px;">
                        Your Verification Code
                    </h1>
                    <p style="color: #64748b; text-align: center; margin-bottom: 30px;">
                        Use this code to verify your smartInvest account.
                    </p>
                    <div style="background: #f0f5ff; border-radius: 16px; padding: 25px; text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0052ff;">${otp}</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                        This code expires in 10 minutes.<br>
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
            `,
        });

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json(
            { error: 'Failed to send verification code. Please try again.' },
            { status: 500 }
        );
    }
}
