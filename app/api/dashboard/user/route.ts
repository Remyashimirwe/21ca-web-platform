import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: {
                enrollments: {
                    include: {
                        course: true,
                        lessonProgress: true,
                    },
                    orderBy: {
                        enrolledAt: 'desc',
                    },
                },
                certificates: true,
            },
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Calculate stats
        const coursesEnrolled = user.enrollments.length;
        const coursesCompleted = user.enrollments.filter(e => e.progress === 100).length;
        
        // Sum up watch time or use a constant per lesson for hours
        const totalMinutes = user.enrollments.reduce((acc, e) => {
            return acc + e.lessonProgress.reduce((lAcc, lp) => lAcc + lp.watchTime, 0);
        }, 0);
        const totalHours = Math.round(totalMinutes / 60);

        // Fetch recent courses (limit to 3)
        const recentCourses = user.enrollments.slice(0, 3).map(e => ({
            id: e.courseId,
            title: e.course.title,
            progress: e.progress,
            image: e.course.thumbnail || 'https://images.unsplash.com/photo-1634951401794-6c84f593db82?w=300&h=200&fit=crop',
            instructor: 'Instructor', // Could fetch name if needed
            nextLesson: e.currentLesson || 'Next lesson',
        }));

        // Fetch upcoming live sessions from enrolled courses
        const courseIds = user.enrollments.map(e => e.courseId);
        const upcomingEvents = await prisma.liveSession.findMany({
            where: {
                lesson: {
                    module: {
                        courseId: {
                            in: courseIds,
                        },
                    },
                },
                date: {
                    gte: new Date(),
                },
            },
            take: 5,
            orderBy: {
                date: 'asc',
            },
        });

        // Fetch upcoming assignments
        const upcomingAssignments = await prisma.assignment.findMany({
            where: {
                courseId: {
                    in: courseIds,
                },
                dueDate: {
                    gte: new Date(),
                },
            },
            take: 5,
            orderBy: {
                dueDate: 'asc',
            },
        });

        // Combine events
        const formattedEvents = [
            ...upcomingEvents.map(event => ({
                id: event.id,
                title: event.title,
                date: event.date,
                type: 'Live Session',
            })),
            ...upcomingAssignments.map(asg => ({
                id: asg.id,
                title: asg.title,
                date: asg.dueDate,
                type: 'Deadline',
            })),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

        return NextResponse.json({
            userStats: {
                coursesEnrolled,
                coursesCompleted,
                totalHours,
                currentStreak: 0, // Need logic for streak if desired
                certificates: user.certificates.length,
                progressRate: coursesEnrolled > 0 ? Math.round(user.enrollments.reduce((acc, e) => acc + e.progress, 0) / coursesEnrolled) : 0,
            },
            recentCourses,
            upcomingEvents: formattedEvents,
        });
    } catch (error) {
        console.error('[USER_DASHBOARD_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
