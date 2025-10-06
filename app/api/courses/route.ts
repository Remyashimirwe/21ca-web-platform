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

        console.log('Creating course for user:', userId);

        // Sync or get user from database
        let dbUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        // If user doesn't exist in DB, create them
        if (!dbUser) {
            console.log('User not found in DB, creating...');
            
            // Get role from Clerk and convert to uppercase to match Prisma enum
            const clerkRole = clerkUser.publicMetadata?.role as string;
            const userRole = clerkRole ? clerkRole.toUpperCase() : 'USER';
            
            // Validate role matches enum
            const validRoles = ['USER', 'INSTRUCTOR', 'ADMIN', 'PARTNER'];
            const finalRole = validRoles.includes(userRole) ? userRole : 'USER';
            
            dbUser = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    firstName: clerkUser.firstName || '',
                    lastName: clerkUser.lastName || '',
                    imageUrl: clerkUser.imageUrl || '',
                    role: finalRole as any // Cast to any to avoid TypeScript enum issues
                }
            });
            console.log('User created:', dbUser.id, 'with role:', finalRole);
        }

        const body = await req.json();
        console.log('Received course data:', {
            title: body.title,
            categoryId: body.categoryId,
            modulesCount: body.modules?.length
        });

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

        // Validate required fields
        if (!title || !categoryId) {
            return NextResponse.json(
                { error: 'Missing required fields: title and categoryId are required' },
                { status: 400 }
            );
        }

        // Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return NextResponse.json(
                { error: `Category with id ${categoryId} not found. Please seed categories first by running: npx tsx scripts/seed-categories.ts` },
                { status: 400 }
            );
        }

        // Generate slug from title
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();

        console.log('Creating course with slug:', slug);

        const course = await prisma.course.create({
            data: {
                title,
                slug: `${slug}-${Date.now()}`,
                shortDescription: shortDescription || '',
                description: description || '',
                thumbnail: thumbnail || null,
                price: Number(price) || 0,
                discountPrice: discountPrice ? Number(discountPrice) : null,
                currency: currency || 'USD',
                language: language || 'en',
                level: level || 'BEGINNER',
                duration: duration ? Number(duration) : null,
                categoryId,
                objectives: objectives || [],
                requirements: requirements || [],
                targetAudience: targetAudience || [],
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || shortDescription || '',
                status: status || 'DRAFT',
                isPublished: status === 'PUBLISHED',
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                instructorId: dbUser.id,
                modules: modules && modules.length > 0 ? {
                    create: modules.map((module: any, moduleIndex: number) => ({
                        title: module.title || `Module ${moduleIndex + 1}`,
                        description: module.description || '',
                        sortOrder: moduleIndex,
                        isPublished: status === 'PUBLISHED',
                        lessons: module.lessons && module.lessons.length > 0 ? {
                            create: module.lessons.map((lesson: any, lessonIndex: number) => ({
                                title: lesson.title || `Lesson ${lessonIndex + 1}`,
                                description: lesson.description || '',
                                content: lesson.content || '',
                                videoUrl: lesson.videoUrl || null,
                                videoDuration: lesson.videoDuration ? Number(lesson.videoDuration) : null,
                                type: lesson.type || 'VIDEO',
                                isFree: lesson.isFree || false,
                                sortOrder: lessonIndex,
                                isPublished: status === 'PUBLISHED'
                            }))
                        } : undefined
                    }))
                } : undefined
            },
            include: {
                modules: {
                    include: {
                        lessons: true
                    }
                },
                category: true
            }
        });

        console.log('Course created successfully:', course.id);

        // Handle tags if provided
        if (tags && Array.isArray(tags) && tags.length > 0) {
            try {
                await prisma.courseTag.createMany({
                    data: tags.map((tagId: string) => ({
                        courseId: course.id,
                        tagId
                    })),
                    skipDuplicates: true
                });
            } catch (tagError) {
                console.error('Error creating tags:', tagError);
            }
        }

        return NextResponse.json(course, { status: 201 });
    } catch (error: any) {
        console.error('Error creating course:', error);
        return NextResponse.json(
            { 
                error: 'Failed to create course',
                details: error.message,
                code: error.code
            },
            { status: 500 }
        );
    }
}