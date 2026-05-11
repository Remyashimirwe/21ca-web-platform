import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
    isValidWebhookPayload,
    processWebhookPayload,
    verifyWebhookSignature,
    afripayAppSecret,
    AfripayWebhookPayload,
} from '@/lib/afripay';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';

const premiumPricing: Record<string, { durationDays: number }> = {
    MONTHLY: { durationDays: 30 },
    ANNUAL: { durationDays: 365 },
    LIFETIME: { durationDays: 3600 },
};

/**
 * Parse a webhook payload from a *raw* body string.
 *
 * We deliberately do not call `req.json()` / `req.formData()` directly, because
 * HMAC verification must run against the exact bytes Afripay signed — any
 * re-serialization would change whitespace/key-order and break the digest.
 */
function parseRawPayload(rawBody: string, contentType: string): Record<string, unknown> | null {
    const ct = contentType.toLowerCase();

    if (ct.includes('application/json')) {
        try {
            return JSON.parse(rawBody);
        } catch {
            return null;
        }
    }

    if (ct.includes('application/x-www-form-urlencoded')) {
        try {
            const params = new URLSearchParams(rawBody);
            const out: Record<string, unknown> = {};
            params.forEach((v, k) => {
                out[k] = v;
            });
            return out;
        } catch {
            return null;
        }
    }

    // Best-effort JSON fallback (some providers omit the header).
    try {
        return JSON.parse(rawBody);
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        // Rate-limit by IP — webhooks are public, so brute-forcing `client_token`s
        // (or replaying old payloads) must be cheap to throttle.
        const ip = getClientIp(req);
        const rl = rateLimit({
            key: `afripay-webhook:${ip}`,
            limit: 30,
            windowMs: 60 * 1000,
        });
        if (!rl.success) {
            return tooManyRequestsResponse(rl.resetAt);
        }

        // 1. Read the raw body *exactly once*. Required for HMAC verification.
        const rawBody = await req.text();
        const contentType = req.headers.get('content-type') || '';

        // 2. Verify the HMAC signature against AFRIPAY_APP_SECRET.
        //    Accept the common header names Afripay / proxies might use.
        const signatureHeader =
            req.headers.get('x-afripay-signature') ||
            req.headers.get('x-signature') ||
            req.headers.get('afripay-signature');

        if (!afripayAppSecret) {
            console.error('AFRIPAY_APP_SECRET is not configured — refusing to process webhook.');
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
        }

        if (!verifyWebhookSignature(rawBody, signatureHeader, afripayAppSecret)) {
            console.warn('Afripay webhook signature verification failed', {
                ip,
                hasHeader: Boolean(signatureHeader),
                contentType,
            });
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // 3. Parse + shape-validate the payload.
        const body = parseRawPayload(rawBody, contentType);
        if (!body || !isValidWebhookPayload(body)) {
            console.warn('Invalid Afripay webhook payload:', body);
            return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
        }

        const payload = body as AfripayWebhookPayload;
        const { client_token } = payload;

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
