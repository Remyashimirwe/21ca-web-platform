'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    BookOpen,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    RefreshCw,
    Filter,
    Users,
    Layers3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CourseReviewCard from './CourseReviewCard';

type CourseItem = {
    id: string;
    title: string;
    slug: string;
    shortDescription: string | null;
    description: string;
    status: 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
    isPublished: boolean;
    createdAt: string;
    publishedAt: string | null;
    instructor: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        imageUrl: string | null;
        role: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    modulesCount?: number;
    lessonsCount?: number;
};

export default function AdminCoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | CourseItem['status']>('ALL');

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'ALL') params.set('status', statusFilter);
            if (query.trim()) params.set('q', query.trim());

            const response = await fetch(`/api/admin/courses?${params.toString()}`, {
                cache: 'no-store',
            });

            const data = await response.json();
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch admin courses:', error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const filteredCourses = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return courses;

        return courses.filter((course) => {
            const instructorName = `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.toLowerCase();
            return (
                course.title.toLowerCase().includes(q) ||
                course.description.toLowerCase().includes(q) ||
                instructorName.includes(q) ||
                course.category.name.toLowerCase().includes(q)
            );
        });
    }, [courses, query]);

    const stats = {
        total: courses.length,
        underReview: courses.filter((c) => c.status === 'UNDER_REVIEW').length,
        published: courses.filter((c) => c.status === 'PUBLISHED').length,
        drafts: courses.filter((c) => c.status === 'DRAFT').length,
    };

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
                        <p className="mt-2 text-muted-foreground">
                            Review, approve, and manage all instructor courses.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={fetchCourses}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                        <Button asChild>
                            <Link href="/admin/courses/review">
                                <Eye className="mr-2 h-4 w-4" />
                                Review Queue
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Courses</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                                </div>
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Under Review</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.underReview}</p>
                                </div>
                                <Clock className="h-6 w-6 text-amber-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Published</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.published}</p>
                                </div>
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Drafts</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.drafts}</p>
                                </div>
                                <Layers3 className="h-6 w-6 text-slate-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-primary" />
                            All Courses
                        </CardTitle>

                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
                            <div className="relative w-full md:w-96">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by course, instructor, or category..."
                                    className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="DRAFT">Draft</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <div className="py-12 text-center text-muted-foreground">Loading courses...</div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">No courses found.</div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCourses.map((course) => (
                                    <CourseReviewCard
                                        key={course.id}
                                        course={course}
                                        savingId={savingId}
                                        onSavingIdChange={setSavingId}
                                        onRefresh={fetchCourses}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}