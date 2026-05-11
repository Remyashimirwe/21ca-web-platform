import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
    const { userId } = await auth();

    if (!userId) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!dbUser) {
        return { error: NextResponse.json({ error: 'User not found' }, { status: 404 }) };
    }

    if (dbUser.role !== 'ADMIN') {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { dbUser };
}

export async function GET(req: NextRequest): Promise<Response> {
    try {
        const adminCheck = await requireAdmin();
        if ('error' in adminCheck) return adminCheck.error as Response;

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const query = searchParams.get('q');

        const courses = await prisma.course.findMany({
            where: {
                ...(status ? { status: status as any } : {}),
                ...(query
                    ? {
                          OR: [
                              { title: { contains: query, mode: 'insensitive' } },
                              { description: { contains: query, mode: 'insensitive' } },
                              { shortDescription: { contains: query, mode: 'insensitive' } },
                              {
                                  instructor: {
                                      OR: [
                                          { firstName: { contains: query, mode: 'insensitive' } },
                                          { lastName: { contains: query, mode: 'insensitive' } },
                                          { email: { contains: query, mode: 'insensitive' } },
                                      ],
                                  },
                              },
                          ],
                      }
                    : {}),
            },
            orderBy: { createdAt: 'desc' },
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
                        lessons: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const payload = courses.map((course: typeof courses[number]) => ({
            ...course,
            modulesCount: course.modules.length,
            lessonsCount: course.modules.reduce((total, module) => total + module.lessons.length, 0),
            tags: course.tags.map((t) => t.tag),
        }));

        return NextResponse.json(payload);
    } catch (error) {
        console.error('Error fetching admin courses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch courses' },
            { status: 500 }
        );
    }
}