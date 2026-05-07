import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { buildCheckoutPayload, buildCheckoutResponse, generateRefId } from '@/lib/afripay';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { planId, currency: requestedCurrency, amount } = body as {
            planId?: string;
            currency?: string;
            amount?: number;
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

        const finalAmount = amount || planPrices[planId] || 5000;
        const currency = (requestedCurrency || 'RWF') as "RWF" | "USD";

        if (finalAmount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
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
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Afripay premium initialize error:', {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: errorMessage || 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
