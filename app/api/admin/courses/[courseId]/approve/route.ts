import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

async function requireAdmin() {
    const { userId } = await auth();

    if (!userId) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!dbUser) {
        return { error: NextResponse.json({ error: 'User not found' }, { status: 404 }) };
    }

    if (dbUser.role !== 'ADMIN') {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { dbUser };
}

export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const adminCheck = await requireAdmin();
        if ('error' in adminCheck) return adminCheck.error;

        const course = await prisma.course.update({
            where: { id: params.courseId },
            data: {
                status: 'PUBLISHED',
                isPublished: true,
                publishedAt: new Date(),
            },
            include: {
                instructor: true,
            },
        });

        try {
            await createNotification({
                userId: course.instructor.id,
                title: '🎉 Course Approved!',
                message: `Congratulations! Your course "${course.title}" has been approved and is now live on the platform.`,
                type: 'SUCCESS',
                actionUrl: `/courses/${course.slug}`,
            });
        } catch (notificationError) {
            console.error('Notification failed:', notificationError);
        }

        return NextResponse.json(course);
    } catch (error: any) {
        console.error('Error approving course:', error);
        return NextResponse.json(
            { error: 'Failed to approve course', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}