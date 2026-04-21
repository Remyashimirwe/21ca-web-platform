import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

export async function POST(
    req: NextRequest,
    { params }: { params: { submissionId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { points, feedback } = await req.json();
        const submissionId = params.submissionId;

        // Verify the instructor owns the assignment
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                assignment: true
            }
        });

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        if (submission.assignment.creatorId !== dbUser.id) {
            return NextResponse.json({ error: 'Unauthorized to grade this submission' }, { status: 403 });
        }

        const updatedSubmission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                points: points !== undefined ? parseInt(points) : undefined,
                feedback: feedback || undefined,
                status: 'GRADED',
                gradedAt: new Date(),
            }
        });

        // 🔔 Notify the student about the grade
        await createNotification({
            userId: submission.studentId,
            title: '⭐ Assignment Graded',
            message: `Your submission has been graded. Points: ${points}`,
            type: 'SUCCESS',
            actionUrl: `/my-courses/${submission.assignment.courseId}`
        });

        return NextResponse.json(updatedSubmission);
    } catch (error: any) {
        console.error('Error grading submission:', error);
        return NextResponse.json(
            { error: 'Failed to grade submission', details: error?.message },
            { status: 500 }
        );
    }
}
