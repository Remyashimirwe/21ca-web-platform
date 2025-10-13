// app/api/instructor/analytics/route.ts
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
        const timeframe = searchParams.get('timeframe') || '30d';

        // Get instructor from database
        let dbUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate date range
        const now = new Date();
        let startDate = new Date();
        switch (timeframe) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        // Get instructor's courses with enrollments and payments
        const courses = await prisma.course.findMany({
            where: {
                instructorId: dbUser.id
            },
            include: {
                enrollments: {
                    where: {
                        enrolledAt: {
                            gte: startDate
                        }
                    }
                },
                payments: {
                    where: {
                        status: 'COMPLETED',
                        paidAt: {
                            gte: startDate
                        }
                    }
                },
                reviews: true
            }
        });

        // Calculate overview stats
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

        const completionRate = Math.round(
            courses.reduce((sum, course) => {
                const completedCount = course.enrollments.filter(e => e.status === 'COMPLETED').length;
                return sum + (completedCount / (course.enrollments.length || 1)) * 100;
            }, 0) / (courses.length || 1)
        );

        // Calculate courses performance
        const coursesPerformance = courses.map(course => ({
            courseId: course.id,
            title: course.title,
            enrollments: course.enrollmentCount,
            revenue: course.payments.reduce((sum, p) => sum + Number(p.amount), 0),
            averageProgress: Math.round(
                course.enrollments.reduce((sum, e) => sum + e.progress, 0) / 
                (course.enrollments.length || 1)
            ),
            completionRate: Math.round(
                (course.enrollments.filter(e => e.status === 'COMPLETED').length / 
                (course.enrollments.length || 1)) * 100
            ),
            rating: Number(course.averageRating) || 0
        })).sort((a, b) => b.revenue - a.revenue);

        // Generate monthly data
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

            const monthEnrollments = courses.reduce((sum, course) => {
                return sum + course.enrollments.filter(e => {
                    const enrollDate = new Date(e.enrolledAt);
                    return enrollDate >= monthStart && enrollDate <= monthEnd;
                }).length;
            }, 0);

            const monthRevenue = courses.reduce((sum, course) => {
                return sum + course.payments.filter(p => {
                    const paidDate = p.paidAt ? new Date(p.paidAt) : null;
                    return paidDate && paidDate >= monthStart && paidDate <= monthEnd;
                }).reduce((pSum, p) => pSum + Number(p.amount), 0);
            }, 0);

            const monthCompletions = courses.reduce((sum, course) => {
                return sum + course.enrollments.filter(e => {
                    const completedDate = e.completedAt ? new Date(e.completedAt) : null;
                    return completedDate && completedDate >= monthStart && completedDate <= monthEnd;
                }).length;
            }, 0);

            monthlyData.push({
                month: monthStart.toLocaleString('default', { month: 'short' }),
                revenue: monthRevenue,
                enrollments: monthEnrollments,
                completions: monthCompletions
            });
        }

        // Generate engagement data (mock for now - you can enhance this)
        const studentEngagement = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            studentEngagement.push({
                date: date.toISOString(),
                activeStudents: Math.floor(Math.random() * 50) + 20,
                lessonCompletions: Math.floor(Math.random() * 30) + 10,
                quizAttempts: Math.floor(Math.random() * 20) + 5
            });
        }

        return NextResponse.json({
            overview: {
                totalRevenue,
                revenueChange: 12.5, // Mock - calculate actual change
                totalStudents,
                studentsChange: 8.3, // Mock
                averageRating,
                ratingChange: 0.5, // Mock
                completionRate,
                completionChange: 3.2 // Mock
            },
            coursesPerformance,
            monthlyData,
            studentEngagement
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}