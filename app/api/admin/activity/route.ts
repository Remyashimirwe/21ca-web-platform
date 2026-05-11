// app/api/admin/activity/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!dbUser || dbUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get recent user registrations
        const recentUsers = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // Get recent enrollments
        const recentEnrollments = await prisma.enrollment.findMany({
            include: {
                user: { select: { firstName: true, lastName: true } },
                course: { select: { title: true } }
            },
            orderBy: { enrolledAt: 'desc' },
            take: 5
        });

        // Get recent completions
        const recentCompletions = await prisma.enrollment.findMany({
            where: { status: 'COMPLETED' },
            include: {
                user: { select: { firstName: true, lastName: true } },
                course: { select: { title: true } }
            },
            orderBy: { completedAt: 'desc' },
            take: 5
        });

        // Format activity feed
        type Activity = {
            type: string;
            message: string;
            time: string;
            timestamp: Date;
        };
        const activities: Activity[] = [];

        for (const user of recentUsers) {
            activities.push({
                type: 'user_registration',
                message: `New user: ${user.firstName} ${user.lastName} registered`,
                time: formatTimeAgo(user.createdAt),
                timestamp: user.createdAt
            });
        }

        for (const enrollment of recentEnrollments) {
            activities.push({
                type: 'course_enrollment',
                message: `${enrollment.user.firstName} enrolled in "${enrollment.course.title}"`,
                time: formatTimeAgo(enrollment.enrolledAt),
                timestamp: enrollment.enrolledAt
            });
        }

        for (const completion of recentCompletions) {
            if (completion.completedAt) {
                activities.push({
                    type: 'course_completion',
                    message: `${completion.user.firstName} completed "${completion.course.title}"`,
                    time: formatTimeAgo(completion.completedAt),
                    timestamp: completion.completedAt
                });
            }
        }

        // Sort by timestamp and take top 10
        activities.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return NextResponse.json(activities.slice(0, 10));
    } catch (error) {
        console.error('Error fetching admin activity:', error);
        return NextResponse.json([], { status: 200 });
    }
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
}
