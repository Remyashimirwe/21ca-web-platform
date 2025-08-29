'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import {
    Users,
    BookOpen,
    TrendingUp,
    DollarSign,
    Eye,
    UserCheck,
    Clock,
    Award,
    AlertCircle,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
    const { user } = useUser();

    // Get current time for greeting
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Mock admin data - you can replace with real data later
    const adminStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalCourses: 24,
        totalRevenue: 45670,
        newUsersToday: 23,
        courseCompletions: 156,
        supportTickets: 8,
        conversionRate: 12.5
    };

    const recentActivity = [
        {
            type: 'user_registration',
            message: '5 new users registered',
            time: '10 minutes ago',
            icon: Users,
            color: 'text-green-500'
        },
        {
            type: 'course_completion',
            message: 'STEM Foundations course completed by Marie Claire',
            time: '1 hour ago',
            icon: Award,
            color: 'text-yellow-500'
        },
        {
            type: 'support_ticket',
            message: 'New support ticket submitted',
            time: '2 hours ago',
            icon: AlertCircle,
            color: 'text-orange-500'
        },
        {
            type: 'course_enrollment',
            message: '12 new course enrollments today',
            time: '4 hours ago',
            icon: BookOpen,
            color: 'text-blue-500'
        }
    ];

    const topCourses = [
        {
            title: "STEM Foundations for Young Innovators",
            enrollments: 234,
            completion: 78,
            rating: 4.9,
            trend: 'up'
        },
        {
            title: "Digital Financial Literacy Essentials",
            enrollments: 189,
            completion: 85,
            rating: 4.8,
            trend: 'up'
        },
        {
            title: "Green Entrepreneurship Bootcamp",
            enrollments: 167,
            completion: 65,
            rating: 4.9,
            trend: 'down'
        }
    ];

    const quickActions = [
        { title: 'View All Users', icon: Users, action: 'users' },
        { title: 'Manage Courses', icon: BookOpen, action: 'courses' },
        { title: 'Revenue Reports', icon: DollarSign, action: 'reports' },
        { title: 'Support Center', icon: AlertCircle, action: 'support' }
    ];

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                                    {getGreeting()}, {user?.firstName || 'Admin'}!
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Welcome to your admin dashboard. Here's what's happening today.
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                    {adminStats.newUsersToday}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    New Users Today
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{adminStats.totalUsers.toLocaleString()}</div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                <ArrowUp className="h-3 w-3" />
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active Users
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{adminStats.activeUsers.toLocaleString()}</div>
                            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                <ArrowUp className="h-3 w-3" />
                                +8% this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Courses
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{adminStats.totalCourses}</div>
                            <p className="text-xs text-purple-600 dark:text-purple-400">
                                4 categories available
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
                            <div className="text-2xl font-bold text-foreground">${adminStats.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                                <ArrowUp className="h-3 w-3" />
                                +23% from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300"
                                        >
                                            <div className={`p-2 rounded-full bg-background ${activity.color}`}>
                                                <activity.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-foreground">
                                                    {activity.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.time}
                                                </p>
                                            </div>
                                            <Button size="sm" variant="ghost">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Performing Courses */}
                    <div>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    Top Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topCourses.map((course, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h5 className="font-medium text-foreground text-sm line-clamp-2">
                                                    {course.title}
                                                </h5>
                                                <div className={`p-1 rounded ${course.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {course.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>{course.enrollments} enrolled</span>
                                                    <span>{course.completion}% completion</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-background rounded-full h-1.5">
                                                        <div
                                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full"
                                                            style={{ width: `${course.completion}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-yellow-500">
                            {course.rating}★
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 mb-8">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Course Completions
                            </CardTitle>
                            <Clock className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{adminStats.courseCompletions}</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Support Tickets
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{adminStats.supportTickets}</div>
                            <p className="text-xs text-orange-600 dark:text-orange-400">2 urgent</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Conversion Rate
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{adminStats.conversionRate}%</div>
                            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                <ArrowUp className="h-3 w-3" />
                                +2.1% this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Avg. Session Time
                            </CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">24m</div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">+3m from last week</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                                    variant="outline"
                                >
                                    <action.icon className="h-6 w-6 text-primary" />
                                    <span>{action.title}</span>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;