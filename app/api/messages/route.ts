import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications'; // <-- make sure this exists

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { recipientId, content } = body;

    // Fetch sender and recipient from the database
    const sender = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    const recipient = await prisma.user.findUnique({
      where: { clerkId: recipientId },
    });

    if (!sender || !recipient) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: sender.id,
        recipientId: recipient.id,
        type: 'DIRECT',
      },
      include: {
        sender: {
          select: {
            id: true,
            clerkId: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            clerkId: true,
          },
        },
      },
    });

    // 🔔 Create a notification for the recipient
    await createNotification({
      userId: recipient.id,
      title: '💬 New Message',
      message: `You have a new message from ${sender.firstName} ${sender.lastName}`,
      type: 'INFO',
      actionUrl: `/messages?to=${sender.clerkId}`,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
