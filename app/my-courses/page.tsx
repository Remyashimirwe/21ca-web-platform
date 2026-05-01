import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import UserMyCourses from '@/components/courses/UserMyCourses';

export default async function MyCoursesPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true },
    });

    if (!dbUser) {
        redirect('/sign-in');
    }

    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId: dbUser.id,
        },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    shortDescription: true,
                    description: true,
                    thumbnail: true,
                    level: true,
                    duration: true,
                    averageRating: true,
                    currency: true,
                    price: true,
                    category: {
                        select: {
                            name: true,
                            slug: true,
                        },
                    },
                    instructor: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    _count: {
                        select: {
                            enrollments: true,
                            reviews: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            enrolledAt: 'desc',
        },
    });

    const courses = enrollments.map((enrollment) => ({
        id: enrollment.course.id,
        title: enrollment.course.title,
        slug: enrollment.course.slug,
        shortDescription: enrollment.course.shortDescription,
        description: enrollment.course.description,
        thumbnail: enrollment.course.thumbnail,
        level: enrollment.course.level,
        duration: enrollment.course.duration,
        averageRating: enrollment.course.averageRating
            ? Number(enrollment.course.averageRating)
            : null,
        category: enrollment.course.category,
        instructor: enrollment.course.instructor,
        isPremium: Number(enrollment.course.price) > 0,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt,
    }));

    return <UserMyCourses courses={courses} />;
}