import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

type CourseStatus = 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';
type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY' | 'CHECKBOX';
type CalendarProvider = 'NONE' | 'GOOGLE' | 'MICROSOFT';

type LessonPayload = {
    title: string;
    description?: string | null;
    content?: string | null;
    videoUrl?: string | null;
    videoDuration?: number | null;
    type: LessonType;
    isFree?: boolean;
    sortOrder?: number;
    quizQuestions?: Array<{
        question: string;
        type: QuestionType;
        points?: number;
        answerText?: string | null;
        sortOrder?: number;
        options?: Array<{
            text: string;
            isCorrect?: boolean;
            sortOrder?: number;
        }>;
    }>;
    assignmentQuestions?: Array<{
        title: string;
        type: QuestionType;
        points?: number;
        answerText?: string | null;
        sortOrder?: number;
        options?: Array<{
            text: string;
            isCorrect?: boolean;
            sortOrder?: number;
        }>;
    }>;
    liveSession?: {
        title: string;
        description?: string | null;
        date: string;
        time: string;
        duration?: number;
        meetingLink?: string | null;
        calendarProvider?: CalendarProvider;
    } | null;
};

type ModulePayload = {
    title: string;
    description?: string | null;
    sortOrder?: number;
    lessons?: LessonPayload[];
};

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!dbUser) {
            const clerkRole = clerkUser.publicMetadata?.role as string | undefined;
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
        } = body as {
            title?: string;
            shortDescription?: string;
            description?: string;
            thumbnail?: string | null;
            price?: number | string;
            discountPrice?: number | string | null;
            currency?: string;
            language?: string;
            level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
            duration?: number | string | null;
            categoryId?: string;
            objectives?: string[];
            requirements?: string[];
            targetAudience?: string[];
            tags?: string[];
            metaTitle?: string;
            metaDescription?: string;
            modules?: ModulePayload[];
            status?: CourseStatus;
        };

        if (!title || !categoryId) {
            return NextResponse.json(
                { error: 'Missing required fields: title and categoryId are required' },
                { status: 400 }
            );
        }

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return NextResponse.json(
                { error: `Category with id ${categoryId} not found. Seed categories first.` },
                { status: 400 }
            );
        }

        const normalizedStatus = (status || 'DRAFT') as CourseStatus;
        const shouldPublish = normalizedStatus === 'PUBLISHED';

        const slugBase = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();

        const course = await prisma.course.create({
            data: {
                title,
                slug: `${slugBase}-${Date.now()}`,
                shortDescription: shortDescription || '',
                description: description || '',
                thumbnail: thumbnail || null,
                price: Number(price) || 0,
                discountPrice: discountPrice !== null && discountPrice !== undefined && discountPrice !== ''
                    ? Number(discountPrice)
                    : null,
                currency: currency || 'USD',
                language: language || 'en',
                level: level || 'BEGINNER',
                duration: duration !== null && duration !== undefined && duration !== ''
                    ? Number(duration)
                    : null,
                categoryId,
                objectives: Array.isArray(objectives) ? objectives : [],
                requirements: Array.isArray(requirements) ? requirements : [],
                targetAudience: Array.isArray(targetAudience) ? targetAudience : [],
                metaTitle: metaTitle || title,
                metaDescription: metaDescription || shortDescription || '',
                status: normalizedStatus,
                isPublished: shouldPublish,
                publishedAt: shouldPublish ? new Date() : null,
                instructorId: dbUser.id,
                modules: Array.isArray(modules) && modules.length > 0
                    ? {
                          create: modules.map((module, moduleIndex) => ({
                              title: module.title || `Module ${moduleIndex + 1}`,
                              description: module.description || null,
                              sortOrder: module.sortOrder ?? moduleIndex,
                              isPublished: shouldPublish,
                              lessons: Array.isArray(module.lessons) && module.lessons.length > 0
                                  ? {
                                        create: module.lessons.map((lesson, lessonIndex) => {
                                            const lessonData: any = {
                                                title: lesson.title || `Lesson ${lessonIndex + 1}`,
                                                description: lesson.description || null,
                                                content: lesson.content || null,
                                                videoUrl: lesson.videoUrl || null,
                                                videoDuration: lesson.videoDuration ? Number(lesson.videoDuration) : null,
                                                type: lesson.type || 'VIDEO',
                                                isFree: lesson.isFree || false,
                                                sortOrder: lesson.sortOrder ?? lessonIndex,
                                                isPublished: shouldPublish,
                                            };

                                            if (lesson.type === 'QUIZ') {
                                                lessonData.quizQuestions = {
                                                    create: (lesson.quizQuestions || []).map((question, questionIndex) => ({
                                                        question: question.question,
                                                        type: question.type,
                                                        points: question.points ?? 1,
                                                        answerText: question.answerText || null,
                                                        sortOrder: question.sortOrder ?? questionIndex,
                                                        options: {
                                                            create: (question.options || []).map((option, optionIndex) => ({
                                                                text: option.text,
                                                                isCorrect: option.isCorrect || false,
                                                                sortOrder: option.sortOrder ?? optionIndex,
                                                            })),
                                                        },
                                                    })),
                                                };
                                            }

                                            if (lesson.type === 'ASSIGNMENT') {
                                                lessonData.assignmentQuestions = {
                                                    create: (lesson.assignmentQuestions || []).map((question, questionIndex) => ({
                                                        title: question.title,
                                                        type: question.type,
                                                        points: question.points ?? 1,
                                                        answerText: question.answerText || null,
                                                        sortOrder: question.sortOrder ?? questionIndex,
                                                        options: {
                                                            create: (question.options || []).map((option, optionIndex) => ({
                                                                text: option.text,
                                                                isCorrect: option.isCorrect || false,
                                                                sortOrder: option.sortOrder ?? optionIndex,
                                                            })),
                                                        },
                                                    })),
                                                };
                                            }

                                            if (lesson.type === 'LIVE_SESSION' && lesson.liveSession) {
                                                lessonData.liveSession = {
                                                    create: {
                                                        title: lesson.liveSession.title,
                                                        description: lesson.liveSession.description || null,
                                                        date: new Date(lesson.liveSession.date),
                                                        time: lesson.liveSession.time,
                                                        duration: lesson.liveSession.duration ?? 60,
                                                        meetingLink: lesson.liveSession.meetingLink || null,
                                                        calendarProvider: lesson.liveSession.calendarProvider || 'NONE',
                                                    },
                                                };
                                            }

                                            return lessonData;
                                        }),
                                    }
                                  : undefined,
                          })),
                      }
                    : undefined,
            },
            include: {
                modules: {
                    include: {
                        lessons: {
                            include: {
                                quizQuestions: {
                                    include: { options: true },
                                },
                                assignmentQuestions: {
                                    include: { options: true },
                                },
                                liveSession: true,
                            },
                        },
                    },
                },
                category: true,
                tags: true,
            },
        });

        if (Array.isArray(tags) && tags.length > 0) {
            try {
                await prisma.courseTag.createMany({
                    data: tags.map((tagId: string) => ({
                        courseId: course.id,
                        tagId,
                    })),
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
                actionUrl: '/instructor/courses',
            });
        }

        return NextResponse.json(course, { status: 201 });
    } catch (error: any) {
        console.error('Error creating course:', error);
        return NextResponse.json(
            {
                error: 'Failed to create course',
                details: error?.message || 'Unknown error',
                code: error?.code,
            },
            { status: 500 }
        );
    }
}
