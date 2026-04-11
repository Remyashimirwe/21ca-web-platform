'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    BookOpen,
    Clock,
    Users,
    Eye,
    CheckCircle2,
    XCircle,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

function getStatusTone(status: CourseItem['status']) {
    switch (status) {
        case 'UNDER_REVIEW':
            return 'secondary';
        case 'PUBLISHED':
            return 'default';
        case 'DRAFT':
            return 'outline';
        case 'ARCHIVED':
            return 'destructive';
        default:
            return 'secondary';
    }
}

export default function CourseReviewCard({
    course,
    savingId,
    onSavingIdChange,
    onRefresh,
}: {
    course: CourseItem;
    savingId: string | null;
    onSavingIdChange: (id: string | null) => void;
    onRefresh: () => Promise<void>;
}) {
    const router = useRouter();

    const approveCourse = async () => {
        onSavingIdChange(course.id);
        try {
            const res = await fetch(`/api/admin/courses/${course.id}/approve`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error('Failed to approve course');

            await onRefresh();
        } catch (error) {
            console.error(error);
            alert('Failed to approve course');
        } finally {
            onSavingIdChange(null);
        }
    };

    return (
        <Card className="border border-border/60 bg-muted/10">
            <CardContent className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                            <Badge variant={getStatusTone(course.status)}>{course.status.replace('_', ' ')}</Badge>
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {course.shortDescription || course.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {course.instructor.firstName || ''} {course.instructor.lastName || ''}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {course.category.name}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {course.modulesCount || 0} modules
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {course.lessonsCount || 0} lessons
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/courses/${course.id}`}>
                                Details
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>

                        {course.status === 'UNDER_REVIEW' && (
                            <>
                                <Button
                                    size="sm"
                                    onClick={approveCourse}
                                    disabled={savingId === course.id}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Approve
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={savingId === course.id}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}