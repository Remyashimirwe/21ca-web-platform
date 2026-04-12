'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Star, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Course = {
    id: string;
    title: string;
    slug: string;
    shortDescription?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    price: number | string;
    currency?: string | null;
    level?: string | null;
    duration?: number | null;
    averageRating?: number | string | null;
    enrollmentCount?: number;
    isEnrolled?: boolean;
    category: {
        id: string;
        name: string;
        slug: string;
        color?: string | null;
    };
    instructor: {
        firstName?: string | null;
        lastName?: string | null;
    };
};

type CategoryGroup = {
    categoryId: string;
    categoryName: string;
    categorySlug: string;
    categoryColor?: string | null;
    courses: Course[];
};

export default function ProgramsPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState<string | null>(null);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/programs');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.error || 'Failed to load programs');
                }

                setCourses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load programs:', error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    const groupedPrograms: CategoryGroup[] = useMemo(() => {
        const map = new Map<string, CategoryGroup>();

        for (const course of courses) {
            const categoryId = course.category?.id || 'uncategorized';
            const existing = map.get(categoryId);

            if (existing) {
                existing.courses.push(course);
            } else {
                map.set(categoryId, {
                    categoryId,
                    categoryName: course.category?.name || 'Uncategorized',
                    categorySlug: course.category?.slug || 'uncategorized',
                    categoryColor: course.category?.color || null,
                    courses: [course],
                });
            }
        }

        return Array.from(map.values());
    }, [courses]);

    const handleEnroll = async (courseId: string) => {
        try {
            setEnrollingId(courseId);

            const response = await fetch(`/api/courses/${courseId}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to enroll');
            }

            setCourses((prev) =>
                prev.map((course) =>
                    course.id === courseId
                        ? { ...course, isEnrolled: true }
                        : course
                )
            );
        } catch (error: any) {
            alert(error?.message || 'Enrollment failed');
        } finally {
            setEnrollingId(null);
        }
    };

    const formatCurrency = (amount: number | string, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(Number(amount) || 0);
    };

    const getInstructorName = (instructor?: Course['instructor']) => {
        if (!instructor) return 'Unknown Instructor';
        return `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || 'Unknown Instructor';
    };

    return (
        <div className="space-y-10 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold">Programs</h1>
                    <p className="text-muted-foreground mt-3 max-w-2xl">
                        Browse approved programs by category and enroll in the ones that fit your goals.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading programs...
                        </div>
                    </div>
                ) : groupedPrograms.length === 0 ? (
                    <Card className="p-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No programs available yet</h2>
                        <p className="text-muted-foreground">
                            Approved courses will appear here once admins publish them.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-12">
                        {groupedPrograms.map((group) => (
                            <section key={group.categoryId} className="space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">{group.categoryName}</h2>
                                        <p className="text-muted-foreground">
                                            {group.courses.length} published course{group.courses.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    {group.categoryColor ? (
                                        <Badge
                                            className="capitalize"
                                            style={{ backgroundColor: group.categoryColor, color: 'white' }}
                                        >
                                            {group.categorySlug}
                                        </Badge>
                                    ) : null}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {group.courses.map((course) => {
                                        const rating = Number(course.averageRating) || 0;
                                        const price = Number(course.price) || 0;

                                        return (
                                            <Card
                                                key={course.id}
                                                className="overflow-hidden hover:shadow-xl transition-all duration-300"
                                            >
                                                <div className="relative">
                                                    {course.thumbnail ? (
                                                        <img
                                                            src={course.thumbnail}
                                                            alt={course.title}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                                            <BookOpen className="h-12 w-12 text-primary/40" />
                                                        </div>
                                                    )}
                                                </div>

                                                <CardContent className="p-5 space-y-4">
                                                    <div className="space-y-2">
                                                        <h3 className="text-lg font-semibold line-clamp-2">
                                                            {course.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {course.shortDescription || course.description || 'No description available.'}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Badge variant="outline">
                                                            {course.level || 'Beginner'}
                                                        </Badge>
                                                        <Badge variant="secondary">
                                                            {course.category?.name || 'Uncategorized'}
                                                        </Badge>
                                                        {course.isEnrolled ? (
                                                            <Badge variant="default" className="bg-green-600">
                                                                Enrolled
                                                            </Badge>
                                                        ) : null}
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <Users className="h-4 w-4 text-muted-foreground" />
                                                            <span>{course.enrollmentCount || 0}</span>
                                                            <span className="text-xs text-muted-foreground">Students</span>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <Star className="h-4 w-4 text-muted-foreground" />
                                                            <span>{rating ? rating.toFixed(1) : 'N/A'}</span>
                                                            <span className="text-xs text-muted-foreground">Rating</span>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                            <span>{course.duration ? `${course.duration}m` : 'Flexible'}</span>
                                                            <span className="text-xs text-muted-foreground">Duration</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Instructor</p>
                                                            <p className="font-medium">{getInstructorName(course.instructor)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-muted-foreground">Price</p>
                                                            <p className="font-semibold">
                                                                {formatCurrency(course.price, course.currency || 'USD')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 pt-2">
                                                        {course.isEnrolled ? (
                                                            <Button
                                                                className="flex-1"
                                                                onClick={() => router.push(`/my-courses`)}
                                                            >
                                                                View My Course
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                className="flex-1"
                                                                onClick={() => handleEnroll(course.id)}
                                                                disabled={enrollingId === course.id}
                                                            >
                                                                {enrollingId === course.id ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        Enrolling...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Enroll
                                                                        <ArrowRight className="h-4 w-4 ml-2" />
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => router.push(`/courses/${course.slug}`)}
                                                        >
                                                            View
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}