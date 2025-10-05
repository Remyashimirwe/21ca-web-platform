import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const enrollments = await prisma.enrollment.findMany({
            where: {
                course: {
                    instructorId: userId
                }
            },
            include: {
                user: true
            }
        });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const uniqueStudents = new Set(enrollments.map(e => e.userId));
        const totalStudents = uniqueStudents.size;
        
        const activeStudents = enrollments.filter(e => e.status === 'ACTIVE').length;
        const completedCourses = enrollments.filter(e => e.status === 'COMPLETED').length;
        
        const averageProgress = enrollments.reduce((sum, e) => sum + e.progress, 0) / (enrollments.length || 1);
        
        const newThisWeek = enrollments.filter(e => new Date(e.enrolledAt) > oneWeekAgo).length;
        const newThisMonth = enrollments.filter(e => new Date(e.enrolledAt) > oneMonthAgo).length;

        return NextResponse.json({
            totalStudents,
            activeStudents,
            completedCourses,
            averageProgress: Math.round(averageProgress),
            newThisWeek,
            newThisMonth
        });
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}