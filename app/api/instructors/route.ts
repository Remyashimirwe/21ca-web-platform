import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const instructors = await prisma.user.findMany({
            where: {
                role: 'INSTRUCTOR',
                isActive: true,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
                title: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 4,
        });

        return NextResponse.json(instructors);
    } catch (error) {
        console.error('Error fetching instructors:', error);
        return NextResponse.json(
            { error: 'Failed to fetch instructors' },
            { status: 500 }
        );
    }
}