// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CourseDetailPage from '@/components/courses/CourseDetailPage';

interface CoursePageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: CoursePageProps) {
    const course = await prisma.course.findUnique({
        where: { slug: params.slug },
        select: { title: true, shortDescription: true }
    });

    if (!course) {
        return {
            title: 'Course Not Found'
        };
    }

    return {
        title: course.title,
        description: course.shortDescription
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

export default async function CoursePage({ params }: CoursePageProps) {
    const course = await prisma.course.findUnique({
        where: { slug: params.slug },
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
                        orderBy: {
                            sortOrder: 'asc',
                        },
                    },
                },
                orderBy: {
                    sortOrder: 'asc',
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
        notFound();
    }

    return <CourseDetailPage course={serializeCourse(course)} />;
}