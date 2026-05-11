import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
): Promise<Response> {
    try {
        const { userId } = await auth();
        const { courseId } = await params;

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                price: true,
                currency: true,
                status: true,
            },
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const isFreeCourse = Number(course.price) === 0;

        if (!userId) {
            return NextResponse.json({
                isPremium: false,
                enrolled: false,
                isFreeCourse,
            });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: {
                id: true,
                isPremium: true,
                premiumExpiresAt: true,
                premiumPlan: true,
            },
        });

        if (!dbUser) {
            return NextResponse.json({
                isPremium: false,
                enrolled: false,
                isFreeCourse,
            });
        }

        const now = new Date();
        const premiumActive =
            dbUser.isPremium &&
            (dbUser.premiumPlan === 'LIFETIME' ||
                !dbUser.premiumExpiresAt ||
                dbUser.premiumExpiresAt > now);

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: dbUser.id,
                    courseId,
                },
            },
            select: {
                id: true,
            },
        });

        return NextResponse.json({
            isPremium: premiumActive,
            enrolled: Boolean(enrollment),
            isFreeCourse,
        });
    } catch (error) {
        console.error('Error checking course access:', error);
        return NextResponse.json(
            { error: 'Failed to check course access' },
            { status: 500 }
        );
    }
}