import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
//change it into the afripay api for payment and to us the axios 
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

        const planSettings = await prisma.premiumPlanSettings.findUnique({
            where: { plan: planId as any, isActive: true },
        });

        if (!planSettings) {
            return NextResponse.json({ error: 'Invalid or inactive premium plan' }, { status: 400 });
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

        const amount = Number(planSettings.price);
        const txRef = `premium_${user.id}_${planSettings.plan}_${Date.now()}`;

        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.APP_URL ||
            'http://localhost:3000';

        const paymentPayload = {
            tx_ref: txRef,
            amount,
            currency: planSettings.currency,
            payment_options: 'card,mobilemoney,ussd',
            redirect_url: `${baseUrl}/payment/success?type=premium`,
            customer: {
                email: user.email,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
            },
            customizations: {
                title: `${planSettings.name} Premium Access`,
                description: planSettings.description || `Payment for ${planSettings.name} premium access`,
            },
            meta: {
                type: 'premium',
                userId: user.id,
                planId: planSettings.plan,
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
// we want also to use the change currency so that you can pay in rwf and other currncy
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