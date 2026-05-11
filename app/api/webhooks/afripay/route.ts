import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
    isValidWebhookPayload, 
    processWebhookPayload,
    AfripayWebhookPayload,
} from '@/lib/afripay';

const premiumPricing: Record<string, { durationDays: number }> = {
    MONTHLY: { durationDays: 30 },
    ANNUAL: { durationDays: 365 },
    LIFETIME: { durationDays: 3600 },
};

/**
 * Parse webhook payload from both JSON and form-urlencoded formats
 */
async function extractPayload(req: NextRequest): Promise<Record<string, unknown>> {
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
        return await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        const payload: Record<string, unknown> = {};
        for (const [key, value] of formData.entries()) {
            payload[key] = value;
        }
        return payload;
    }
    
    // Try JSON by default
    try {
        return await req.json();
    } catch {
        return {};
    }
}

export async function POST(req: NextRequest) {
    try {
        // Extract payload safely (handle JSON or Form-Data)
        const body = await extractPayload(req);
        
        if (!isValidWebhookPayload(body)) {
            console.warn('Invalid Afripay webhook payload:', body);
            return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
        }

        const payload = body as AfripayWebhookPayload;
        const { status, transaction_ref, payment_method, client_token } = payload;

        // Look up the payment by the client_token (refId)
        const payment = await prisma.payment.findFirst({
            where: { paymentIntentId: client_token },
            include: { user: true },
        });

        if (!payment) {
            console.warn(`Payment not found for client_token: ${client_token}`);
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Idempotency Check: Don't process an already completed payment
        if (payment.status !== 'PENDING') {
            console.log(`Payment already processed: ${client_token}, status: ${payment.status}`);
            return NextResponse.json({ success: true, alreadyProcessed: true });
        }

        // Process the webhook payload
        const updateData = processWebhookPayload(payload);

        // Update payment status
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: updateData.status === 'success' ? 'COMPLETED' : 'FAILED',
                paymentMethod: 'afripay',
                ...((updateData.providerRef) && { transactionRef: updateData.providerRef }),
                paidAt: updateData.status === 'success' ? new Date() : null,
            },
        });

        // Only proceed with fulfillment if payment was successful
        if (updateData.status !== 'success') {
            console.log(`Payment failed for client_token: ${client_token}`);
            return NextResponse.json({ success: true, paymentFailed: true });
        }

        // Determine if this is a premium or course payment based on payment record
        const isPremium = !payment.courseId || payment.courseId === payment.userId;

        if (isPremium) {
            // Handle premium subscription
            const user = await prisma.user.findUnique({
                where: { id: payment.userId },
                select: { id: true, premiumPlan: true },
            });

            if (!user) {
                console.error(`User not found for premium payment: ${payment.userId}`);
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            // Determine plan from payment metadata or default to MONTHLY
            const planId = 'MONTHLY' as 'MONTHLY' | 'ANNUAL' | 'LIFETIME'; // This should ideally come from payment metadata

            const expiresAt =
                planId === 'LIFETIME'
                    ? null
                    : new Date(Date.now() + premiumPricing[planId].durationDays * 24 * 60 * 60 * 1000);

            // Update user premium status
            await prisma.user.update({
                where: { id: payment.userId },
                data: {
                    isPremium: true,
                    premiumPlan: planId as any,
                    premiumExpiresAt: expiresAt,
                },
            });

            console.log(`Premium activated for user ${payment.userId}, plan: ${planId}`);
            return NextResponse.json({ success: true, premiumActivated: true });
        } else {
            // Handle course enrollment
            const courseId = payment.courseId;
            const userId = payment.userId;

            if (!courseId) {
                console.error(`Course payment missing courseId: ${payment.id}`);
                return NextResponse.json({ error: 'Invalid course payment' }, { status: 400 });
            }

            // Check if user is already enrolled
            const enrollmentExists = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId,
                    },
                },
            });

            // Create enrollment if it doesn't exist
            if (!enrollmentExists) {
                await prisma.enrollment.create({
                    data: {
                        userId,
                        courseId,
                        status: 'ACTIVE',
                        paymentStatus: 'PAID',
                        transactionRef: client_token,
                    },
                });
                console.log(`Enrollment created for user ${userId}, course ${courseId}`);
            }

            return NextResponse.json({
                success: true,
                enrollmentCreated: !enrollmentExists,
            });
        }
    } catch (error) {
        console.error('Afripay webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
