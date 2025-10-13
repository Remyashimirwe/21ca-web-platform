// components/dashboards/instructor/InstructorDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
    BookOpen,
    Users,
    TrendingUp,
    Star,
    MessageSquare,
    Clock,
    Award,
    Upload,
    Edit,
    Eye,
    BarChart3,
    Calendar,
    DollarSign,
    ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InstructorDashboard = () => {
    const { user } = useUser();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch stats
            const statsRes = await fetch('/api/instructor/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            // Fetch courses
            const coursesRes = await fetch('/api/instructor/courses');
            const coursesData = await coursesRes.json();
            setCourses(Array.isArray(coursesData) ? coursesData.slice(0, 3) : []);

            // Fetch recent activity
            const activityRes = await fetch('/api/instructor/activity');
            const activityData = await activityRes.json();
            setRecentActivity(Array.isArray(activityData) ? activityData : []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'enrollment': return Users;
            case 'review': return Star;
            case 'completion': return Award;
            case 'message': return MessageSquare;
            default: return BookOpen;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'enrollment': return 'text-purple-500';
            case 'review': return 'text-yellow-500';
            case 'completion': return 'text-green-500';
            case 'message': return 'text-blue-500';
            default: return 'text-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 md:p-8 border border-purple-100 dark:border-purple-800">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                            {getGreeting()}, {user?.firstName || 'Instructor'}!
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground">
                            Ready to inspire minds and shape the future? Your students are waiting!
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                            {stats?.newThisWeek || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            New This Week
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Students
                        </CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {stats?.totalStudents || 0}
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                            Across all courses
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Course Rating
                        </CardTitle>
                        <Star className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {stats?.averageRating ? Number(stats.averageRating).toFixed(1) : '0.0'}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400">
                            Average rating
                        </p>
                    </CardContent>
                </Card>

                <Card 
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500 cursor-pointer"
                    onClick={() => router.push('/instructor/analytics')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Analytics
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {stats?.publishedCourses || 0}
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            View detailed analytics
                            <ArrowUpRight className="h-3 w-3" />
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            ${stats?.totalRevenue?.toLocaleString() || '0'}
                        </div>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            This month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* My Courses */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                My Courses
                            </CardTitle>
                            <Button 
                                size="sm" 
                                className="gap-2"
                                onClick={() => router.push('/instructor/create-course')}
                            >
                                <Upload className="h-4 w-4" />
                                Create Course
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {courses.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground mb-4">No courses yet</p>
                                    <Button onClick={() => router.push('/instructor/create-course')}>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Create Your First Course
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-300 group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                                            {course.title}
                                                        </h4>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            course.isPublished
                                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                        }`}>
                                                            {course.isPublished ? 'Published' : course.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Last updated: {new Date(course.updatedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => router.push(`/instructor/courses/${course.id}/edit`)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => router.push(`/courses/${course.slug}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <div className="text-foreground font-medium">
                                                        {course.enrollmentCount}
                                                    </div>
                                                    <div className="text-muted-foreground">Students</div>
                                                </div>
                                                <div>
                                                    <div className="text-foreground font-medium">
                                                        {course.averageRating ? Number(course.averageRating).toFixed(1) : 'N/A'}
                                                    </div>
                                                    <div className="text-muted-foreground">Rating</div>
                                                </div>
                                                <div>
                                                    <div className="text-foreground font-medium">
                                                        ${Number(course.price)}
                                                    </div>
                                                    <div className="text-muted-foreground">Price</div>
                                                </div>
                                                <div>
                                                    <div className="text-foreground font-medium">
                                                        {course.modules?.length || 0}
                                                    </div>
                                                    <div className="text-muted-foreground">Modules</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => router.push('/instructor/courses')}
                                    >
                                        View All Courses
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6 md:space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                    No recent activity
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => {
                                        const Icon = getActivityIcon(activity.type);
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                                            >
                                                <div className={`p-2 rounded-full bg-background ${getActivityColor(activity.type)}`}>
                                                    <Icon className="h-3 w-3" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {activity.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:shadow-lg transition-all duration-300"
                        onClick={() => router.push('/calendar')}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Calendar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Manage your schedule and upcoming events
                            </p>
                            <Button variant="outline" className="w-full">
                                View Calendar
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                            className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                            variant="outline"
                            onClick={() => router.push('/instructor/create-course')}
                        >
                            <Upload className="h-6 w-6 text-primary" />
                            <span>Upload Content</span>
                        </Button>
                        <Button
                            className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                            variant="outline"
                            onClick={() => router.push('/messages')}
                        >
                            <MessageSquare className="h-6 w-6 text-primary" />
                            <span>Answer Questions</span>
                        </Button>
                        <Button
                            className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                            variant="outline"
                            onClick={() => router.push('/instructor/analytics')}
                        >
                            <BarChart3 className="h-6 w-6 text-primary" />
                            <span>View Analytics</span>
                        </Button>
                        <Button
                            className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                            variant="outline"
                            onClick={() => router.push('/calendar')}
                        >
                            <Calendar className="h-6 w-6 text-primary" />
                            <span>Manage Schedule</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InstructorDashboard;