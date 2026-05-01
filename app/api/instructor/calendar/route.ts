// app/api/instructor/calendar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const dateParam = searchParams.get('date');
        const view = searchParams.get('view') || 'month';

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get instructor's courses with assignment deadlines
        const courses = await prisma.course.findMany({
            where: {
                instructorId: dbUser.id
            },
            include: {
                assignments: {
                    where: {
                        dueDate: {
                            not: null
                        }
                    }
                }
            }
        });

        // Create calendar events from assignments
        const events: any[] = [];

        courses.forEach(course => {
            course.assignments.forEach(assignment => {
                if (assignment.dueDate) {
                    events.push({
                        id: assignment.id,
                        title: `${assignment.title} - Due`,
                        description: assignment.description,
                        type: 'assignment_due',
                        startTime: assignment.dueDate,
                        endTime: assignment.dueDate,
                        course: {
                            id: course.id,
                            title: course.title
                        },
                        isCompleted: false
                    });
                }
            });
        });

        // Add some mock live sessions (you can enhance this)
        const today = new Date();
        for (let i = 0; i < 5; i++) {
            const eventDate = new Date(today);
            eventDate.setDate(today.getDate() + i * 3);
            eventDate.setHours(14, 0, 0, 0);

            events.push({
                id: `live-session-${i}`,
                title: 'Q&A Live Session',
                description: 'Weekly Q&A session with students',
                type: 'live_session',
                startTime: eventDate,
                endTime: new Date(eventDate.getTime() + 60 * 60 * 1000),
                attendees: Math.floor(Math.random() * 50) + 10,
                isCompleted: eventDate < today
            });
        }

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return NextResponse.json(
            { error: 'Failed to fetch calendar events' },
            { status: 500 }
        );
    }
}