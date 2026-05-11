import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CourseReviewDetails from '@/components/admin/courses/CourseReviewDetails';
import { prisma } from '@/lib/prisma';

export default async function AdminCourseDetailPage({
                                                        params,
                                                    }: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    const userRole = String(user.publicMetadata?.role || '').toUpperCase();
    if (userRole !== 'ADMIN') {
        redirect('/dashboard');
    }

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            instructor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    imageUrl: true,
                    role: true,
                },
            },
            category: true,
            modules: {
                include: {
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            type: true,
                            isFree: true,
                        },
                        orderBy: {
                            sortOrder: 'asc',
                        },
                    },
                },
                orderBy: {
                    sortOrder: 'asc',
                },
            },
        },
    });

    if (!course) {
        redirect('/admin/courses');
    }

    const plainCourse = JSON.parse(JSON.stringify(course));

    return (
        <DashboardLayout>
            <CourseReviewDetails course={plainCourse} />
        </DashboardLayout>
    );
}