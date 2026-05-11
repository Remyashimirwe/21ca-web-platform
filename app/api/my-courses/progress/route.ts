import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

export async function POST(req: NextRequest): Promise<Response> {
    try {
        const userResult = await getOrCreateDbUser();
        if ('error' in userResult) return userResult.error as Response;

        const { dbUser } = userResult;
        const body = await req.json();
        const { enrollmentId, lessonId, isCompleted, watchTime } = body;

        if (!enrollmentId || !lessonId) {
            return NextResponse.json({ error: 'Missing enrollmentId or lessonId' }, { status: 400 });
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
        });

        if (!enrollment || enrollment.userId !== dbUser.id) {
            return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
        }

        await prisma.lessonProgress.upsert({
            where: {
                enrollmentId_lessonId: {
                    enrollmentId,
                    lessonId,
                },
            },
            create: {
                enrollmentId,
                lessonId,
                isCompleted: Boolean(isCompleted),
                watchTime: Number(watchTime) || 0,
                completedAt: isCompleted ? new Date() : null,
            },
            update: {
                isCompleted: typeof isCompleted === 'boolean' ? isCompleted : undefined,
                watchTime: typeof watchTime === 'number' ? watchTime : undefined,
                completedAt: isCompleted ? new Date() : undefined,
            },
        });

        const progressItems = await prisma.lessonProgress.findMany({
            where: { enrollmentId },
            select: { isCompleted: true },
        });

        const totalLessons = await prisma.lesson.count({
            where: {
                module: {
                    courseId: enrollment.courseId,
                },
            },
        });

        const completedLessons = progressItems.filter((item) => item.isCompleted).length;
        const newProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                progress: newProgress,
                currentLesson: lessonId,
                status: newProgress >= 100 ? 'COMPLETED' : 'ACTIVE',
                completedAt: newProgress >= 100 ? new Date() : null,
            },
        });

        // Generate certificate if course is completed
        if (newProgress >= 100) {
            const existingCertificate = await prisma.certificate.findUnique({
                where: {
                    userId_courseId: {
                        userId: dbUser.id,
                        courseId: enrollment.courseId,
                    },
                },
            });

            if (!existingCertificate) {
                await prisma.certificate.create({
                    data: {
                        certificateId: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
                        userId: dbUser.id,
                        courseId: enrollment.courseId,
                        issuedAt: new Date(),
                    },
                });

                // Also create a notification for the user
                await prisma.notification.create({
                    data: {
                        userId: dbUser.id,
                        title: 'Course Completed!',
                        message: `Congratulations! You've completed the course. Your certificate is now available.`,
                        type: 'CERTIFICATE',
                    },
                });
            }
        }

        return NextResponse.json({
            success: true,
            progress: newProgress,
        });
    } catch (error: any) {
        console.error('Error saving lesson progress:', error);
        return NextResponse.json(
            { error: 'Failed to save progress', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}