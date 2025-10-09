'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Eye,
    Trash2,
    Users,
    Star,
    Clock,
    DollarSign,
    TrendingUp,
    Calendar,
    Download,
    Share2,
    Copy,
    BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Course {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    thumbnail: string | null;
    price: number;
    discountPrice: number | null;
    level: string;
    status: string;
    isPublished: boolean;
    enrollmentCount: number;
    averageRating: number | null;
    totalRatings: number;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    category: {
        name: string;
        color: string | null;
    };
    modules: {
        id: string;
        title: string;
        lessons: {
            id: string;
            title: string;
        }[];
    }[];
}

interface CourseStats {
    totalRevenue: number;
    totalStudents: number;
    averageRating: number;
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    underReviewCourses: number;
}

const MyCourses = () => {
    const { user } = useUser();
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [stats, setStats] = useState<CourseStats>({
        totalRevenue: 0,
        totalStudents: 0,
        averageRating: 0,
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        underReviewCourses: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('updatedAt');

    useEffect(() => {
        fetchCourses();
        fetchStats();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/instructor/courses');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/instructor/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus.toUpperCase();
        return matchesSearch && matchesStatus;
    });

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'students':
                return b.enrollmentCount - a.enrollmentCount;
            case 'rating':
                return (Number(b.averageRating) || 0) - (Number(a.averageRating) || 0);
            case 'revenue':
                return (Number(b.price) * b.enrollmentCount) - (Number(a.price) * a.enrollmentCount);
            case 'createdAt':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default:
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
    });

    const getStatusBadge = (status: string, isPublished: boolean) => {
        if (isPublished) {
            return <Badge variant="default" className="bg-green-500">Published</Badge>;
        }
        
        switch (status) {
            case 'DRAFT':
                return <Badge variant="secondary">Draft</Badge>;
            case 'UNDER_REVIEW':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Under Review</Badge>;
            case 'ARCHIVED':
                return <Badge variant="secondary" className="bg-gray-500">Archived</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/courses/${courseId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                setCourses(prev => prev.filter(course => course.id !== courseId));
                fetchStats();
            }
        } catch (error) {
            console.error('Failed to delete course:', error);
        }
    };

    const handleDuplicateCourse = async (courseId: string) => {
        try {
            const response = await fetch(`/api/courses/${courseId}/duplicate`, {
                method: 'POST'
            });
            
            if (response.ok) {
                fetchCourses();
            }
        } catch (error) {
            console.error('Failed to duplicate course:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Courses</h1>
                    <p className="text-muted-foreground">Manage and track your courses</p>
                </div>
                <Button onClick={() => router.push('/instructor/create-course')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +12% this month
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                                <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                                <p className="text-xs text-blue-600 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +8% this week
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                                <p className="text-2xl font-bold">
                                    {stats.averageRating ? Number(stats.averageRating).toFixed(1) : '0.0'}
                                </p>
                                <p className="text-xs text-yellow-600 flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {stats.totalCourses} courses rated
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <Star className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Published Courses</p>
                                <p className="text-2xl font-bold">{stats.publishedCourses}</p>
                                <p className="text-xs text-muted-foreground">
                                    {stats.draftCourses} drafts, {stats.underReviewCourses} pending
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-1 gap-4 items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 border border-input rounded-md bg-background"
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="under_review">Under Review</option>
                                <option value="archived">Archived</option>
                            </select>
                            
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-input rounded-md bg-background"
                            >
                                <option value="updatedAt">Last Updated</option>
                                <option value="createdAt">Date Created</option>
                                <option value="title">Title (A-Z)</option>
                                <option value="students">Students</option>
                                <option value="rating">Rating</option>
                                <option value="revenue">Revenue</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{sortedCourses.length} courses</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Course Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-48 bg-muted rounded-t-lg" />
                            <CardContent className="p-4 space-y-4">
                                <div className="h-4 bg-muted rounded" />
                                <div className="h-3 bg-muted rounded w-3/4" />
                                <div className="flex justify-between">
                                    <div className="h-6 bg-muted rounded w-16" />
                                    <div className="h-6 bg-muted rounded w-20" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : sortedCourses.length === 0 ? (
                <Card className="p-12 text-center">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                    <p className="text-muted-foreground mb-6">
                        {searchQuery || selectedStatus !== 'all' 
                            ? "Try adjusting your search or filters"
                            : "Start creating your first course to share your knowledge with the world"
                        }
                    </p>
                    {!searchQuery && selectedStatus === 'all' && (
                        <Button onClick={() => router.push('/instructor/create-course')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Course
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCourses.map((course) => (
                        <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="relative">
                                {course.thumbnail ? (
                                    <img 
                                        src={course.thumbnail} 
                                        alt={course.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                        <BookOpen className="h-16 w-16 text-primary/40" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    {getStatusBadge(course.status, course.isPublished)}
                                </div>
                                <div className="absolute top-3 right-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem 
                                                onClick={() => router.push(`/instructor/courses/${course.id}/edit`)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Course
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => router.push(`/courses/${course.slug}`)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Preview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => router.push(`/instructor/courses/${course.id}/analytics`)}
                                            >
                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                Analytics
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDuplicateCourse(course.id)}>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Share
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Download className="h-4 w-4 mr-2" />
                                                Export Data
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                                onClick={() => handleDeleteCourse(course.id)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                            {course.shortDescription}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {course.category.name}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs capitalize">
                                            {course.level.toLowerCase()}
                                        </Badge>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                                <Users className="h-3 w-3" />
                                                <span>{course.enrollmentCount}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">Students</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                                <Star className="h-3 w-3" />
                                                <span>
                                                    {course.averageRating 
                                                        ? Number(course.averageRating).toFixed(1) 
                                                        : 'N/A'
                                                    }
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">Rating</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                                <DollarSign className="h-3 w-3" />
                                                <span>{course.price}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">Price</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>Updated {formatDate(course.updatedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 pt-2">
                                        <Button 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => router.push(`/instructor/courses/${course.id}/edit`)}
                                        >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => router.push(`/instructor/courses/${course.id}/analytics`)}
                                        >
                                            <BarChart3 className="h-3 w-3 mr-1" />
                                            Stats
                                        </Button>
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

export default MyCourses;