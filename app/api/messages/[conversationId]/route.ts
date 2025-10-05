import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
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

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: user.id, recipientId: otherUser.id },
                    { senderId: otherUser.id, recipientId: user.id }
                ]
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        clerkId: true,
                        firstName: true,
                        lastName: true,
                        imageUrl: true
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        clerkId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}