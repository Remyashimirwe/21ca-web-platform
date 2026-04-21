import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
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

        const body = await req.json();
        const { enrollmentId, lessonId, type, answers } = body;

        if (!enrollmentId || !lessonId || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
        });

        if (!enrollment || enrollment.userId !== dbUser.id) {
            return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
        }

        // Check if there's an assignment model linked to this lesson (if it's an ASSIGNMENT type)
        // Or if we should use the Submission model for both Quiz and Assignment results.
        // The Submission model in schema.prisma is linked to an Assignment model.
        // model Assignment { id, courseId, creatorId ... }
        // model Submission { id, content, attachments, points, feedback, status, assignmentId, studentId }

        // It seems the Submission model is intended for a separate Assignment entity, 
        // not necessarily a Lesson of type ASSIGNMENT directly.
        // However, for this simplified implementation, we can either:
        // 1. Create an Assignment record for the lesson if it doesn't exist.
        // 2. Just record the submission in a more flexible way if the schema allowed it.
        
        // Let's check if there is an Assignment for this lesson. 
        // Actually, the schema says:
        // model Lesson { ... assignmentQuestions AssignmentQuestion[] }
        // model Assignment { ... courseId ... }
        
        // This is a bit disconnected. Let's assume for now we save the result in LessonProgress or similar,
        // but the user wants "submit for review". 
        // I will use a simple approach: find if an Assignment exists for this course with the same title, 
        // or just create one as a container for these submissions.
        
        // Better: Let's see if we can use the Submission model by linking it to a placeholder Assignment 
        // if no specific one is found.
        
        // 1. Find the instructor of the course
        const course = await prisma.course.findUnique({
            where: { id: enrollment.courseId },
            select: { instructorId: true }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        let assignment = await prisma.assignment.findFirst({
            where: {
                courseId: enrollment.courseId,
                title: { contains: lessonId }, // Using lessonId as a reference
            }
        });

        if (!assignment) {
            // Create a shadow assignment to hold these submissions
            const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }});
            assignment = await prisma.assignment.create({
                data: {
                    title: `${lesson?.title || 'Lesson'} - ${lessonId}`,
                    description: lesson?.description || 'Lesson submission',
                    instructions: 'Submitted via lesson interface',
                    courseId: enrollment.courseId,
                    creatorId: course.instructorId, // Correctly link to instructor
                    isPublished: true,
                }
            });
        }

        const submission = await prisma.submission.upsert({
            where: {
                assignmentId_studentId: {
                    assignmentId: assignment.id,
                    studentId: dbUser.id,
                }
            },
            create: {
                assignmentId: assignment.id,
                studentId: dbUser.id,
                content: JSON.stringify(answers),
                status: 'SUBMITTED',
            },
            update: {
                content: JSON.stringify(answers),
                status: 'SUBMITTED',
                submittedAt: new Date(),
            }
        });

        // 🔔 Notify the instructor about the new submission
        await createNotification({
            userId: course.instructorId,
            title: '📝 New Submission',
            message: `${dbUser.firstName} ${dbUser.lastName} submitted work for review.`,
            type: 'ASSIGNMENT',
            actionUrl: `/instructor/submissions`
        });

        return NextResponse.json({
            success: true,
            submissionId: submission.id,
        });
    } catch (error: any) {
        console.error('Error submitting lesson content:', error);
        return NextResponse.json(
            { error: 'Failed to submit', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}
