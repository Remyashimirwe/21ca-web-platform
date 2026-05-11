import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ notificationId: string }> }
) {
    try {
        const { notificationId } = await params;
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Resolve the caller's DB id so we can scope the update to *their*
        // notifications. Before this change the route did
        // `update({ where: { id: notificationId } })` with no ownership check,
        // letting any signed-in user mark-read any other user's notifications
        // by guessing the id (IDOR).
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true },
        });
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // `updateMany` lets us add a `userId` filter and gives us a count we
        // can use to detect "not yours / not found" without leaking which.
        const result = await prisma.notification.updateMany({
            where: { id: notificationId, userId: dbUser.id },
            data: { isRead: true },
        });

        if (result.count === 0) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return NextResponse.json(
            { error: 'Failed to mark as read' },
            { status: 500 }
        );
    }
}
