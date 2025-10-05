// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();
        
        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Sync or get user from database
        let dbUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        // If user doesn't exist in DB, create them
        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    firstName: clerkUser.firstName || '',
                    lastName: clerkUser.lastName || '',
                    imageUrl: clerkUser.imageUrl || '',
                    role: (clerkUser.publicMetadata?.role as any) || 'USER'
                }
            });
        }

        const body = await req.json();
        const {
            title,
            shortDescription,
            description,
            thumbnail,
            price,
            discountPrice,
            currency,
            language,
            level,
            duration,
            categoryId,
            objectives,
            requirements,
            targetAudience,
            tags,
            metaTitle,
            metaDescription,
            modules,
            status
        } = body;

        // Generate slug from title
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();

        const course = await prisma.course.create({
            data: {
                title,
                slug: `${slug}-${Date.now()}`,
                shortDescription,
                description,
                thumbnail,
                price,
                discountPrice,
                currency,
                language,
                level,
                duration,
                categoryId,
                objectives,
                requirements,
                targetAudience,
                metaTitle,
                metaDescription,
                status,
                isPublished: status === 'PUBLISHED',
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                instructorId: dbUser.id, // Use DB user ID, not Clerk ID
                modules: {
                    create: modules.map((module: any, moduleIndex: number) => ({
                        title: module.title,
                        description: module.description,
                        sortOrder: moduleIndex,
                        isPublished: status === 'PUBLISHED',
                        lessons: {
                            create: module.lessons.map((lesson: any, lessonIndex: number) => ({
                                title: lesson.title,
                                description: lesson.description,
                                content: lesson.content,
                                videoUrl: lesson.videoUrl,
                                videoDuration: lesson.videoDuration,
                                type: lesson.type,
                                isFree: lesson.isFree,
                                sortOrder: lessonIndex,
                                isPublished: status === 'PUBLISHED'
                            }))
                        }
                    }))
                }
            },
            include: {
                modules: {
                    include: {
                        lessons: true
                    }
                }
            }
        });

        // Handle tags
        if (tags && tags.length > 0) {
            await prisma.courseTag.createMany({
                data: tags.map((tagId: string) => ({
                    courseId: course.id,
                    tagId
                }))
            });
        }

        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json(
            { error: 'Failed to create course', details: error },
            { status: 500 }
        );
    }
}