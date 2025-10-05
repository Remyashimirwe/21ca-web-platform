import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const period = searchParams.get('period') || 'all';
        const courseId = searchParams.get('course') || 'all';

        // Get date range based on period
        const now = new Date();
        let startDate = new Date(0); // Beginning of time
        
        switch (period) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
        }

        const whereClause: any = {
            course: {
                instructorId: userId
            },
            status: 'COMPLETED',
            createdAt: {
                gte: startDate
            }
        };

        if (courseId !== 'all') {
            whereClause.courseId = courseId;
        }

        const payments = await prisma.payment.findMany({
            where: whereClause,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true
                    }
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalEarnings = payments.reduce((sum, p) => sum + Number(p.amount), 0);

        // Calculate this month and last month earnings
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const thisMonth = payments
            .filter(p => new Date(p.createdAt) >= thisMonthStart)
            .reduce((sum, p) => sum + Number(p.amount), 0);

        const lastMonth = payments
            .filter(p => new Date(p.createdAt) >= lastMonthStart && new Date(p.createdAt) <= lastMonthEnd)
            .reduce((sum, p) => sum + Number(p.amount), 0);

        // Calculate pending and available
        const pending = payments
            .filter(p => p.status === 'PENDING')
            .reduce((sum, p) => sum + Number(p.amount), 0);

        const available = totalEarnings * 0.7; // 70% available after platform fees

        // Top earning courses
        const courseRevenue = payments.reduce((acc: any, payment) => {
            const courseId = payment.course.id;
            if (!acc[courseId]) {
                acc[courseId] = {
                    id: courseId,
                    title: payment.course.title,
                    thumbnail: payment.course.thumbnail,
                    revenue: 0,
                    sales: 0
                };
            }
            acc[courseId].revenue += Number(payment.amount);
            acc[courseId].sales += 1;
            return acc;
        }, {});

        const topCourses = Object.values(courseRevenue)
            .sort((a: any, b: any) => b.revenue - a.revenue)
            .slice(0, 5);

        // Recent transactions
        const recentTransactions = payments.slice(0, 10);

        // Monthly data for chart
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            
            const monthPayments = payments.filter(p => {
                const date = new Date(p.createdAt);
                return date >= monthStart && date <= monthEnd;
            });

            monthlyData.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
                earnings: monthPayments.reduce((sum, p) => sum + Number(p.amount), 0),
                sales: monthPayments.length
            });
        }

        return NextResponse.json({
            totalEarnings,
            thisMonth,
            lastMonth,
            pending,
            available,
            lifetimeEarnings: totalEarnings,
            averagePerCourse: topCourses.length > 0 
                ? totalEarnings / topCourses.length 
                : 0,
            topCourses,
            recentTransactions,
            monthlyData
        });
    } catch (error) {
        console.error('Error fetching earnings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch earnings' },
            { status: 500 }
        );
    }
}