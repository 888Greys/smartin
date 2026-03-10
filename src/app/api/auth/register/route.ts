import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signAuthToken } from '@/lib/auth-token';
import { createRateLimitKey, rateLimiter } from '@/lib/rate-limit';

// Referral bonus amounts
const LEVEL_1_BONUS = 20; // Direct referral bonus
const LEVEL_2_BONUS = 5;  // Indirect referral bonus (referrer's referrer)

// Generate short 6-character referral code
function generateReferralCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars like 0,O,1,I
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function POST(request: NextRequest) {
    try {
        const { email, password, referralCode } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const rateLimit = rateLimiter.check(
            createRateLimitKey('register', request, email),
            5,
            10 * 60 * 1000
        );
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many registration attempts. Please try again later.' },
                { status: 429 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        // Find referrer if referral code provided
        let referrerId: string | null = null;
        let level1Referrer = null;
        let level2Referrer = null;

        if (referralCode && referralCode.trim()) {
            level1Referrer = await prisma.user.findUnique({
                where: { referralCode: referralCode.trim() }
            });

            if (level1Referrer) {
                referrerId = level1Referrer.id;

                // Find Level 2 referrer (the person who referred Level 1)
                if (level1Referrer.referredBy) {
                    level2Referrer = await prisma.user.findUnique({
                        where: { id: level1Referrer.referredBy }
                    });
                }
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Generate unique referral code
        let newReferralCode = generateReferralCode();
        let attempts = 0;
        while (attempts < 10) {
            const existing = await prisma.user.findUnique({ where: { referralCode: newReferralCode } });
            if (!existing) break;
            newReferralCode = generateReferralCode();
            attempts++;
        }

        // Create user with referral info
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                passwordHash,
                balance: 10.00, // Starting balance
                isVerified: true, // Already verified via OTP
                referredBy: referrerId,
                referralCode: newReferralCode,
            }
        });

        // Credit Level 1 referrer (direct referral)
        if (level1Referrer) {
            await prisma.user.update({
                where: { id: level1Referrer.id },
                data: {
                    balance: { increment: LEVEL_1_BONUS },
                    referralEarnings: { increment: LEVEL_1_BONUS },
                    referralCount: { increment: 1 }
                }
            });

            // Create transaction record for Level 1 referrer
            await prisma.transaction.create({
                data: {
                    userId: level1Referrer.id,
                    type: 'referral',
                    amount: LEVEL_1_BONUS,
                    status: 'completed',
                    reference: `Referral bonus: ${user.email} joined`
                }
            });
        }

        // Credit Level 2 referrer (indirect referral)
        if (level2Referrer) {
            await prisma.user.update({
                where: { id: level2Referrer.id },
                data: {
                    balance: { increment: LEVEL_2_BONUS },
                    referralEarnings: { increment: LEVEL_2_BONUS },
                }
            });

            // Create transaction record for Level 2 referrer
            await prisma.transaction.create({
                data: {
                    userId: level2Referrer.id,
                    type: 'referral',
                    amount: LEVEL_2_BONUS,
                    status: 'completed',
                    reference: `Level 2 referral bonus: ${user.email} joined via ${level1Referrer?.email}`
                }
            });
        }

        // Generate JWT token
        const token = signAuthToken({ userId: user.id, email: user.email });

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                balance: user.balance,
                referralCode: user.referralCode,
            },
            referralApplied: !!level1Referrer
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Failed to create account. Please try again.' },
            { status: 500 }
        );
    }
}
