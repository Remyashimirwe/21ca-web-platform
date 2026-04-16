import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const premiumPrices: Record<string, number> = {
    MONTHLY: 25,
    ANNUAL: 200,
    LIFETIME: 500,

};

const supportedPlans = new Set(['MONTHLY', 'ANNUAL', 'LIFETIME']);

export async function POST(req: NextRequest) {
    try {
        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

        if (!secretKey) {
            return NextResponse.json(
                { error: 'Flutterwave secret key is missing' },
                { status: 500 }
            );
        }

        const { userId: clerkUserId } = await auth();

        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const planId = String(body?.planId || '').toUpperCase();

        if (!supportedPlans.has(planId)) {
            return NextResponse.json({ error: 'Invalid premium plan' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUserId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const amount = premiumPrices[planId];
        const txRef = `premium_${user.id}_${planId}_${Date.now()}`;

        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.APP_URL ||
            'http://localhost:3000';

        const paymentPayload = {
            tx_ref: txRef,
            amount,
            currency: 'USD',
            payment_options: 'card,mobilemoney,ussd',
            redirect_url: `${baseUrl}/payment/success?type=premium`,
            customer: {
                email: user.email,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
            },
            customizations: {
                title: 'Premium Subscription',
                description: `Payment for ${planId} premium access`,
            },
            meta: {
                type: 'premium',
                userId: user.id,
                planId,
            },
        };

        const flutterwaveRes = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${secretKey}`,
            },
            body: JSON.stringify(paymentPayload),
        })
        .catch((err) => {
            console.log('Flutterwave error', err);
            throw new Error('Flutterwave error');
        });

        const data = await flutterwaveRes.json();

        if (!flutterwaveRes.ok) {
            return NextResponse.json(
                {
                    error:
                        data?.message ||
                        data?.meta?.authorization ||
                        'Failed to initialize payment',
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            paymentLink: data?.data?.link || data?.link,
            txRef,
            amount,
            currency: 'USD',
        });
    } catch (error) {
        console.error('Premium payment initialization error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize premium payment' },
            { status: 500 }
        );
    }
}