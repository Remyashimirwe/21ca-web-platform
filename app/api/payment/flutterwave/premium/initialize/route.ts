import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { flutterwaveSecretKey } from '@/lib/flutterwave';

const premiumPricing: Record<string, { amount: number; durationDays: number }> = {
    MONTHLY: { amount: 25, durationDays: 30 },
    ANNUAL: { amount: 200, durationDays: 365 },
    LIFETIME: { amount: 500, durationDays: 36500 },
};

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { planId } = (await req.json()) as { planId?: string };

        if (!planId || !premiumPricing[planId]) {
            return NextResponse.json({ error: 'Invalid premium plan' }, { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const plan = premiumPricing[planId];
        const txRef = `premium_${dbUser.id}_${planId}_${Date.now()}`;

        const paymentResponse = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${flutterwaveSecretKey}`,
            },
            body: JSON.stringify({
                tx_ref: txRef,
                amount: plan.amount,
                currency: 'USD',
                redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?type=premium&planId=${planId}&tx_ref=${txRef}`,
                customer: {
                    email: clerkUser.emailAddresses[0]?.emailAddress || dbUser.email,
                    name: `${clerkUser.firstName || dbUser.firstName || ''} ${clerkUser.lastName || dbUser.lastName || ''}`.trim(),
                },
                customizations: {
                    title: `Premium ${planId}`,
                    description: `Purchase ${planId} premium access`,
                },
                meta: {
                    userId: dbUser.id,
                    planId,
                    type: 'premium',
                },
            }),
        });

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok) {
            return NextResponse.json(
                { error: paymentData?.message || 'Failed to initialize premium payment' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            paymentLink: paymentData?.data?.link,
            txRef,
            amount: plan.amount,
            planId,
        });
    } catch (error) {
        console.error('Premium initialize error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize premium payment' },
            { status: 500 }
        );
    }
}