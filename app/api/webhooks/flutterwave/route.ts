import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const premiumPricing: Record<string, { durationDays: number }> = {
    MONTHLY: { durationDays: 30 },
    ANNUAL: { durationDays: 365 },
    LIFETIME: { durationDays: 36500 },
};

export async function POST(req: NextRequest) {
    try {
        const signature = req.headers.get('verif-hash');
        const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

        if (!secretHash || signature !== secretHash) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await req.json();
        const event = payload?.event;
        const data = payload?.data;

        if (!event || !data) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        if (event !== 'charge.completed' || data.status !== 'successful') {
            return NextResponse.json({ success: true, ignored: true });
        }

        const txRef = String(data.tx_ref || '');
        const amount = Number(data.amount);
        const currency = String(data.currency || '').toUpperCase();
        const flutterwavePaymentId = String(data.id || '');
        const paidAt = new Date();

        if (!txRef) {
            return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 });
        }

        if (txRef.startsWith('premium_')) {
            const parts = txRef.split('_');
            const userId = parts[1];
            const planId = parts[2];

            if (!userId || !planId || !premiumPricing[planId]) {
                return NextResponse.json({ error: 'Invalid premium tx_ref' }, { status: 400 });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true },
            });

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const expiresAt =
                planId === 'LIFETIME'
                    ? null
                    : new Date(Date.now() + premiumPricing[planId].durationDays * 24 * 60 * 60 * 1000);

            const existingPayment = await prisma.payment.findFirst({
                where: {
                    paymentIntentId: flutterwavePaymentId,
                    userId,
                },
                select: { id: true },
            });

            if (!existingPayment) {
                await prisma.$transaction([
                    prisma.user.update({
                        where: { id: userId },
                        data: {
                            isPremium: true,
                            premiumPlan: planId as any,
                            premiumExpiresAt: expiresAt,
                        },
                    }),
                    prisma.payment.create({
                        data: {
                            amount,
                            currency,
                            paymentMethod: 'flutterwave',
                            paymentIntentId: flutterwavePaymentId,
                            status: 'COMPLETED',
                            paidAt,
                            userId,
                            courseId: userId,
                        } as any,
                    }),
                ]);
            }

            return NextResponse.json({ success: true, premiumActivated: true });
        }

        if (txRef.startsWith('course_')) {
            const parts = txRef.split('_');
            const courseId = parts[1];
            const userId = parts[2];

            if (!courseId || !userId) {
                return NextResponse.json({ error: 'Invalid course tx_ref' }, { status: 400 });
            }

            const course = await prisma.course.findUnique({
                where: { id: courseId },
                select: {
                    id: true,
                    price: true,
                    currency: true,
                },
            });

            if (!course) {
                return NextResponse.json({ error: 'Course not found' }, { status: 404 });
            }

            const enrollmentExists = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId,
                    },
                },
            });

            if (!enrollmentExists) {
                await prisma.enrollment.create({
                    data: {
                        userId,
                        courseId,
                        status: 'ACTIVE',
                        paymentStatus: 'PAID',
                        transactionRef: txRef,
                    },
                });
            }

            const existingPayment = await prisma.payment.findFirst({
                where: {
                    paymentIntentId: flutterwavePaymentId,
                    userId,
                    courseId,
                },
                select: { id: true },
            });

            if (!existingPayment) {
                await prisma.payment.create({
                    data: {
                        amount,
                        currency,
                        paymentMethod: 'flutterwave',
                        paymentIntentId: flutterwavePaymentId,
                        status: 'COMPLETED',
                        paidAt,
                        userId,
                        courseId,
                    },
                });
            }

            return NextResponse.json({
                success: true,
                enrollmentCreated: !enrollmentExists,
            });
        }

        return NextResponse.json({ success: true, ignored: true });
    } catch (error) {
        console.error('Flutterwave webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}