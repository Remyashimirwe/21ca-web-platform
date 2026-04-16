import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                instructor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        imageUrl: true,
                        bio: true,
                    },
                },
                category: true,
                modules: {
                    orderBy: {
                        sortOrder: 'asc',
                    },
                    include: {
                        lessons: {
                            orderBy: {
                                sortOrder: 'asc',
                            },
                            include: {
                                quizQuestions: {
                                    orderBy: {
                                        sortOrder: 'asc',
                                    },
                                    include: {
                                        options: {
                                            orderBy: {
                                                sortOrder: 'asc',
                                            },
                                        },
                                    },
                                },
                                assignmentQuestions: {
                                    orderBy: {
                                        sortOrder: 'asc',
                                    },
                                    include: {
                                        options: {
                                            orderBy: {
                                                sortOrder: 'asc',
                                            },
                                        },
                                    },
                                },
                                liveSession: true,
                            },
                        },
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
                enrollments: {
                    select: {
                        id: true,
                    },
                },
                reviews: {
                    select: {
                        id: true,
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
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error('Error fetching course by id:', error);
        return NextResponse.json(
            { error: 'Failed to fetch course' },
            { status: 500 }
        );
    }
}