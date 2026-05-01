// components/admin/CourseReviewPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    BookOpen,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Calendar,
    Filter,
    Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface PendingCourse {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    thumbnail: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    instructor: {
        firstName: string;
        lastName: string;
        email: string;
        imageUrl: string | null;
    };
    category: {
        name: string;
        color: string | null;
    };
    modules: {
        lessons: any[];
    }[];
}

const CourseReviewPage = () => {
    const router = useRouter();
    const [courses, setCourses] = useState<PendingCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('UNDER_REVIEW');

    useEffect(() => {
        fetchPendingCourses();
    }, [filterStatus]);

    const fetchPendingCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/courses/pending?status=${filterStatus}`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch pending courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (courseId: string) => {
        if (!confirm('Are you sure you want to approve and publish this course?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/courses/${courseId}/approve`, {
                method: 'POST'
            });

            if (response.ok) {
                alert('Course approved and published successfully!');
                fetchPendingCourses();
            } else {
                alert('Failed to approve course');
            }
        } catch (error) {
            console.error('Failed to approve course:', error);
        }
    };

    const handleReject = async (courseId: string) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await fetch(`/api/admin/courses/${courseId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason })
            });

            if (response.ok) {
                alert('Course rejected successfully!');
                fetchPendingCourses();
            } else {
                alert('Failed to reject course');
            }
        } catch (error) {
            console.error('Failed to reject course:', error);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Course Review</h1>
                <p className="text-muted-foreground">Review and approve courses submitted by instructors</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Review</p>
                                <p className="text-2xl font-bold">{courses.filter(c => c.status === 'UNDER_REVIEW').length}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Approved Today</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Rejected</p>
                                <p className="text-2xl font-bold">0</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses or instructors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-input rounded-md bg-background"
                        >
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Courses List */}
            {loading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-20 bg-muted rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <Card className="p-12 text-center">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses to review</h3>
                    <p className="text-muted-foreground">
                        All caught up! Check back later for new submissions.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="font-semibold text-lg">{course.title}</h3>
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                                    {course.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {course.shortDescription}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={course.instructor.imageUrl || ''} />
                                                    <AvatarFallback>
                                                        {course.instructor.firstName.charAt(0)}
                                                        {course.instructor.lastName.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-muted-foreground">
                                                    {course.instructor.firstName} {course.instructor.lastName}
                                                </span>
                                            </div>
                                            <Badge variant="outline">{course.category.name}</Badge>
                                            <span className="text-muted-foreground">
                                                {course.modules.length} modules •{' '}
                                                {course.modules.reduce((total, m) => total + m.lessons.length, 0)} lessons
                                            </span>
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Submitted {formatDate(course.createdAt)}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push(`/courses/${course.slug}`)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Preview
                                            </Button>
                                            {course.status === 'UNDER_REVIEW' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApprove(course.id)}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleReject(course.id)}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseReviewPage;