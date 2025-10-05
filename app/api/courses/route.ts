import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
                slug: `${slug}-${Date.now()}`, // Ensure uniqueness
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
                instructorId: userId,
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
            { error: 'Failed to create course' },
            { status: 500 }
        );
    }
}