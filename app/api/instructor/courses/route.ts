// app/api/instructor/courses/route.ts
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

        // Get or create user in database
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

        const courses = await prisma.course.findMany({
            where: {
                instructorId: dbUser.id
            },
            include: {
                category: {
                    select: {
                        name: true,
                        color: true
                    }
                },
                modules: {
                    include: {
                        lessons: {
                            select: {
                                id: true,
                                title: true,
                                isPublished: true
                            }
                        }
                    },
                    orderBy: {
                        sortOrder: 'asc'
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        console.log(`Found ${courses.length} courses for instructor ${dbUser.id}`);
        return NextResponse.json(courses);
    } catch (error) {
        console.error('Error fetching instructor courses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch courses' },
            { status: 500 }
        );
    }
}