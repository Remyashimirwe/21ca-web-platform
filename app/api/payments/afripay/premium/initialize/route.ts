import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { buildCheckoutPayload, buildCheckoutResponse, generateRefId } from '@/lib/afripay';
import { rateLimit, tooManyRequestsResponse } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate-limit per Clerk user to prevent abuse / mass-PENDING creation.
        const rl = rateLimit({
            key: `premium-init:${userId}`,
            limit: 10,
            windowMs: 60 * 1000,
        });
        if (!rl.success) {
            return tooManyRequestsResponse(rl.resetAt);
        }

        const body = await req.json();
        // NOTE: deliberately *do not* destructure `amount` from the body — the
        // price must come from the server-side plan table below, never from the
        // client (otherwise users can pay 1 RWF for a LIFETIME plan).
        const { planId, currency: requestedCurrency } = body as {
            planId?: string;
            currency?: string;
        };

        if (!planId) {
            return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
        }

        const validPlans = ['MONTHLY', 'ANNUAL', 'LIFETIME'];
        if (!validPlans.includes(planId)) {
            return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Set default amounts for each plan (adjust as needed)
        const planPrices: Record<string, number> = {
            MONTHLY: 5000,    // 5000 RWF
            ANNUAL: 50000,    // 50000 RWF
            LIFETIME: 150000, // 150000 RWF
        };

        // Price is taken *only* from the server-side plan table.
        const finalAmount = planPrices[planId];
        const currency = (requestedCurrency || 'RWF') as "RWF" | "USD";

        if (!finalAmount || finalAmount <= 0) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        const refId = generateRefId(dbUser.id);
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/status?refid=${refId}`;

        // Save pending payment to database
        await prisma.payment.create({
            data: {
                userId: dbUser.id,
                amount: finalAmount,
                currency,
                status: 'PENDING',
                paymentIntentId: refId,
                paymentMethod: 'afripay',
                courseId: null, // Premium payments not tied to specific course
            } as any,
        });

        // Build checkout payload
        const checkoutPayload = buildCheckoutPayload({
            userId: dbUser.id,
            amount: finalAmount,
            currency,
            description: `Premium Subscription - ${planId}`,
            returnUrl,
        });

        const checkoutResponse = buildCheckoutResponse(checkoutPayload);

        return NextResponse.json({
            ...checkoutResponse,
            planId,
        });
    } catch (error) {
        // Never echo raw error text back to the client (can leak Prisma /
        // schema internals); keep details in server logs only.
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Afripay premium initialize error:', {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
