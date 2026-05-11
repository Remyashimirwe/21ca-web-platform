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
    { params }: { params: Promise<{ courseId: string }> }
): Promise<Response> {
    try {
        const adminCheck = await requireAdmin();
        if ('error' in adminCheck) return adminCheck.error as Response;

        const body = await req.json().catch(() => ({}));
        const reason =
            typeof body.reason === 'string' && body.reason.trim()
                ? body.reason.trim()
                : 'Your course submission needs changes before approval.';

        const { courseId } = await params;

        const course = await prisma.course.update({
            where: { id: courseId },
            data: {
                status: 'ARCHIVED',
                isPublished: false,
                publishedAt: null,
            },
            include: {
                instructor: true,
            },
        });

        try {
            await createNotification({
                userId: course.instructor.id,
                title: 'Course Review Result',
                message: `Your course "${course.title}" was rejected. ${reason}`,
                type: 'WARNING',
                actionUrl: '/instructor/courses',
            });
        } catch (notificationError) {
            console.error('Notification failed:', notificationError);
        }

        return NextResponse.json({
            message: 'Course rejected successfully',
            course,
        });
    } catch (error: any) {
        console.error('Error rejecting course:', error);
        return NextResponse.json(
            { error: 'Failed to reject course', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}