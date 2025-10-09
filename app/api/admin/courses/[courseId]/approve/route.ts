// app/api/admin/courses/[courseId]/approve/route.ts
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

        const course = await prisma.course.update({
            where: { id: params.courseId },
            data: {
                status: 'PUBLISHED',
                isPublished: true,
                publishedAt: new Date()
            },
            include: {
                instructor: true
            }
        });

        // Send notification to instructor
        await createNotification({
            userId: course.instructor.id,
            title: '🎉 Course Approved!',
            message: `Congratulations! Your course "${course.title}" has been approved and is now live on the platform.`,
            type: 'SUCCESS',
            actionUrl: `/courses/${course.slug}`
        });

        console.log(`Course ${course.id} approved and notification sent to instructor ${course.instructor.id}`);

        return NextResponse.json(course);
    } catch (error) {
        console.error('Error approving course:', error);
        return NextResponse.json(
            { error: 'Failed to approve course' },
            { status: 500 }
        );
    }
}