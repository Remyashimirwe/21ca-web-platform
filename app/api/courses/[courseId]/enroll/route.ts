import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

async function getOrCreateDbUser() {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    let dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!dbUser) {
        const clerkRole = (clerkUser.publicMetadata?.role as string) || 'user';
        const userRole = clerkRole.toUpperCase();
        const validRoles = ['USER', 'INSTRUCTOR', 'ADMIN', 'PARTNER'];
        const finalRole = validRoles.includes(userRole) ? userRole : 'USER';

        dbUser = await prisma.user.create({
            data: {
                clerkId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                imageUrl: clerkUser.imageUrl || '',
                role: finalRole as any,
            },
        });
    }

    return { dbUser };
}

export async function POST(
    req: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const userResult = await getOrCreateDbUser();
        if ('error' in userResult) return userResult.error;

        const { dbUser } = userResult;

        const course = await prisma.course.findUnique({
            where: { id: params.courseId },
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (course.status !== 'PUBLISHED' && !course.isPublished) {
            return NextResponse.json(
                { error: 'Course is not available for enrollment yet' },
                { status: 400 }
            );
        }

        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: dbUser.id,
                    courseId: course.id,
                },
            },
        });

        if (existingEnrollment) {
            return NextResponse.json(
                { error: 'You are already enrolled in this course' },
                { status: 409 }
            );
        }

        const enrollment = await prisma.$transaction(async (tx) => {
            const createdEnrollment = await tx.enrollment.create({
                data: {
                    userId: dbUser.id,
                    courseId: course.id,
                },
            });

            await tx.course.update({
                where: { id: course.id },
                data: {
                    enrollmentCount: {
                        increment: 1,
                    },
                },
            });

            return createdEnrollment;
        });

        // 🔔 Notify the instructor about the new enrollment
        const instructor = await prisma.user.findUnique({
            where: { id: course.instructorId }
        });

        if (instructor) {
            await createNotification({
                userId: instructor.id,
                title: '🎓 New Enrollment',
                message: `${dbUser.firstName} ${dbUser.lastName} has enrolled in your course: ${course.title}`,
                type: 'SUCCESS',
                actionUrl: `/instructor/courses/${course.id}`
            });
        }

        return NextResponse.json({
            success: true,
            enrollment,
            courseSlug: course.slug,
        });
    } catch (error: any) {
        console.error('Error enrolling in course:', error);
        return NextResponse.json(
            { error: 'Failed to enroll in course', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}