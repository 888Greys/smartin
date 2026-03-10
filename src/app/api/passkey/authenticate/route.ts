import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse, type VerifiedAuthenticationResponse, type AuthenticatorTransportFuture } from '@simplewebauthn/server';
import prisma from '@/lib/prisma';
import { signAuthToken } from '@/lib/auth-token';
import { passkeyChallengeStore } from '@/lib/passkey-challenge-store';

const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

export async function POST(request: NextRequest) {
    try {
        const { response, userId } = await request.json();
        const expectedChallenge = await passkeyChallengeStore.consume(`auth:${userId}`);
        if (!expectedChallenge) {
            return NextResponse.json({ error: 'Authentication challenge expired. Start again.' }, { status: 400 });
        }

        const passkey = await prisma.passkey.findFirst({
            where: {
                credentialId: response.id,
                userId: userId,
            },
            include: { user: true }
        });

        if (!passkey) {
            return NextResponse.json({ error: 'Passkey not found' }, { status: 404 });
        }

        let verification: VerifiedAuthenticationResponse;
        try {
            verification = await verifyAuthenticationResponse({
                response,
                expectedChallenge: expectedChallenge,
                expectedOrigin: ORIGIN,
                expectedRPID: RP_ID,
                credential: {
                    id: passkey.credentialId,
                    publicKey: passkey.credentialPublicKey,
                    counter: Number(passkey.counter),
                    transports: passkey.transports as AuthenticatorTransportFuture[],
                },
            });
        } catch (error) {
            console.error('Auth verification error:', error);
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
        }

        const { verified, authenticationInfo } = verification;

        if (!verified) {
            return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
        }

        await prisma.passkey.update({
            where: { id: passkey.id },
            data: { counter: BigInt(authenticationInfo.newCounter) }
        });

        const token = signAuthToken({ userId: passkey.user.id, email: passkey.user.email });

        return NextResponse.json({
            success: true,
            message: 'Biometrics login successful',
            token,
            user: {
                id: passkey.user.id,
                email: passkey.user.email,
                balance: passkey.user.balance,
            }
        });

    } catch (error) {
        console.error('Passkey auth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
