import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const submissions = await prisma.submission.findMany({
            where: {
                assignment: {
                    creatorId: dbUser.id
                }
            },
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        imageUrl: true,
                    }
                },
                assignment: {
                    select: {
                        title: true,
                        course: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                submittedAt: 'desc'
            }
        });

        return NextResponse.json(submissions);
    } catch (error: any) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch submissions', details: error?.message },
            { status: 500 }
        );
    }
}
