import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get all unique conversation participants
        const sentMessages = await prisma.message.findMany({
            where: { senderId: user.id },
            select: { recipientId: true }
        });

        const receivedMessages = await prisma.message.findMany({
            where: { recipientId: user.id },
            select: { senderId: true }
        });

        const participantIds = new Set([
            ...sentMessages.map(m => m.recipientId),
            ...receivedMessages.map(m => m.senderId)
        ]);

        const conversations = await Promise.all(
            Array.from(participantIds).map(async (participantId) => {
                const participant = await prisma.user.findUnique({
                    where: { id: participantId },
                    select: {
                        id: true,
                        clerkId: true,
                        firstName: true,
                        lastName: true,
                        imageUrl: true,
                        role: true
                    }
                });

                const lastMessage = await prisma.message.findFirst({
                    where: {
                        OR: [
                            { senderId: user.id, recipientId: participantId },
                            { senderId: participantId, recipientId: user.id }
                        ]
                    },
                    orderBy: { createdAt: 'desc' }
                });

                const unreadCount = await prisma.message.count({
                    where: {
                        senderId: participantId,
                        recipientId: user.id,
                        isRead: false
                    }
                });

                return {
                    id: participantId,
                    participant,
                    lastMessage,
                    unreadCount
                };
            })
        );

        // Sort by last message time
        conversations.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt || new Date(0);
            const bTime = b.lastMessage?.createdAt || new Date(0);
            return new Date(bTime).getTime() - new Date(aTime).getTime();
        });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
            { status: 500 }
        );
    }
}
