import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CourseDetailPage from '@/components/courses/CourseDetailPage';

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

type CourseDetailData = {
    id: string;
    title: string;
    slug: string;
    price: number | string | null;
    currency?: string | null;
    shortDescription: string | null;
    description: string | null;
    thumbnail: string | null;
    level: string | null;
    duration: number | null;
    enrollmentCount: number;
    averageRating: number | null;
    category: {
        name: string;
        slug: string;
    } | null;
    instructor: {
        firstName: string | null;
        lastName: string | null;
        imageUrl: string | null;
        bio: string | null;
    } | null;
    modules: Array<{
        id: string;
        title: string;
        description: string | null;
        sortOrder: number | null;
        lessons: Array<{
            id: string;
            title: string;
            description: string | null;
            content: string | null;
            videoUrl: string | null;
            type: string;
            sortOrder: number | null;
        }>;
    }>;
    counts: {
        enrollments: number;
        reviews: number;
    };
};

type CourseQueryResult = {
    id: string;
    title: string;
    slug: string;
    price: unknown;
    discountPrice: unknown;
    averageRating: unknown;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    shortDescription: string | null;
    description: string | null;
    thumbnail: string | null;
    currency: string | null;
    level: string | null;
    duration: number | null;
    enrollmentCount: number;
    category: {
        name: string;
        slug: string;
    } | null;
    instructor: {
        firstName: string | null;
        lastName: string | null;
        imageUrl: string | null;
        bio: string | null;
    } | null;
    modules: Array<{
        id: string;
        title: string;
        description: string | null;
        sortOrder: number | null;
        lessons: Array<{
            id: string;
            title: string;
            description: string | null;
            content: string | null;
            videoUrl: string | null;
            type: string;
            sortOrder: number | null;
        }>;
    }>;
    _count: {
        enrollments: number;
        reviews: number;
    };
};

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const course = await prisma.course.findUnique({
        where: { slug: slug },
        select: {
            title: true,
            shortDescription: true,
        },
    });

    if (!course) {
        return {
            title: 'Course Not Found',
        };
    }

    return {
        title: course.title,
        description: course.shortDescription,
    };
}

function toPrice(value: unknown): number | string | null {
    if (value == null) return null;
    if (typeof value === 'number' || typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null && 'toString' in value) {
        return String(value);
    }
    return null;
}

function toNumber(value: unknown): number | null {
    if (value == null) return null;
    if (typeof value === 'number') return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function serializeCourse(course: CourseQueryResult): CourseDetailData {
    return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        price: toPrice(course.price),
        currency: course.currency,
        shortDescription: course.shortDescription,
        description: course.description,
        thumbnail: course.thumbnail,
        level: course.level,
        duration: course.duration,
        enrollmentCount: course.enrollmentCount,
        averageRating: toNumber(course.averageRating),
        category: course.category,
        instructor: course.instructor,
        modules: course.modules,
        counts: {
            enrollments: course._count.enrollments,
            reviews: course._count.reviews,
        },
    };
}

export default async function CoursePage({ params }: PageProps) {
    const { slug } = await params;
    const course = await prisma.course.findUnique({
        where: { slug: slug },
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

    return <CourseDetailPage course={serializeCourse(course as CourseQueryResult)} />;
}