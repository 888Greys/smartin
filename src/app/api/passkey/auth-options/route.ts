import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions, type AuthenticatorTransportFuture } from '@simplewebauthn/server';
import prisma from '@/lib/prisma';

const RP_ID = process.env.RP_ID || 'localhost';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: { passkeys: true }
        });

        if (!user || user.passkeys.length === 0) {
            return NextResponse.json({ error: 'No biometrics registered for this account' }, { status: 404 });
        }

        const options = await generateAuthenticationOptions({
            rpID: RP_ID,
            allowCredentials: user.passkeys.map(pk => ({
                id: pk.credentialId,
                transports: pk.transports as AuthenticatorTransportFuture[],
            })),
            userVerification: 'preferred',
        });

        return NextResponse.json({
            success: true,
            options,
            challenge: options.challenge,
            userId: user.id,
        });

    } catch (error) {
        console.error('Auth options error:', error);
        return NextResponse.json({ error: 'Failed to generate options' }, { status: 500 });
    }
}
