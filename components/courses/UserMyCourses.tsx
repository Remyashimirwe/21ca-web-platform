'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Loader2, ArrowRight, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type EnrolledCourseItem = {
    enrollmentId: string;
    enrolledAt: string;
    progress: number;
    status: string;
    course: {
        id: string;
        title: string;
        slug: string;
        shortDescription?: string | null;
        thumbnail?: string | null;
        price: number | string;
        currency?: string | null;
        level?: string | null;
        averageRating?: number | string | null;
        enrollmentCount?: number;
        category?: {
            id: string;
            name: string;
            slug: string;
            color?: string | null;
        } | null;
        instructor?: {
            firstName?: string | null;
            lastName?: string | null;
        } | null;
    };
};

export default function UserMyCourses() {
    const router = useRouter();
    const [courses, setCourses] = useState<EnrolledCourseItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMyCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/my-courses');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.error || 'Failed to fetch my courses');
                }

                setCourses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load my courses:', error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        loadMyCourses();
    }, []);

    const formatCurrency = (amount: number | string, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(Number(amount) || 0);
    };

    const getInstructorName = (course: EnrolledCourseItem['course']) => {
        if (!course.instructor) return 'Unknown Instructor';
        return `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim() || 'Unknown Instructor';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading your courses...
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <Card className="p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No enrolled courses yet</h2>
                <p className="text-muted-foreground mb-6">
                    Once you enroll in a course, it will appear here.
                </p>
                <Button onClick={() => router.push('/programs')}>
                    Browse Programs
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Courses</h1>
                <p className="text-muted-foreground">Your enrolled learning programs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((item) => {
                    const course = item.course;
                    const rating = Number(course.averageRating) || 0;

                    return (
                        <Card key={item.enrollmentId} className="overflow-hidden hover:shadow-xl transition-all duration-300">
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

                            <CardContent className="p-5 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {course.category?.name ? (
                                            <Badge variant="secondary">{course.category.name}</Badge>
                                        ) : null}
                                        <Badge variant="outline">{item.status}</Badge>
                                    </div>

                                    <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {course.shortDescription || 'No description available.'}
                                    </p>
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
                                        <span>{item.progress}%</span>
                                        <span className="text-xs text-muted-foreground">Progress</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Instructor</p>
                                        <p className="font-medium">{getInstructorName(course)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Price</p>
                                        <p className="font-semibold">
                                            {formatCurrency(course.price, course.currency || 'USD')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        className="flex-1"
                                        onClick={() => router.push(`/my-courses/${course.id}`)}
                                    >
                                        Continue Learning
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}