import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

type LiveSessionCreateBody = {
    lessonId?: string;
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    duration?: number;
    meetingLink?: string;
    calendarProvider?: 'NONE' | 'GOOGLE' | 'MICROSOFT';
};

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');
        const lessonId = searchParams.get('lessonId');

        const liveSessions = await prisma.liveSession.findMany({
            where: {
                ...(lessonId ? { lessonId } : {}),
                ...(courseId
                    ? {
                          lesson: {
                              module: {
                                  courseId,
                              },
                          },
                      }
                    : {}),
            },
            include: {
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        module: {
                            select: {
                                id: true,
                                title: true,
                                courseId: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        return NextResponse.json({ liveSessions });
    } catch (error) {
        console.error('Failed to fetch live sessions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch live sessions' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: {
                id: true,
                role: true,
            },
        });

        if (!dbUser || (dbUser.role !== 'INSTRUCTOR' && dbUser.role !== 'ADMIN')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = (await req.json()) as LiveSessionCreateBody;
        const {
            lessonId,
            title,
            description,
            date,
            time,
            duration = 60,
            meetingLink,
            calendarProvider = 'NONE',
        } = body;

        if (!lessonId) {
            return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
        }

        if (!title?.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        if (!time?.trim()) {
            return NextResponse.json({ error: 'Time is required' }, { status: 400 });
        }

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                module: {
                    select: {
                        courseId: true,
                        course: {
                            select: {
                                instructorId: true,
                            },
                        },
                    },
                },
                liveSession: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!lesson) {
            return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
        }

        if (
            dbUser.role !== 'ADMIN' &&
            lesson.module.course.instructorId !== dbUser.id
        ) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (lesson.liveSession) {
            const updated = await prisma.liveSession.update({
                where: { lessonId },
                data: {
                    title: title.trim(),
                    description: description?.trim() || null,
                    date: new Date(date),
                    time: time.trim(),
                    duration,
                    meetingLink: meetingLink?.trim() || null,
                    calendarProvider,
                },
            });

            return NextResponse.json({ liveSession: updated });
        }

        const created = await prisma.liveSession.create({
            data: {
                lessonId,
                title: title.trim(),
                description: description?.trim() || null,
                date: new Date(date),
                time: time.trim(),
                duration,
                meetingLink: meetingLink?.trim() || null,
                calendarProvider,
            },
        });

        return NextResponse.json({ liveSession: created }, { status: 201 });
    } catch (error) {
        console.error('Failed to create live session:', error);
        return NextResponse.json(
            { error: 'Failed to create live session' },
            { status: 500 }
        );
    }
}