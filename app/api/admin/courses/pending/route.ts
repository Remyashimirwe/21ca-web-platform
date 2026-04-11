import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
    const { userId } = await auth();

    if (!userId) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!dbUser) {
        return { error: NextResponse.json({ error: 'User not found' }, { status: 404 }) };
    }

    if (dbUser.role !== 'ADMIN') {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { dbUser };
}

export async function GET() {
    try {
        const adminCheck = await requireAdmin();
        if ('error' in adminCheck) return adminCheck.error;

        const courses = await prisma.course.findMany({
            where: {
                status: 'UNDER_REVIEW',
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                instructor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        imageUrl: true,
                        role: true,
                    },
                },
                category: true,
                modules: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const payload = courses.map((course) => ({
            ...course,
            modulesCount: course.modules.length,
        }));

        return NextResponse.json(payload);
    } catch (error) {
        console.error('Error fetching pending courses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pending courses' },
            { status: 500 }
        );
    }
}