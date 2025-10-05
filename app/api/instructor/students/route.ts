import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all students enrolled in instructor's courses
        const students = await prisma.user.findMany({
            where: {
                enrollments: {
                    some: {
                        course: {
                            instructorId: userId
                        }
                    }
                }
            },
            include: {
                enrollments: {
                    where: {
                        course: {
                            instructorId: userId
                        }
                    },
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                thumbnail: true
                            }
                        }
                    },
                    orderBy: {
                        enrolledAt: 'desc'
                    }
                }
            }
        });

        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { error: 'Failed to fetch students' },
            { status: 500 }
        );
    }
}
