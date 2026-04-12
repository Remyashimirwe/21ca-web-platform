import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications'; // make sure this exists

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!dbUser) {
      const clerkRole = clerkUser.publicMetadata?.role as string;
      const userRole = clerkRole ? clerkRole.toUpperCase() : 'USER';
      const validRoles = ['USER', 'INSTRUCTOR', 'ADMIN', 'PARTNER'];
      const finalRole = validRoles.includes(userRole) ? userRole : 'USER';

      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          imageUrl: clerkUser.imageUrl || '',
          role: finalRole as any,
        },
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
      status,
    } = body;

    if (!title || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: title and categoryId are required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json(
        { error: `Category with id ${categoryId} not found. Seed categories first.` },
        { status: 400 }
      );
    }

    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();
    const normalizedStatus = (status || 'DRAFT') as 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
    const shouldPublish = normalizedStatus === 'PUBLISHED';

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
        status: normalizedStatus,
        isPublished: shouldPublish,
        publishedAt: shouldPublish ? new Date() : null,
        instructorId: dbUser.id,
        modules:
          modules && modules.length > 0
            ? {
                create: modules.map((module: any, moduleIndex: number) => ({
                  title: module.title || `Module ${moduleIndex + 1}`,
                  description: module.description || '',
                  sortOrder: moduleIndex,
                  isPublished: shouldPublish,
                  lessons:
                    module.lessons && module.lessons.length > 0
                      ? {
                          create: module.lessons.map((lesson: any, lessonIndex: number) => ({
                            title: lesson.title || `Lesson ${lessonIndex + 1}`,
                            description: lesson.description || '',
                            content: lesson.content || '',
                            videoUrl: lesson.videoUrl || null,
                            videoDuration: lesson.videoDuration ? Number(lesson.videoDuration) : null,
                            type: lesson.type || 'VIDEO',
                            isFree: lesson.isFree || false,
                            sortOrder: lessonIndex,
                            isPublished: shouldPublish,
                          })),
                        }
                      : undefined,
                })),
              }
            : undefined,
      },
      include: {
        modules: { include: { lessons: true } },
        category: true,
      },
    });

    if (tags && Array.isArray(tags) && tags.length > 0) {
      try {
        await prisma.courseTag.createMany({
          data: tags.map((tagId: string) => ({ courseId: course.id, tagId })),
          skipDuplicates: true,
        });
      } catch (tagError) {
        console.error('Error creating tags:', tagError);
      }
    }

    if (normalizedStatus === 'UNDER_REVIEW') {
      await createNotification({
        userId: dbUser.id,
        title: '📚 Course Submitted for Review',
        message: `Your course "${course.title}" has been submitted for review. We'll notify you once it's been reviewed.`,
        type: 'INFO',
        actionUrl: `/instructor/courses`,
      });
    }

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course', details: error.message, code: error.code },
      { status: 500 }
    );
  }
}
