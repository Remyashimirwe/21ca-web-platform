import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let dbUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!dbUser) {
            const clerkRole = (clerkUser.publicMetadata?.role as string) || 'user';
            const userRole = clerkRole.toUpperCase();
            const validRoles = ['USER', 'INSTRUCTOR', 'ADMIN', 'PARTNER'];
            const finalRole = validRoles.includes(userRole) ? userRole : 'USER';

            dbUser = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    firstName: clerkUser.firstName || '',
                    lastName: clerkUser.lastName || '',
                    imageUrl: clerkUser.imageUrl || '',
                    role: finalRole as any
                }
            });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: dbUser.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}