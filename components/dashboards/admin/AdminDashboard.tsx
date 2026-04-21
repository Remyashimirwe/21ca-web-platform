'use client';

import React, { useState, useEffect } from 'react';
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
    ArrowDown,
    Sparkles,
    BarChart3,
    ShieldCheck,
    MessageSquare,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AdminDashboard = () => {
    const { user } = useUser();
    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);
    const [topCourses, setTopCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                const [statsRes, activityRes, coursesRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/admin/activity'),
                    fetch('/api/admin/top-courses')
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (activityRes.ok) setActivity(await activityRes.json());
                if (coursesRes.ok) setTopCourses(await coursesRes.json());
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    // Get current time for greeting
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const insights = [
        { label: 'Growth', value: stats ? `+${stats.growthRate}%` : '...', icon: ArrowUp, tone: 'text-emerald-500' },
        { label: 'Engagement', value: stats ? `${stats.engagement}%` : '...', icon: Sparkles, tone: 'text-violet-500' },
        { label: 'Retention', value: stats ? `${stats.retention}%` : '...', icon: ShieldCheck, tone: 'text-sky-500' },
        { label: 'Messages', value: stats ? stats.messages : '...', icon: MessageSquare, tone: 'text-amber-500' }
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user_registration': return Users;
            case 'course_completion': return Award;
            case 'course_enrollment': return BookOpen;
            default: return AlertCircle;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'user_registration': return 'text-green-500';
            case 'course_completion': return 'text-yellow-500';
            case 'course_enrollment': return 'text-blue-500';
            default: return 'text-orange-500';
        }
    };

    const quickActions = [
        { title: 'View All Users', icon: Users, action: 'users', href: '/admin/users' },
        { title: 'Review Courses', icon: BookOpen, action: 'review-courses', href: '/admin/courses/review' },
        { title: 'Manage Courses', icon: BookOpen, action: 'courses', href: '/admin/courses' },
        { title: 'Revenue Reports', icon: DollarSign, action: 'reports', href: '/admin/dashboard' },
        { title: 'Support Center', icon: AlertCircle, action: 'support', href: '/support' }
    ];

    if (loading && !stats) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center pt-20">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Hero Section */}
                <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8 shadow-sm dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_30%)]" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                                <Sparkles className="h-4 w-4" />
                                Admin Command Center
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                {getGreeting()}, {user?.firstName || 'Admin'}!
                            </h1>
                            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                                Welcome to your enhanced dashboard. Track performance, manage users, and keep your platform running smoothly.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[460px]">
                            {insights.map((item) => (
                                <div key={item.label} className="rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur">
                                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${item.tone}`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                    <p className="mt-1 text-lg font-semibold text-foreground">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Primary Metrics */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                            <div>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                                <div className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                    {stats?.totalUsers?.toLocaleString() || '0'}
                                </div>
                            </div>
                            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <ArrowUp className="h-3 w-3" />
                                {stats?.growthRate}% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                            <div>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                                <div className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                    {stats?.activeUsers?.toLocaleString() || '0'}
                                </div>
                            </div>
                            <div className="rounded-xl bg-green-500/10 p-3 text-green-500">
                                <UserCheck className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <ArrowUp className="h-3 w-3" />
                                +{stats?.newUsersToday} today
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                            <div>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                                <div className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                    {stats?.totalCourses || '0'}
                                </div>
                            </div>
                            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
                                <BookOpen className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-purple-600 dark:text-purple-400">All categories</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                            <div>
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                                <div className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                    ${stats?.totalRevenue?.toLocaleString() || '0'}
                                </div>
                            </div>
                            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                <ArrowUp className="h-3 w-3" />
                                {stats?.conversionRate}% conversion rate
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Main Content */}
                <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                    {/* Recent Activity */}
                    <Card className="xl:col-span-2 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Recent Activity
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Latest updates across your platform
                                </p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-full">
                                View all
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activity.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-10">No recent activity</p>
                                ) : activity.map((act, index) => {
                                    const Icon = getActivityIcon(act.type);
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4 transition-all duration-300 hover:bg-muted/40"
                                        >
                                            <div className={`rounded-xl bg-background p-3 ${getActivityColor(act.type)}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-foreground">
                                                    {act.message}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {act.time}
                                                </p>
                                            </div>
                                            <Button size="icon" variant="ghost" className="shrink-0 rounded-full">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Courses */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Award className="h-5 w-5 text-primary" />
                                Top Courses
                            </CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Best performing learning content
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topCourses.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-10">No data available</p>
                                ) : topCourses.map((course, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-border/60 bg-muted/20 p-4 transition-all duration-300 hover:bg-muted/40"
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <h5 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
                                                {course.title}
                                            </h5>
                                            <div className={`rounded-full p-1.5 ${course.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                                {course.trend === 'up' ? (
                                                    <ArrowUp className="h-3.5 w-3.5" />
                                                ) : (
                                                    <ArrowDown className="h-3.5 w-3.5" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{course.enrollments} enrolled</span>
                                                <span>{course.completion}% completion</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                                                    <div
                                                        className="h-2 rounded-full bg-blue-500"
                                                        style={{ width: `${course.completion}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-yellow-500">
                                                    {course.rating}★
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Secondary Metrics */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Course Completions
                            </CardTitle>
                            <Clock className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats?.courseCompletions || '0'}</div>
                            <p className="text-xs text-muted-foreground">Total to date</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Support Tickets
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats?.supportTickets || '0'}</div>
                            <p className="text-xs text-orange-600 dark:text-orange-400">All resolved</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Conversion Rate
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats?.conversionRate || '0'}%</div>
                            <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <ArrowUp className="h-3 w-3" />
                                Healthy benchmark
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
                </section>

                {/* Quick Actions */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Quick Actions</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Jump into the most common admin tasks
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    asChild
                                    className="h-auto justify-start gap-3 rounded-2xl border border-border/60 bg-background p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                    variant="outline"
                                >
                                    <Link href={action.href}>
                                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <action.icon className="h-5 w-5" />
                                        </span>
                                        <span className="flex flex-col items-start">
                                            <span className="text-sm font-semibold">{action.title}</span>
                                            <span className="text-xs text-muted-foreground">Open section</span>
                                        </span>
                                    </Link>
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