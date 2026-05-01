import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: { conversationId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        const otherUser = await prisma.user.findUnique({
            where: { clerkId: params.conversationId }
        });

        if (!user || !otherUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await prisma.message.updateMany({
            where: {
                senderId: otherUser.id,
                recipientId: user.id,
                isRead: false
            },
            data: {
                isRead: true
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        return NextResponse.json(
            { error: 'Failed to mark messages as read' },
            { status: 500 }
        );
    }
}
