import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
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

        await prisma.notification.updateMany({
            where: {
                userId: dbUser.id,
                isRead: false
            },
            data: {
                isRead: true
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking all as read:', error);
        return NextResponse.json(
            { error: 'Failed to mark all as read' },
            { status: 500 }
        );
    }
}