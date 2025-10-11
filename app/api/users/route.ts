// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get all users except current user
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: currentUser.id
                },
                isActive: true
            },
            select: {
                id: true,
                clerkId: true,
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
                role: true
            },
            orderBy: {
                firstName: 'asc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}