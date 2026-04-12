import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CourseLearningPage from '@/components/courses/CourseLearningPage';

interface Props {
    params: {
        courseId: string;
    };
}

function serializeCourse(course: any) {
    return {
        ...course,
        price: course.price?.toString?.() ?? course.price,
        discountPrice: course.discountPrice?.toString?.() ?? course.discountPrice,
        averageRating: course.averageRating?.toString?.() ?? course.averageRating,
        publishedAt: course.publishedAt ? course.publishedAt.toISOString() : null,
        createdAt: course.createdAt ? course.createdAt.toISOString() : null,
        updatedAt: course.updatedAt ? course.updatedAt.toISOString() : null,
        modules: (course.modules || []).map((module: any) => ({
            ...module,
            createdAt: module.createdAt ? module.createdAt.toISOString() : null,
            updatedAt: module.updatedAt ? module.updatedAt.toISOString() : null,
            lessons: (module.lessons || []).map((lesson: any) => ({
                ...lesson,
                createdAt: lesson.createdAt ? lesson.createdAt.toISOString() : null,
                updatedAt: lesson.updatedAt ? lesson.updatedAt.toISOString() : null,
            })),
        })),
    };
}

export default async function MyCourseLearningPage({ params }: Props) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!dbUser) {
        redirect('/my-courses');
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: dbUser.id,
                courseId: params.courseId,
            },
        },
        include: {
            course: {
                include: {
                    instructor: {
                        select: {
                            firstName: true,
                            lastName: true,
                            imageUrl: true,
                            bio: true,
                        },
                    },
                    category: true,
                    modules: {
                        include: {
                            lessons: {
                                orderBy: { sortOrder: 'asc' },
                            },
                        },
                        orderBy: { sortOrder: 'asc' },
                    },
                    _count: {
                        select: {
                            enrollments: true,
                            reviews: true,
                        },
                    },
                },
            },
            lessonProgress: true,
        },
    });

    if (!enrollment) {
        notFound();
    }

    return (
        <div className="w-full min-h-[calc(100vh-4rem)]">
            <CourseLearningPage
                course={serializeCourse(enrollment.course)}
                enrollment={{
                    id: enrollment.id,
                    progress: enrollment.progress,
                    status: enrollment.status,
                    currentLesson: enrollment.currentLesson,
                }}
                lessonProgress={enrollment.lessonProgress.map((item) => ({
                    lessonId: item.lessonId,
                    isCompleted: item.isCompleted,
                    watchTime: item.watchTime,
                }))}
            />
        </div>
    );
}