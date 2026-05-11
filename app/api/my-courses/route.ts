import { NextResponse } from 'next/server';
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

export async function GET(): Promise<Response> {
    try {
        const userResult = await getOrCreateDbUser();
        if ('error' in userResult) return userResult.error as Response;

        const { dbUser } = userResult;

        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId: dbUser.id,
            },
            include: {
                course: {
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
                            },
                        },
                    },
                },
            },
            orderBy: {
                enrolledAt: 'desc',
            },
        });

        const courses = enrollments.map((enrollment: typeof enrollments[number]) => ({
            enrollmentId: enrollment.id,
            enrolledAt: enrollment.enrolledAt,
            progress: enrollment.progress,
            status: enrollment.status,
            course: enrollment.course,
        }));

        return NextResponse.json(courses);
    } catch (error: any) {
        console.error('Error fetching my courses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch my courses', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}