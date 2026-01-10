import { NextRequest, NextResponse } from 'next/server';
import { generateRegistrationOptions, type AuthenticatorTransportFuture } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'smartinvest-secret-key';
const RP_NAME = 'smartInvest';
const RP_ID = process.env.RP_ID || 'localhost';

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
