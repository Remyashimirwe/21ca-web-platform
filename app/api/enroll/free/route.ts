import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = await req.json();

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const existing = await prisma.enrollment.findFirst({
            where: {
                userId: dbUser.id,
                courseId,
            },
        });

        if (existing) {
            return NextResponse.json({ success: true, message: 'Already enrolled' });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: dbUser.id,
                courseId,
                status: 'ACTIVE',
                paymentStatus: 'FREE',
            } as any,
        });

        return NextResponse.json({ success: true, enrollment });
    } catch (error) {
        console.error('Free enrollment error:', error);
        return NextResponse.json(
            { error: 'Failed to enroll' },
            { status: 500 }
        );
    }
}