import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userRole = user.publicMetadata?.role as string;
        if (userRole !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get('status') || 'UNDER_REVIEW';

        const courses = await prisma.course.findMany({
            where: {
                status: status as any
            },
            include: {
                instructor: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        imageUrl: true
                    }
                },
                category: {
                    select: {
                        name: true,
                        color: true
                    }
                },
                modules: {
                    include: {
                        lessons: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Error fetching pending courses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch courses' },
            { status: 500 }
        );
    }
}