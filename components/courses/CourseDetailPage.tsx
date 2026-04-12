'use client';

import React, { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
    BookOpen,
    Users,
    Star,
    Clock,
    ArrowRight,
    Play,
    FileText,
    HelpCircle,
    ClipboardList,
    Video,
    BadgeInfo,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';

type CourseLesson = {
    id: string;
    title: string;
    description?: string | null;
    content?: string | null;
    videoUrl?: string | null;
    type: LessonType;
    sortOrder?: number;
    isPublished?: boolean;
    isFree?: boolean;
};

type CourseModule = {
    id: string;
    title: string;
    description?: string | null;
    sortOrder?: number;
    isPublished?: boolean;
    lessons?: CourseLesson[];
};

type Course = {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    thumbnail?: string | null;
    price: number | string;
    currency?: string | null;
    level?: string | null;
    duration?: number | null;
    averageRating?: number | string | null;
    enrollmentCount?: number;
    category?: {
        name: string;
        slug: string;
    } | null;
    instructor?: {
        firstName?: string | null;
        lastName?: string | null;
    } | null;
    modules?: CourseModule[];
    _count?: {
        enrollments?: number;
        reviews?: number;
    };
};

type Props = {
    course: Course;
};

function getLessonIcon(type: LessonType) {
    switch (type) {
        case 'VIDEO':
            return <Video className="h-4 w-4" />;
        case 'TEXT':
            return <FileText className="h-4 w-4" />;
        case 'QUIZ':
            return <HelpCircle className="h-4 w-4" />;
        case 'ASSIGNMENT':
            return <ClipboardList className="h-4 w-4" />;
        case 'LIVE_SESSION':
            return <BadgeInfo className="h-4 w-4" />;
        default:
            return <Play className="h-4 w-4" />;
    }
}

export default function CourseDetailPage({ course }: Props) {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [enrolling, setEnrolling] = useState(false);

    const formattedModules = useMemo(
        () => (course.modules || []).slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
        [course.modules]
    );

    const formatCurrency = (amount: number | string, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(Number(amount) || 0);
    };

    const getInstructorName = () => {
        if (!course?.instructor) return 'Unknown Instructor';
        return `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim() || 'Unknown Instructor';
    };

    const userRole = String((user?.publicMetadata as any)?.role || '').toLowerCase();
    const canEnroll = isLoaded && !!user && userRole !== 'instructor' && userRole !== 'admin';

    const handleEnroll = async () => {
        try {
            setEnrolling(true);

            const response = await fetch(`/api/courses/${course.id}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to enroll');
            }

            router.push('/my-courses');
        } catch (error: any) {
            alert(error?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <Card className="overflow-hidden">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-72 object-cover"
                    />
                ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                )}

                <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            {course.category?.name ? (
                                <Badge variant="secondary">{course.category.name}</Badge>
                            ) : null}
                            {course.level ? (
                                <Badge variant="outline">{course.level}</Badge>
                            ) : null}
                        </div>

                        <h1 className="text-3xl font-bold">{course.title}</h1>
                        <p className="text-muted-foreground">
                            {course.shortDescription || course.description || 'No description available.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col items-center gap-1 p-4 rounded-lg bg-muted/40">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{course.enrollmentCount || 0}</span>
                            <span className="text-xs text-muted-foreground">Students</span>
                        </div>

                        <div className="flex flex-col items-center gap-1 p-4 rounded-lg bg-muted/40">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                                {course.averageRating ? Number(course.averageRating).toFixed(1) : 'N/A'}
                            </span>
                            <span className="text-xs text-muted-foreground">Rating</span>
                        </div>

                        <div className="flex flex-col items-center gap-1 p-4 rounded-lg bg-muted/40">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                                {course.duration ? `${course.duration}m` : 'Flexible'}
                            </span>
                            <span className="text-xs text-muted-foreground">Duration</span>
                        </div>

                        <div className="flex flex-col items-center gap-1 p-4 rounded-lg bg-muted/40">
                            <span className="font-semibold">
                                {formatCurrency(course.price, course.currency || 'USD')}
                            </span>
                            <span className="text-xs text-muted-foreground">Price</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Instructor</p>
                            <p className="font-medium">{getInstructorName()}</p>
                        </div>

                        <div className="flex gap-2">
                            {canEnroll ? (
                                <Button onClick={handleEnroll} disabled={enrolling}>
                                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                    {!enrolling ? <ArrowRight className="h-4 w-4 ml-2" /> : null}
                                </Button>
                            ) : (
                                <Button onClick={() => router.push(`/my-courses/${course.id}`)}>
                                    Continue Learning
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-2xl font-semibold">Course Content</h2>

                    {formattedModules.length === 0 ? (
                        <p className="text-muted-foreground">No modules available yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {formattedModules.map((module) => (
                                <div key={module.id} className="rounded-lg border p-4 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-semibold">{module.title}</h3>
                                        {module.description ? (
                                            <p className="text-sm text-muted-foreground">{module.description}</p>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        {(module.lessons || []).map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-start justify-between gap-3 rounded-md bg-muted/30 p-3"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 text-muted-foreground">
                                                        {getLessonIcon(lesson.type)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-medium">{lesson.title}</span>
                                                            <Badge variant="outline">{lesson.type}</Badge>
                                                            {lesson.isFree ? <Badge>Free</Badge> : null}
                                                        </div>
                                                        {lesson.description ? (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {lesson.description}
                                                            </p>
                                                        ) : null}
                                                        {lesson.type === 'TEXT' && lesson.content ? (
                                                            <p className="text-sm mt-2 whitespace-pre-wrap">{lesson.content}</p>
                                                        ) : null}
                                                        {lesson.type === 'VIDEO' && lesson.videoUrl ? (
                                                            <p className="text-sm mt-2 text-muted-foreground">
                                                                Video lesson available
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                </CardContent>
            </Card>
        </div>
    );
}