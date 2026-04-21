// app/api/admin/stats/route.ts

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

        const totalUsers = await prisma.user.count();
        
        // Active users (e.g. users with at least one enrollment or who joined in last 30 days)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        const activeUsers = await prisma.user.count({
            where: {
                OR: [
                    { enrollments: { some: {} } },
                    { createdAt: { gte: lastMonth } }
                ]
            }
        });

        const totalCourses = await prisma.course.count();
        
        const totalRevenueResult = await prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true }
        });
        const totalRevenue = Number(totalRevenueResult._sum.amount || 0);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const newUsersToday = await prisma.user.count({
            where: { createdAt: { gte: startOfToday } }
        });

        const courseCompletions = await prisma.enrollment.count({
            where: { status: 'COMPLETED' }
        });

        const supportTickets = 0; // Placeholder for now
        const conversionRate = totalUsers > 0 ? (await prisma.payment.count({ where: { status: 'COMPLETED' } }) / totalUsers * 100).toFixed(1) : 0;

        // Growth last month
        const startOfLastMonth = new Date();
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
        const usersAtStartOfLastMonth = await prisma.user.count({
            where: { createdAt: { lt: startOfLastMonth } }
        });
        const usersGainedLastMonth = await prisma.user.count({
            where: { createdAt: { gte: startOfLastMonth } }
        });
        const growthRate = usersAtStartOfLastMonth > 0 ? (usersGainedLastMonth / usersAtStartOfLastMonth * 100).toFixed(1) : 0;

        return NextResponse.json({
            totalUsers,
            activeUsers,
            totalCourses,
            totalRevenue,
            newUsersToday,
            courseCompletions,
            supportTickets,
            conversionRate,
            growthRate,
            engagement: 92, // Placeholder
            retention: 81, // Placeholder
            messages: 14 // Placeholder
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
