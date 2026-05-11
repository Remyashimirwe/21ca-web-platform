// app/api/calendar/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, role: true }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const events: any[] = [];

        if (dbUser.role === 'INSTRUCTOR') {
            // Get courses taught by this instructor
            const courses = await prisma.course.findMany({
                where: { instructorId: dbUser.id },
                include: {
                    assignments: true,
                    modules: {
                        include: {
                            lessons: {
                                where: { type: 'LIVE_SESSION' },
                                include: { liveSession: true }
                            }
                        }
                    }
                }
            });

            courses.forEach((course: any) => {
                // Add Assignments
                course.assignments.forEach((assignment: any) => {
                    if (assignment.dueDate) {
                        events.push({
                            id: assignment.id,
                            title: `[Assignment] ${assignment.title}`,
                            description: assignment.description,
                            startTime: assignment.dueDate,
                            endTime: assignment.dueDate,
                            type: 'assignment',
                            courseId: course.id,
                            courseName: course.title
                        });
                    }
                });

                // Add Live Sessions
                course.modules.forEach((module: any) => {
                    module.lessons.forEach((lesson: any) => {
                        if (lesson.liveSession) {
                            const startTime = new Date(lesson.liveSession.date);
                            // Assuming 'time' is stored as "HH:mm"
                            if (lesson.liveSession.time) {
                                const [hours, minutes] = lesson.liveSession.time.split(':').map(Number);
                                startTime.setHours(hours, minutes);
                            }
                            const endTime = new Date(startTime.getTime() + (lesson.liveSession.duration || 60) * 60 * 1000);
                            
                            events.push({
                                id: lesson.liveSession.id,
                                title: `[Live] ${lesson.liveSession.title}`,
                                description: lesson.liveSession.description || lesson.title,
                                startTime,
                                endTime,
                                type: 'live_session',
                                courseId: course.id,
                                courseName: course.title,
                                meetingLink: lesson.liveSession.meetingLink
                            });
                        }
                    });
                });
            });
        } else if (dbUser.role === 'USER') {
            // Get enrolled courses
            const enrollments = await prisma.enrollment.findMany({
                where: { userId: dbUser.id },
                include: {
                    course: {
                        include: {
                            assignments: true,
                            modules: {
                                include: {
                                    lessons: {
                                        where: { type: 'LIVE_SESSION' },
                                        include: { liveSession: true }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            enrollments.forEach((enrollment: any) => {
                const course = enrollment.course;
                // Add Assignments
                course.assignments.forEach((assignment: any) => {
                    if (assignment.dueDate) {
                        events.push({
                            id: assignment.id,
                            title: `[Due] ${assignment.title}`,
                            description: assignment.description,
                            startTime: assignment.dueDate,
                            endTime: assignment.dueDate,
                            type: 'deadline',
                            courseId: course.id,
                            courseName: course.title
                        });
                    }
                });

                // Add Live Sessions
                course.modules.forEach((module: any) => {
                    module.lessons.forEach((lesson: any) => {
                        if (lesson.liveSession) {
                            const startTime = new Date(lesson.liveSession.date);
                            if (lesson.liveSession.time) {
                                const [hours, minutes] = lesson.liveSession.time.split(':').map(Number);
                                startTime.setHours(hours, minutes);
                            }
                            const endTime = new Date(startTime.getTime() + (lesson.liveSession.duration || 60) * 60 * 1000);

                            events.push({
                                id: lesson.liveSession.id,
                                title: `[Live] ${lesson.liveSession.title}`,
                                description: lesson.liveSession.description || lesson.title,
                                startTime,
                                endTime,
                                type: 'live_session',
                                courseId: course.id,
                                courseName: course.title,
                                meetingLink: lesson.liveSession.meetingLink
                            });
                        }
                    });
                });
            });
        } else if (dbUser.role === 'ADMIN') {
            // Admin sees everything? Or just high-level?
            // Let's show all live sessions and major assignments for now
            const liveSessions = await prisma.liveSession.findMany({
                include: {
                    lesson: {
                        include: {
                            module: {
                                include: {
                                    course: true
                                }
                            }
                        }
                    }
                }
            });

            liveSessions.forEach((session: any) => {
                const startTime = new Date(session.date);
                if (session.time) {
                    const [hours, minutes] = session.time.split(':').map(Number);
                    startTime.setHours(hours, minutes);
                }
                const endTime = new Date(startTime.getTime() + (session.duration || 60) * 60 * 1000);
                const course = session.lesson.module.course;

                events.push({
                    id: session.id,
                    title: `[Live] ${session.title} (${course.title})`,
                    description: session.description,
                    startTime,
                    endTime,
                    type: 'live_session',
                    courseId: course.id,
                    courseName: course.title
                });
            });
        }

        // Add user-specific calendar events
        const userEvents = await prisma.calendarEvent.findMany({
            where: { userId: dbUser.id }
        });

        userEvents.forEach((e: any) => {
            events.push({
                id: e.id,
                title: e.title,
                description: e.description,
                startTime: e.startTime,
                endTime: e.endTime,
                type: e.type,
                location: e.location,
                courseId: e.courseId
            });
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
            select: { id: true }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const { title, description, startTime, endTime, type, location, courseId } = body;

        if (!title || !startTime || !endTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newEvent = await prisma.calendarEvent.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                type: type || 'other',
                location,
                courseId,
                userId: dbUser.id
            }
        });

        // 🔔 Notify the user about the new event they created
        await createNotification({
            userId: dbUser.id,
            title: '📅 Event Created',
            message: `New event "${title}" added to your calendar.`,
            type: 'INFO',
            actionUrl: `/calendar`
        });

        return NextResponse.json(newEvent);
    } catch (error) {
        console.error('Error creating calendar event:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
