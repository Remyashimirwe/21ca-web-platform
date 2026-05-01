'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    Clock3,
    Search,
    Sparkles,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type UserCourse = {
    id: string;
    title: string;
    slug: string;
    shortDescription?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    progress?: number | null;
    status?: string | null;
    level?: string | null;
    duration?: number | null;
    isPremium?: boolean;
    enrolledAt?: string | Date | null;
    averageRating?: number | string | null;
    instructor?: {
        firstName?: string | null;
        lastName?: string | null;
    } | null;
    category?: {
        name?: string;
        slug?: string;
    } | null;
};

type Props = {
    courses: UserCourse[];
    loading?: boolean;
};

function formatDate(value?: string | Date | null) {
    if (!value) return null;
    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export default function UserMyCourses({ courses, loading = false }: Props) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return courses;

        return courses.filter((course) => {
            const title = (course.title || '').toLowerCase();
            const desc = (course.shortDescription || course.description || '').toLowerCase();
            const category = (course.category?.name || '').toLowerCase();
            const instructor = [
                course.instructor?.firstName,
                course.instructor?.lastName,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return (
                title.includes(query) ||
                desc.includes(query) ||
                category.includes(query) ||
                instructor.includes(query)
            );
        });
    }, [courses, searchQuery]);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="h-44 rounded-t-2xl bg-muted" />
                        <CardContent className="space-y-4 p-5">
                            <div className="h-4 w-2/3 rounded bg-muted" />
                            <div className="h-3 w-full rounded bg-muted" />
                            <div className="h-3 w-5/6 rounded bg-muted" />
                            <div className="h-10 w-full rounded bg-muted" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold">My Courses</h2>
                    <p className="text-sm text-muted-foreground">
                        Continue learning where you left off.
                    </p>
                </div>

                <div className="relative w-full sm:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search your courses..."
                        className="pl-9"
                    />
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <BookOpen className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-semibold">
                            {searchQuery ? 'No matching courses found' : 'No enrolled courses yet'}
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            {searchQuery
                                ? 'Try a different search term.'
                                : 'Once you enroll in a course, it will appear here so you can continue learning.'}
                        </p>
                        <Button className="mt-6" onClick={() => router.push('/courses')}>
                            Browse Courses
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredCourses.map((course) => {
                        const progress = Math.max(0, Math.min(100, Number(course.progress ?? 0)));
                        const enrolledAt = formatDate(course.enrolledAt);
                        const isPremium = Boolean(course.isPremium);
                        const rating =
                            course.averageRating !== undefined && course.averageRating !== null
                                ? Number(course.averageRating)
                                : null;

                        return (
                            <Card
                                key={course.id}
                                className="overflow-hidden border-border/60 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <div className="relative h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <BookOpen className="h-14 w-14 text-white/40" />
                                        </div>
                                    )}

                                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                                        <Badge className="bg-black/50 text-white hover:bg-black/60">
                                            {isPremium ? (
                                                <>
                                                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                                                    Premium
                                                </>
                                            ) : (
                                                'Free'
                                            )}
                                        </Badge>

                                        {course.level ? (
                                            <Badge variant="secondary">{course.level}</Badge>
                                        ) : null}
                                    </div>
                                </div>

                                <CardContent className="space-y-4 p-5">
                                    <div>
                                        <h3 className="line-clamp-2 text-lg font-semibold">{course.title}</h3>
                                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                            {course.shortDescription || course.description || 'No description available.'}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {course.category?.name ? (
                                            <Badge variant="outline">{course.category.name}</Badge>
                                        ) : null}

                                        {enrolledAt ? (
                                            <Badge variant="outline" className="gap-1">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                Enrolled {enrolledAt}
                                            </Badge>
                                        ) : null}

                                        {rating !== null ? (
                                            <Badge variant="outline" className="gap-1">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                {rating.toFixed(1)}
                                            </Badge>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-medium">{progress}%</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <BadgeCheck className="h-4 w-4 text-green-500" />
                                            Status
                                        </div>
                                        <span className="font-medium">
                                            {course.status || 'ACTIVE'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 pt-1">
                                        <Button
                                            className="flex-1"
                                            onClick={() => router.push(`/my-courses/${course.id}`)}
                                        >
                                            Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>

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
            )}
        </div>
    );
}