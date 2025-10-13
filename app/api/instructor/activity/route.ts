// app/api/instructor/activity/route.ts
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

        // Get recent enrollments
        const recentEnrollments = await prisma.enrollment.findMany({
            where: {
                course: {
                    instructorId: dbUser.id
                }
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                course: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                enrolledAt: 'desc'
            },
            take: 10
        });

        // Get recent reviews
        const recentReviews = await prisma.review.findMany({
            where: {
                course: {
                    instructorId: dbUser.id
                }
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                course: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        // Get recent completions
        const recentCompletions = await prisma.enrollment.findMany({
            where: {
                course: {
                    instructorId: dbUser.id
                },
                status: 'COMPLETED'
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                course: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                completedAt: 'desc'
            },
            take: 5
        });

        // Format activity feed
        type Activity = {
            type: 'enrollment' | 'review' | 'completion';
            message: string;
            time: string;
            timestamp: Date;
        };
        const activities: Activity[] = [];

        // Add enrollments
        recentEnrollments.forEach(enrollment => {
            activities.push({
                type: 'enrollment',
                message: `${enrollment.user.firstName} ${enrollment.user.lastName} enrolled in "${enrollment.course.title}"`,
                time: formatTimeAgo(enrollment.enrolledAt),
                timestamp: enrollment.enrolledAt
            });
        });

        // Add reviews
        recentReviews.forEach(review => {
            activities.push({
                type: 'review',
                message: `${review.user.firstName} ${review.user.lastName} left a ${review.rating}-star review on "${review.course.title}"`,
                time: formatTimeAgo(review.createdAt),
                timestamp: review.createdAt
            });
        });

        // Add completions
        recentCompletions.forEach(completion => {
            if (completion.completedAt) {
                activities.push({
                    type: 'completion',
                    message: `${completion.user.firstName} ${completion.user.lastName} completed "${completion.course.title}"`,
                    time: formatTimeAgo(completion.completedAt),
                    timestamp: completion.completedAt
                });
            }
        });

        // Sort by timestamp and take top 10
        activities.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return NextResponse.json(activities.slice(0, 10));
    } catch (error) {
        console.error('Error fetching activity:', error);
        return NextResponse.json([], { status: 200 }); // Return empty array on error
    }
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
}