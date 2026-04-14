import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CourseLearningPage from '@/components/courses/CourseLearningPage';

type PageProps = {
    params: { id: string };
};

export default async function CoursePage({ params }: PageProps) {
    const { userId } = await auth();
    const { id: courseId } = params;

    if (!courseId) {
        redirect('/courses');
    }

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            category: true,
            instructor: {
                select: {
                    firstName: true,
                    lastName: true,
                    imageUrl: true,
                    bio: true,
                },
            },
            modules: {
                orderBy: {
                    sortOrder: 'asc',
                },
                include: {
                    lessons: {
                        orderBy: {
                            sortOrder: 'asc',
                        },
                    },
                },
            },
            _count: {
                select: {
                    enrollments: true,
                    reviews: true,
                },
            },
        },
    });

    if (!course) {
        redirect('/courses');
    }

    if (!userId) {
        redirect('/sign-in');
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: {
            id: true,
            isPremium: true,
            premiumExpiresAt: true,
            premiumPlan: true,
        },
    });

    if (!dbUser) {
        redirect('/sign-in');
    }

    const isPremiumActive =
        dbUser.isPremium &&
        (dbUser.premiumPlan === 'LIFETIME' ||
            !dbUser.premiumExpiresAt ||
            dbUser.premiumExpiresAt > new Date());

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: dbUser.id,
                courseId,
            },
        },
    });

    const lessonProgress = enrollment
        ? await prisma.lessonProgress.findMany({
              where: {
                  enrollmentId: enrollment.id,
              },
          })
        : [];

    const isFreeCourse = Number(course.price) === 0;
    const hasAccess = isFreeCourse || isPremiumActive || Boolean(enrollment);

    if (!hasAccess) {
        redirect(`/payment?courseId=${courseId}`);
    }

    const safeCourse = {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        thumbnail: course.thumbnail,
        price: course.price,
        currency: course.currency,
        level: course.level,
        duration: course.duration,
        averageRating: course.averageRating,
        enrollmentCount: course.enrollmentCount,
        category: course.category
            ? {
                  name: course.category.name,
                  slug: course.category.slug,
              }
            : null,
        instructor: course.instructor,
        modules: course.modules.map((mod) => ({
            id: mod.id,
            title: mod.title,
            description: mod.description,
            sortOrder: mod.sortOrder,
            lessons: mod.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                videoUrl: lesson.videoUrl,
                type: lesson.type,
                sortOrder: lesson.sortOrder,
                isPublished: lesson.isPublished,
                isFree: lesson.isFree,
            })),
        })),
        _count: course._count,
    };

    return (
        <CourseLearningPage
            course={safeCourse as any}
            enrollment={
                enrollment
                    ? {
                          id: enrollment.id,
                          progress: enrollment.progress,
                          status: enrollment.status,
                          currentLesson: enrollment.currentLesson,
                      }
                    : {
                          id: '',
                          progress: 0,
                          status: 'ACTIVE',
                          currentLesson: null,
                      }
            }
            lessonProgress={lessonProgress.map((item) => ({
                lessonId: item.lessonId,
                isCompleted: item.isCompleted,
                watchTime: item.watchTime,
            }))}
        />
    );
}