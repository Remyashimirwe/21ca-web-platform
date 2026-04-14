import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function getOptionalDbUser() {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
        return { dbUser: null };
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

export async function GET() {
    try {
        const userResult = await getOptionalDbUser();

        const courses = await prisma.course.findMany({
            where: {
                OR: [
                    { status: 'PUBLISHED' },
                    { isPublished: true },
                ],
            },
            orderBy: {
                publishedAt: 'desc',
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        color: true,
                    },
                },
                instructor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        imageUrl: true,
                        title: true,
                    },
                },
            },
        });

        let enrolledCourseIds = new Set<string>();

        if (userResult.dbUser) {
            const enrollments = await prisma.enrollment.findMany({
                where: { userId: userResult.dbUser.id },
                select: { courseId: true },
            });

            enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
        }

        const payload = courses.map((course) => ({
            ...course,
            isEnrolled: enrolledCourseIds.has(course.id),
        }));

        return NextResponse.json(payload);
    } catch (error) {
        console.error('Error fetching programs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch programs' },
            { status: 500 }
        );
    }
}