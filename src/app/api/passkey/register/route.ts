import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationResponse, type VerifiedRegistrationResponse } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'smartinvest-secret-key';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

interface JWTPayload {
    userId: string;
    email: string;
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let payload: JWTPayload;
        try {
            payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { response, challenge } = await request.json();

        let verification: VerifiedRegistrationResponse;
        try {
            verification = await verifyRegistrationResponse({
                response,
                expectedChallenge: challenge,
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
