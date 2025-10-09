// app/api/admin/courses/[courseId]/reject/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userRole = user.publicMetadata?.role as string;
        if (userRole !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { reason } = body;

        const course = await prisma.course.update({
            where: { id: params.courseId },
            data: {
                status: 'DRAFT'
            },
            include: {
                instructor: true
            }
        });

        // Send notification to instructor with rejection reason
        await createNotification({
            userId: course.instructor.id,
            title: 'Course Needs Revision',
            message: `Your course "${course.title}" requires some changes. Reason: ${reason}`,
            type: 'WARNING',
            actionUrl: `/instructor/courses/${course.id}/edit`
        });

        console.log(`Course ${course.id} rejected and notification sent to instructor ${course.instructor.id}`);

        return NextResponse.json(course);
    } catch (error) {
        console.error('Error rejecting course:', error);
        return NextResponse.json(
            { error: 'Failed to reject course' },
            { status: 500 }
        );
    }
}