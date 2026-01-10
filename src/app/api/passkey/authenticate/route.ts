import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse, type VerifiedAuthenticationResponse } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'smartinvest-secret-key';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

export async function POST(request: NextRequest) {
    try {
        const { response, challenge, userId } = await request.json();

        // Find the passkey
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
                expectedChallenge: challenge,
                expectedOrigin: ORIGIN,
                expectedRPID: RP_ID,
                credential: {
                    id: passkey.credentialId,
                    publicKey: passkey.credentialPublicKey,
                    counter: Number(passkey.counter),
                    transports: passkey.transports as AuthenticatorTransport[],
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

        // Update counter
        await prisma.passkey.update({
            where: { id: passkey.id },
            data: { counter: BigInt(authenticationInfo.newCounter) }
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: passkey.user.id, email: passkey.user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            success: true,
            message: 'Face ID login successful',
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
