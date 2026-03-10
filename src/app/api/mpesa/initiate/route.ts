import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildMpesaCallbackUrl } from '@/lib/mpesa-callback';
import { getBearerToken, verifyAuthToken } from '@/lib/auth-token';

const MEGAPAY_API_URL = 'https://megapay.co.ke/backend/v1/initiatestk';
const MEGAPAY_API_KEY = process.env.MEGAPAY_API_KEY || '';
const MEGAPAY_EMAIL = process.env.MEGAPAY_EMAIL || '';

export async function POST(request: NextRequest) {
    try {
        // Get user from JWT token
        let userId: string | null = null;

        const token = getBearerToken(request);
        if (token) {
            const payload = verifyAuthToken(token);
            if (payload) {
                userId = payload.userId;
            }
        }

        const { phone, amount, reference } = await request.json();
        const amountNumber = Number(amount);

        // Validate inputs
        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        if (!Number.isFinite(amountNumber) || amountNumber < 10) {
            return NextResponse.json({ error: 'Minimum deposit is KES 10' }, { status: 400 });
        }

        if (!MEGAPAY_API_KEY || !MEGAPAY_EMAIL) {
            return NextResponse.json({ error: 'Payment service is not configured' }, { status: 503 });
        }

        // Format phone number to 2547XXXXXXXX format
        let msisdn = phone.replace(/\D/g, ''); // Remove non-digits
        if (msisdn.startsWith('0')) {
            msisdn = '254' + msisdn.substring(1);
        } else if (!msisdn.startsWith('254')) {
            msisdn = '254' + msisdn;
        }

        // Generate reference if not provided
        const txRef = reference || `SI${Date.now()}`;

        // Create pending transaction in database if user is authenticated
        if (userId) {
            await prisma.transaction.create({
                data: {
                    userId: userId,
                    type: 'deposit',
                    amount: amountNumber,
                    status: 'pending',
                    reference: txRef
                }
            });
        }

        const callbackUrl = buildMpesaCallbackUrl();

        const response = await fetch(MEGAPAY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: MEGAPAY_API_KEY,
                email: MEGAPAY_EMAIL,
                amount: amountNumber,
                msisdn: msisdn,
                reference: txRef,
                callback_url: callbackUrl,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('MegaPay error:', data);
            // Mark transaction as failed if it was created
            if (userId) {
                await prisma.transaction.updateMany({
                    where: { reference: txRef },
                    data: { status: 'failed' }
                });
            }
            return NextResponse.json(
                { error: data.message || 'Failed to initiate payment' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'STK Push sent! Check your phone to complete payment.',
            reference: txRef,
            data: data
        });

    } catch (error) {
        console.error('STK Push error:', error);
        return NextResponse.json(
            { error: 'Failed to process payment. Please try again.' },
            { status: 500 }
        );
    }
}
