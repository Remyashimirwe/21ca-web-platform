import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrencyByCountry, buildCheckoutPayload, buildCheckoutResponse, generateRefId } from '@/lib/afripay';
import { rateLimit, tooManyRequestsResponse } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate-limit per Clerk user — an attacker can otherwise spawn unbounded
        // PENDING Payment rows tied to their account.
        const rl = rateLimit({
            key: `pay-init:${userId}`,
            limit: 10,
            windowMs: 60 * 1000,
        });
        if (!rl.success) {
            return tooManyRequestsResponse(rl.resetAt);
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

        const currency = (course.currency || getCurrencyByCountry(countryCode)) as "RWF" | "USD";
        const amount = Number(course.price);

        const refId = generateRefId(dbUser.id);
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/status?refid=${refId}`;

        // Save pending payment to database
        await prisma.payment.create({
            data: {
                userId: dbUser.id,
                courseId: course.id,
                amount,
                currency,
                status: 'PENDING',
                paymentIntentId: refId,
                paymentMethod: 'afripay',
            } as any,
        });

        // Build checkout payload
        const checkoutPayload = buildCheckoutPayload({
            userId: dbUser.id,
            amount,
            currency,
            description: `Payment for ${course.title}`,
            returnUrl,
        });

        const checkoutResponse = buildCheckoutResponse(checkoutPayload);

        return NextResponse.json(checkoutResponse);
    } catch (error) {
        // Keep internal details (Prisma error text, schema names, stack) on the
        // server only — return a generic message to the client so we don't leak
        // implementation info that helps an attacker enumerate the backend.
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Afripay initialize error:', {
            message: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: 'Failed to initialize payment' },
            { status: 500 }
        );
    }
}
