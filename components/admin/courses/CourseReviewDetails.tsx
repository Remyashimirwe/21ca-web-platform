'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    CheckCircle2,
    XCircle,
    ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type CourseDetail = {
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
    modules: Array<{
        id: string;
        title: string;
        description: string | null;
        lessons: Array<{
            id: string;
            title: string;
            type: string;
            isFree: boolean;
        }>;
    }>;
};

export default function CourseReviewDetails({
    course,
    onApproved,
}: {
    course: CourseDetail;
    onApproved?: () => void;
}) {
    const [saving, setSaving] = useState(false);
    const [reason, setReason] = useState('');

    const approveCourse = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/courses/${course.id}/approve`, {
                method: 'POST',
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || data.details || 'Failed to approve course');

            onApproved?.();
            alert('Course approved successfully');
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Failed to approve course');
        } finally {
            setSaving(false);
        }
    };

    const rejectCourse = async () => {
        if (!reason.trim()) {
            alert('Please enter a rejection reason');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/courses/${course.id}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || data.details || 'Failed to reject course');

            onApproved?.();
            alert('Course rejected successfully');
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Failed to reject course');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <Button variant="outline" asChild>
                    <Link href="/admin/courses">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Courses
                    </Link>
                </Button>

                <div className="flex gap-2">
                    <Button variant="destructive" onClick={rejectCourse} disabled={saving}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                    </Button>
                    <Button onClick={approveCourse} disabled={saving}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="text-2xl">{course.title}</CardTitle>
                        <Badge variant={course.status === 'UNDER_REVIEW' ? 'secondary' : 'default'}>
                            {course.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">{course.shortDescription}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Instructor</p>
                            <p className="mt-1 font-medium">
                                {course.instructor.firstName || ''} {course.instructor.lastName || ''}
                            </p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="mt-1 font-medium">{course.category.name}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Modules</p>
                            <p className="mt-1 font-medium">{course.modules.length}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Lessons</p>
                            <p className="mt-1 font-medium">
                                {course.modules.reduce((total, module) => total + module.lessons.length, 0)}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Course Description</h3>
                        <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                            {course.description}
                        </p>
                    </div>

                    {course.status === 'UNDER_REVIEW' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reject reason</label>
                            <textarea
                                className="w-full min-h-24 rounded-md border border-input bg-background p-3 text-sm outline-none"
                                placeholder="Write a rejection reason..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <h3 className="mb-3 text-lg font-semibold">Modules</h3>
                        <div className="space-y-3">
                            {course.modules.map((module, index) => (
                                <div key={module.id} className="rounded-xl border p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">
                                                Module {index + 1}: {module.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {module.description || 'No description'}
                                            </p>
                                        </div>
                                        <Badge variant="outline">
                                            {module.lessons.length} lessons
                                        </Badge>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        {module.lessons.map((lesson) => (
                                            <div key={lesson.id} className="rounded-lg border bg-muted/20 p-3 text-sm">
                                                <div className="font-medium">{lesson.title}</div>
                                                <div className="text-muted-foreground">
                                                    Type: {lesson.type} {lesson.isFree ? '(Free)' : ''}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}