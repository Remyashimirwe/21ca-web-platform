import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { courseId } = body as { courseId?: string };

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                price: true,
                status: true,
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

        if (Number(course.price) > 0) {
            return NextResponse.json(
                { error: 'This course is paid. Please use the payment flow.' },
                { status: 400 }
            );
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: dbUser.id,
                    courseId,
                },
            },
        });

        if (existingEnrollment) {
            return NextResponse.json({
                success: true,
                enrollmentId: existingEnrollment.id,
                alreadyEnrolled: true,
            });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: dbUser.id,
                courseId,
                status: 'ACTIVE',
                paymentStatus: 'FREE',
                progress: 0,
                transactionRef: `free_${courseId}_${dbUser.id}_${Date.now()}`,
            },
        });

        return NextResponse.json({
            success: true,
            enrollmentId: enrollment.id,
            alreadyEnrolled: false,
        });
    } catch (error) {
        console.error('Free enrollment error:', error);
        return NextResponse.json(
            { error: 'Failed to enroll in course' },
            { status: 500 }
        );
    }
}