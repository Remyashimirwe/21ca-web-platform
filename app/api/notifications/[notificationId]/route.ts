import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ notificationId: string }> }
) {
    try {
        const { notificationId } = await params;
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Scope the delete to the caller's own notifications. Without this
        // ownership check, any signed-in user could delete arbitrary
        // notifications by guessing their id (IDOR).
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true },
        });
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const result = await prisma.notification.deleteMany({
            where: { id: notificationId, userId: dbUser.id },
        });

        if (result.count === 0) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting notification:', error);
        return NextResponse.json(
            { error: 'Failed to delete notification' },
            { status: 500 }
        );
    }
}
