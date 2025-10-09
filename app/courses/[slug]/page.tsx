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

export default async function CoursePage({ params }: CoursePageProps) {
    const course = await prisma.course.findUnique({
        where: { slug: params.slug },
        include: {
            instructor: {
                select: {
                    firstName: true,
                    lastName: true,
                    imageUrl: true,
                    bio: true
                }
            },
            category: true,
            modules: {
                include: {
                    lessons: {
                        orderBy: {
                            sortOrder: 'asc'
                        }
                    }
                },
                orderBy: {
                    sortOrder: 'asc'
                }
            },
            _count: {
                select: {
                    enrollments: true,
                    reviews: true
                }
            }
        }
    });

    if (!course) {
        notFound();
    }

    return <CourseDetailPage course={course} />;
}