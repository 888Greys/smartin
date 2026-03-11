import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { generateRegistrationOptions, type AuthenticatorTransportFuture } from '@simplewebauthn/server';
import prisma from '@/lib/prisma';
import { getBearerToken, verifyAuthToken } from '@/lib/auth-token';
import { passkeyChallengeStore } from '@/lib/passkey-challenge-store';

const RP_NAME = 'smartInvest';
const RP_ID = process.env.RP_ID || 'localhost';

export async function POST(request: NextRequest) {
    try {
        const token = getBearerToken(request);
        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = verifyAuthToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: { passkeys: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const options = await generateRegistrationOptions({
            rpName: RP_NAME,
            rpID: RP_ID,
            userID: new TextEncoder().encode(user.id),
            userName: user.email,
            attestationType: 'none',
            excludeCredentials: user.passkeys.map(pk => ({
                id: pk.credentialId,
                transports: pk.transports as AuthenticatorTransportFuture[],
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
            },
        });

        await passkeyChallengeStore.set(`register:${user.id}`, options.challenge);

        return NextResponse.json({
            success: true,
            options,
            challenge: options.challenge,
        });

    } catch (error) {
        console.error('Passkey registration options error:', error);
        return NextResponse.json({ error: 'Failed to generate options' }, { status: 500 });
    }
}
