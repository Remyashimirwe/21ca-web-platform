'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
    BookOpen,
    Clock,
    Award,
    TrendingUp,
    Calendar,
    Users,
    Star,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DashboardData = {
    userStats: {
        coursesEnrolled: number;
        coursesCompleted: number;
        totalHours: number;
        currentStreak: number;
        certificates: number;
        progressRate: number;
    };
    recentCourses: {
        id: string;
        title: string;
        progress: number;
        nextLesson: string;
        instructor: string;
        image: string;
    }[];
    upcomingEvents: {
        id: string;
        title: string;
        date: string;
        type: string;
    }[];
};

const UserDashboard = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard/user');
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Get current time for greeting
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const userStats = data?.userStats || {
        coursesEnrolled: 0,
        coursesCompleted: 0,
        totalHours: 0,
        currentStreak: 0,
        certificates: 0,
        progressRate: 0
    };

    const recentCourses = data?.recentCourses || [];
    const upcomingEvents = data?.upcomingEvents || [];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-green-100 dark:border-green-800">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                            {getGreeting()}, {user?.firstName || 'Student'}! 👋
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Welcome back to your learning journey. You're doing great!
                        </p>
                    </div>
                    {userStats.currentStreak > 0 && (
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                                Day {userStats.currentStreak}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Learning Streak
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Courses Enrolled
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{userStats.coursesEnrolled}</div>
                        <p className="text-xs text-muted-foreground">
                            Active enrollments
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Learning Hours
                        </CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{userStats.totalHours}h</div>
                        <p className="text-xs text-muted-foreground">
                            Time spent learning
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Certificates
                        </CardTitle>
                        <Award className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{userStats.certificates}</div>
                        <p className="text-xs text-muted-foreground">
                            Completed achievements
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Progress Rate
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{userStats.progressRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            Overall completion
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Continue Learning */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Continue Learning
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentCourses.length > 0 ? (
                                    recentCourses.map((course) => (
                                        <Link
                                            key={course.id}
                                            href={`/my-courses/${course.id}`}
                                            className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-300 group cursor-pointer"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={course.image}
                                                    alt={course.title}
                                                    className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                                                    {course.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {course.nextLesson}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-background rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${course.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-muted-foreground">
                                      {course.progress}%
                                    </span>
                                                </div>
                                            </div>
                                            <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                Continue
                                                <ArrowRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No courses yet. Start your journey today!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Events */}
                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Upcoming Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={cn(
                                                    "w-3 h-3 rounded-full mt-2 flex-shrink-0",
                                                    event.type === 'Live Session' ? "bg-blue-500" : "bg-red-500"
                                                )} />
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-foreground mb-1">
                                                        {event.title}
                                                    </h5>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <span className={cn(
                                                        "text-xs px-2 py-1 rounded-full",
                                                        event.type === 'Live Session' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                    )}>
                                      {event.type}
                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No upcoming events or deadlines.
                                    </div>
                                )}
                            </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/courses">
                            <Button
                                className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                                variant="outline"
                            >
                                <BookOpen className="h-6 w-6 text-primary" />
                                <span>Browse Courses</span>
                            </Button>
                        </Link>
                        <Button
                            className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                            variant="outline"
                        >
                            <Users className="h-6 w-6 text-primary" />
                            <span>Join Community</span>
                        </Button>
                        <Button
                            className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                            variant="outline"
                        >
                            <Star className="h-6 w-6 text-primary" />
                            <span>Rate Courses</span>
                        </Button>
                        <Link href="/certificates">
                            <Button
                                className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                                variant="outline"
                            >
                                <Award className="h-6 w-6 text-primary" />
                                <span>View Certificates</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDashboard;