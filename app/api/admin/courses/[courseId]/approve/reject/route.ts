import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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
            }
        });

        // TODO: Send notification to instructor with rejection reason

        return NextResponse.json(course);
    } catch (error) {
        console.error('Error rejecting course:', error);
        return NextResponse.json(
            { error: 'Failed to reject course' },
            { status: 500 }
        );
    }
}