import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/payment/status?refid={refId}
 * 
 * Check the status of a payment by its reference ID (client_token)
 * This endpoint is called by the frontend polling mechanism after user returns from Afripay
 */
export async function GET(req: NextRequest) {
    try {
        const refId = req.nextUrl.searchParams.get('refid');

        if (!refId) {
            return NextResponse.json({ error: 'Missing refid parameter' }, { status: 400 });
        }

        // Look up the payment by reference ID
        const payment = await prisma.payment.findFirst({
            where: { paymentIntentId: refId },
            select: {
                id: true,
                status: true,
                userId: true,
                courseId: true,
            },
        });

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Map database status to frontend status
        let status: 'pending' | 'success' | 'failed' = 'pending';
        
        if (payment.status === 'COMPLETED') {
            status = 'success';
        } else if (payment.status === 'FAILED') {
            status = 'failed';
        }

        return NextResponse.json({
            status,
            refId,
            paymentId: payment.id,
            userId: payment.userId,
            courseId: payment.courseId,
        });
    } catch (error) {
        console.error('Payment status check error:', error);
        return NextResponse.json(
            { error: 'Failed to check payment status' },
            { status: 500 }
        );
    }
}
