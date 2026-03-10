import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '@/lib/otp-store';
import { createRateLimitKey, rateLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const rateLimit = rateLimiter.check(
            createRateLimitKey('verify-otp', request, email),
            12,
            10 * 60 * 1000
        );
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many verification attempts. Please request a new code.' },
                { status: 429 }
            );
        }

        // Verify OTP using shared store
        const result = await otpStore.verify(email, otp);

        if (!result.valid) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { error: 'Verification failed. Please try again.' },
            { status: 500 }
        );
    }
}
