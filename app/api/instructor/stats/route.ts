// app/api/instructor/stats/route.ts

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

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const courses = await prisma.course.findMany({
            where: {
                instructorId: dbUser.id
            },
            include: {
                enrollments: true,
                payments: {
                    where: {
                        status: 'COMPLETED'
                    }
                }
            }
        });

        const totalRevenue = courses.reduce((sum, course) => {
            return sum + course.payments.reduce((paymentSum, payment) => {
                return paymentSum + Number(payment.amount);
            }, 0);
        }, 0);

        const totalStudents = courses.reduce((sum, course) => {
            return sum + course.enrollmentCount;
        }, 0);

        const averageRating = courses.reduce((sum, course) => {
            return sum + (Number(course.averageRating) || 0);
        }, 0) / (courses.length || 1);

        const totalCourses = courses.length;
        const publishedCourses = courses.filter(c => c.isPublished).length;
        const draftCourses = courses.filter(c => c.status === 'DRAFT').length;
        const underReviewCourses = courses.filter(c => c.status === 'UNDER_REVIEW').length;

        return NextResponse.json({
            totalRevenue,
            totalStudents,
            averageRating,
            totalCourses,
            publishedCourses,
            draftCourses,
            underReviewCourses
        });
    } catch (error) {
        console.error('Error fetching instructor stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
