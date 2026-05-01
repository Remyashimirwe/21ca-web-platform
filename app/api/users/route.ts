// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/backend';
import { prisma } from '@/lib/prisma';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
});

const validRoles = ['USER', 'INSTRUCTOR', 'ADMIN', 'PARTNER'] as const;

async function requireAdmin() {
    const { userId } = await auth();

    if (!userId) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    const currentUser = await prisma.user.findUnique({
        where: { clerkId: userId }
    });

    if (!currentUser) {
        return { error: NextResponse.json({ error: 'User not found' }, { status: 404 }) };
    }

    if (currentUser.role !== 'ADMIN') {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { currentUser };
}

export async function GET() {
    try {
        const authResult = await requireAdmin();
        if ('error' in authResult) return authResult.error;

        const users = await prisma.user.findMany({
            where: { isActive: true },
            select: {
                id: true,
                clerkId: true,
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
                role: true,
                isActive: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const authResult = await requireAdmin();
        if ('error' in authResult) return authResult.error;

        const body = await req.json();
        const { userId, role } = body as { userId?: string; role?: string };

        if (!userId || !role || !validRoles.includes(role as (typeof validRoles)[number])) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role: role as (typeof validRoles)[number] }
        });

        await clerkClient.users.updateUserMetadata(dbUser.clerkId, {
            publicMetadata: {
                role: role.toLowerCase()
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const authResult = await requireAdmin();
        if ('error' in authResult) return authResult.error;

        const body = await req.json();
        const { userId } = body as { userId?: string };

        if (!userId) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await clerkClient.users.deleteUser(dbUser.clerkId);

        await prisma.user.update({
            where: { id: userId },
            data: { isActive: false }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}