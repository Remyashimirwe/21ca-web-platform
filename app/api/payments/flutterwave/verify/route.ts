import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { flutterwaveSecretKey } from '@/lib/flutterwave';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { transactionId, courseId, txRef } = body as {
            transactionId?: string;
            courseId?: string;
            txRef?: string;
        };

        if (!transactionId || !courseId || !txRef) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const verifyRes = await fetch(
            `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${flutterwaveSecretKey}`,
                },
            }
        );

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || verifyData?.status !== 'success') {
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        const transaction = verifyData?.data;

        if (transaction?.status !== 'successful') {
            return NextResponse.json(
                { error: 'Transaction not successful' },
                { status: 400 }
            );
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                price: true,
                currency: true,
            },
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const flutterwaveVerifyRes = await fetch(
            `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${flutterwaveSecretKey}`,
                },
            }
        );

        const flutterwaveVerifyData = await flutterwaveVerifyRes.json();

        if (!flutterwaveVerifyRes.ok || flutterwaveVerifyData?.status !== 'success') {
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        const flutterwaveTransaction = flutterwaveVerifyData?.data;

        if (!flutterwaveTransaction || flutterwaveTransaction.status !== 'successful') {
            return NextResponse.json(
                { error: 'Transaction not successful' },
                { status: 400 }
            );
        }

        const paidAmount = Number(flutterwaveTransaction.amount);
        const courseAmount = Number(course.price);
        const paidCurrency = String(flutterwaveTransaction.currency || '').toUpperCase();
        const expectedCurrency = String(course.currency || 'USD').toUpperCase();

        if (paidAmount !== courseAmount) {
            return NextResponse.json(
                { error: 'Payment amount does not match course price' },
                { status: 400 }
            );
        }

        if (paidCurrency !== expectedCurrency) {
            return NextResponse.json(
                { error: 'Payment currency does not match course currency' },
                { status: 400 }
            );
        }

        if (flutterwaveTransaction.tx_ref !== txRef) {
            return NextResponse.json(
                { error: 'Invalid transaction reference' },
                { status: 400 }
            );
        }

        if (!txRef.includes(dbUser.id) || !txRef.includes(course.id)) {
            return NextResponse.json(
                { error: 'Transaction does not belong to this user or course' },
                { status: 400 }
            );
        }

        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: dbUser.id,
                    courseId: course.id,
                },
            },
        });

        if (existingEnrollment) {
            return NextResponse.json({
                success: true,
                message: 'Already enrolled',
                enrollment: existingEnrollment,
            });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: dbUser.id,
                courseId: course.id,
                status: 'ACTIVE',
                paymentStatus: 'PAID',
                transactionRef: txRef,
            } as any,
        });

        return NextResponse.json({
            success: true,
            enrollment,
        });
    } catch (error) {
        console.error('Flutterwave verify error:', error);
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}