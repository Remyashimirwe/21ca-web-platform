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

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

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
            default:
                startDate.setDate(now.getDate() - 30);
        }

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
                    },
                    include: {
                        lessonProgress: {
                            include: {
                                lesson: {
                                    select: {
                                        id: true,
                                        isPublished: true
                                    }
                                }
                            }
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
                reviews: {
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    }
                }
            }
        });

        const totalRevenue = courses.reduce((sum, course) => {
            return sum + course.payments.reduce((paymentSum, payment) => {
                return paymentSum + Number(payment.amount);
            }, 0);
        }, 0);

        const totalStudents = courses.reduce((sum, course) => sum + course.enrollmentCount, 0);

        const averageRating =
            courses.length > 0
                ? courses.reduce((sum, course) => sum + (Number(course.averageRating) || 0), 0) / courses.length
                : 0;

        const completionRate =
            courses.length > 0
                ? Math.round(
                      courses.reduce((sum, course) => {
                          const completedCount = course.enrollments.filter(e => e.status === 'COMPLETED').length;
                          return sum + (completedCount / (course.enrollments.length || 1)) * 100;
                      }, 0) / courses.length
                  )
                : 0;

        const coursesPerformance = courses
            .map(course => {
                const completedCount = course.enrollments.filter(e => e.status === 'COMPLETED').length;
                const totalLessonCompletions = course.enrollments.reduce((count, enrollment) => {
                    return count + enrollment.lessonProgress.filter(p => p.isCompleted).length;
                }, 0);

                const totalWatchTime = course.enrollments.reduce((count, enrollment) => {
                    return count + enrollment.lessonProgress.reduce((sum, p) => sum + p.watchTime, 0);
                }, 0);

                return {
                    courseId: course.id,
                    title: course.title,
                    enrollments: course.enrollmentCount,
                    revenue: course.payments.reduce((sum, p) => sum + Number(p.amount), 0),
                    averageProgress: Math.round(
                        course.enrollments.reduce((sum, e) => sum + e.progress, 0) / (course.enrollments.length || 1)
                    ),
                    completionRate: Math.round(
                        (completedCount / (course.enrollments.length || 1)) * 100
                    ),
                    rating: Number(course.averageRating) || 0,
                    lessonCompletions: totalLessonCompletions,
                    watchTimeHours: Math.round(totalWatchTime / 3600)
                };
            })
            .sort((a, b) => b.revenue - a.revenue);

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

        const studentEngagement: {
            date: string;
            activeStudents: number;
            lessonCompletions: number;
            quizAttempts: number;
        }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);

            const dayEnrollments = courses.flatMap(course => course.enrollments).filter(enrollment => {
                const enrolled = new Date(enrollment.enrolledAt);
                return enrolled >= dayStart && enrolled <= dayEnd;
            });

            const activeStudents = dayEnrollments.length;
            const lessonCompletions = dayEnrollments.reduce((sum, enrollment) => {
                return sum + enrollment.lessonProgress.filter(p => p.isCompleted).length;
            }, 0);

            const quizAttempts = dayEnrollments.reduce((sum, enrollment) => {
                return sum + enrollment.lessonProgress.filter(p => p.lesson?.isPublished).length;
            }, 0);

            studentEngagement.push({
                date: date.toISOString(),
                activeStudents,
                lessonCompletions,
                quizAttempts
            });
        }

        const statusBreakdown = {
            DRAFT: courses.filter(c => c.status === 'DRAFT').length,
            UNDER_REVIEW: courses.filter(c => c.status === 'UNDER_REVIEW').length,
            PUBLISHED: courses.filter(c => c.status === 'PUBLISHED' || c.isPublished).length,
            ARCHIVED: courses.filter(c => c.status === 'ARCHIVED').length
        };

        return NextResponse.json({
            overview: {
                totalRevenue,
                revenueChange: 0,
                totalStudents,
                studentsChange: 0,
                averageRating,
                ratingChange: 0,
                completionRate,
                completionChange: 0
            },
            coursesPerformance,
            monthlyData,
            studentEngagement,
            statusBreakdown
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}