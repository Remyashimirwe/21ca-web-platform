// app/api/admin/top-courses/route.ts

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

        const topCourses = await prisma.course.findMany({
            where: { isPublished: true },
            select: {
                id: true,
                title: true,
                enrollmentCount: true,
                averageRating: true,
            },
            orderBy: [
                { enrollmentCount: 'desc' },
                { averageRating: 'desc' }
            ],
            take: 5
        });

        // Add dummy completion percentage and trend for UI
        const formattedCourses = topCourses.map(course => {
            // Calculate a completion rate - in a real app this would be more complex
            // For now let's use a random but stable number based on ID
            const completion = Math.floor(30 + (course.id.length % 60));
            const trend = (course.id.length % 2 === 0) ? 'up' : 'down';
            
            return {
                ...course,
                enrollments: course.enrollmentCount,
                completion,
                rating: Number(course.averageRating || 0).toFixed(1),
                trend
            };
        });

        return NextResponse.json(formattedCourses);
    } catch (error) {
        console.error('Error fetching top courses:', error);
        return NextResponse.json([], { status: 200 });
    }
}
