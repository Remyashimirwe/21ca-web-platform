import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { flutterwaveSecretKey, getCurrencyByCountry } from '@/lib/flutterwave';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { courseId, countryCode } = body as {
            courseId?: string;
            countryCode?: string;
        };

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                price: true,
                currency: true,
                status: true,
                instructorId: true,
            },
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.status !== 'PUBLISHED') {
            return NextResponse.json(
                { error: 'This course is not available for enrollment yet' },
                { status: 400 }
            );
        }

        if (!course.price || Number(course.price) <= 0) {
            return NextResponse.json({ error: 'Course is free' }, { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const currency = course.currency || getCurrencyByCountry(countryCode);
        const amount = Number(course.price);

        const txRef = `course_${course.id}_${dbUser.id}_${Date.now()}`;

        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

        if (!secretKey) {
            return NextResponse.json(
                { error: 'Flutterwave secret key is missing' },
                { status: 500 }
            );
        }

        const paymentResponse = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            },
            body: JSON.stringify({
                tx_ref: txRef,
                amount,
                currency,
                redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?courseId=${course.id}&tx_ref=${txRef}`,
                customer: {
                    email: clerkUser.emailAddresses[0]?.emailAddress || dbUser.email,
                    name: `${clerkUser.firstName || dbUser.firstName || ''} ${clerkUser.lastName || dbUser.lastName || ''}`.trim(),
                },
                customizations: {
                    title: course.title,
                    description: `Payment for ${course.title}`,
                },
                meta: {
                    courseId: course.id,
                    userId: dbUser.id,
                },
            }),
        });

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok) {
            return NextResponse.json(
                { error: paymentData?.message || 'Failed to initialize payment' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            paymentLink: paymentData?.data?.link,
            txRef,
            currency,
            amount,
        });
    } catch (error) {
        console.error('Flutterwave initialize error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}