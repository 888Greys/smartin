import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { verifyRegistrationResponse, type VerifiedRegistrationResponse } from '@simplewebauthn/server';
import prisma from '@/lib/prisma';
import { getBearerToken, verifyAuthToken } from '@/lib/auth-token';
import { passkeyChallengeStore } from '@/lib/passkey-challenge-store';

const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

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

        const { response } = await request.json();
        const expectedChallenge = await passkeyChallengeStore.consume(`register:${payload.userId}`);
        if (!expectedChallenge) {
            return NextResponse.json({ error: 'Registration challenge expired. Start again.' }, { status: 400 });
        }

        let verification: VerifiedRegistrationResponse;
        try {
            verification = await verifyRegistrationResponse({
                response,
                expectedChallenge: expectedChallenge,
                expectedOrigin: ORIGIN,
                expectedRPID: RP_ID,
            });
        } catch (error) {
            console.error('Verification error:', error);
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
        }

        const { verified, registrationInfo } = verification;

        if (!verified || !registrationInfo) {
            return NextResponse.json({ error: 'Registration not verified' }, { status: 400 });
        }

        // Save the passkey
        await prisma.passkey.create({
            data: {
                userId: payload.userId,
                credentialId: Buffer.from(registrationInfo.credential.id).toString('base64url'),
                credentialPublicKey: Buffer.from(registrationInfo.credential.publicKey),
                counter: BigInt(registrationInfo.credential.counter),
                transports: response.response.transports || [],
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Face ID registered successfully'
        });

    } catch (error) {
        console.error('Passkey registration error:', error);
        return NextResponse.json({ error: 'Failed to register passkey' }, { status: 500 });
    }
}
