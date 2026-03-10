import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyMpesaCallbackToken } from '@/lib/mpesa-callback';

// MegaPay callback endpoint
// This receives payment confirmation after user completes M-Pesa payment

export async function POST(request: NextRequest) {
    try {
        if (!verifyMpesaCallbackToken(request)) {
            return NextResponse.json({ error: 'Unauthorized callback' }, { status: 401 });
        }

        const body = await request.json();

        // Log callback for debugging
        console.log('M-Pesa Callback received:', JSON.stringify(body, null, 2));

        // MegaPay callback structure varies, handle common formats
        const {
            reference,
            amount,
            status,
            ResultCode,
            ResultDesc
        } = body;

        // Determine if payment was successful
        // MegaPay typically sends status='success' or ResultCode=0
        const isSuccess = status === 'success' || status === 'Success' || ResultCode === 0 || ResultCode === '0';

        if (!reference) {
            console.error('Callback missing reference:', body);
            return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
        }

        // Find the pending transaction by reference
        const transaction = await prisma.transaction.findFirst({
            where: { reference: reference },
        });

        if (!transaction) {
            console.error('Transaction not found for reference:', reference);
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Already processed?
        if (transaction.status !== 'pending') {
            console.log('Transaction already processed:', transaction.status);
            return NextResponse.json({ success: true, message: 'Already processed' });
        }

        const callbackAmount = Number(amount);
        if (Number.isFinite(callbackAmount) && callbackAmount !== transaction.amount) {
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'failed' }
            });

            console.error(`Amount mismatch for reference ${reference}: expected ${transaction.amount}, got ${callbackAmount}`);
            return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
        }

        if (isSuccess) {
            // Update transaction to completed
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'completed',
                    reference: reference
                }
            });

            // Update user balance and totalDeposits
            await prisma.user.update({
                where: { id: transaction.userId },
                data: {
                    balance: { increment: transaction.amount },
                    totalDeposits: { increment: transaction.amount }
                }
            });

            console.log(`Deposit successful: ${transaction.amount} for user ${transaction.userId}`);

            return NextResponse.json({
                success: true,
                message: 'Payment processed successfully',
                amount: transaction.amount
            });
        } else {
            // Payment failed
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'failed',
                    reference: reference
                }
            });

            console.log(`Deposit failed for reference ${reference}: ${ResultDesc || status}`);

            return NextResponse.json({
                success: false,
                message: 'Payment failed',
                reason: ResultDesc || status
            });
        }

    } catch (error) {
        console.error('Callback processing error:', error);
        return NextResponse.json(
            { error: 'Failed to process callback' },
            { status: 500 }
        );
    }
}

// Also handle GET for callback URL verification
export async function GET() {
    return NextResponse.json({ status: 'Callback endpoint active' });
}
