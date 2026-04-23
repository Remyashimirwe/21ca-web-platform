'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
    Activity,
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
    Loader2,
    Database,
    Zap,
    Shield,
    Server,
    ExternalLink,
    LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
        { title: 'User Management', icon: Users, description: 'Manage accounts & roles', href: '/admin/users' },
        { title: 'Course Review', icon: BookOpen, description: 'Approve pending content', href: '/admin/courses/review' },
        { title: 'System Health', icon: Activity, description: 'Monitor server & database', href: '/admin/system' },
        { title: 'Payments', icon: DollarSign, description: 'View all transactions', href: '/admin/payments' },
        { title: 'Reports', icon: BarChart3, description: 'Deep dive analytics', href: '/admin/reports' },
        { title: 'Support Center', icon: AlertCircle, description: 'Open support tickets', href: '/support' }
    ];

    const systemStats = [
        { label: 'Server Status', value: 'Operational', icon: Server, color: 'text-emerald-500' },
        { label: 'Database', value: 'Healthy', icon: Database, color: 'text-blue-500' },
        { label: 'Latency', value: '42ms', icon: Zap, color: 'text-amber-500' },
        { label: 'Security', value: 'Protected', icon: Shield, color: 'text-purple-500' },
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
                {/* Header & System Status */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <Shield className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Command Center</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                            {getGreeting()}, {user?.firstName || 'Admin'}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Real-time platform oversight and management.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-2">
                        {systemStats.map((stat) => (
                            <div key={stat.label} className="flex flex-col rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-all hover:border-primary/30">
                                <div className="flex items-center gap-2 mb-1">
                                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{stat.label}</span>
                                </div>
                                <span className="text-sm font-semibold">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Dashboard Section */}
                <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                    {/* Insights Panel */}
                    <Card className="xl:col-span-1 bg-primary text-primary-foreground overflow-hidden relative border-none">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <LayoutDashboard className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg">Platform Health</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {insights.map((item) => (
                                <div key={item.label} className="flex items-center justify-between border-b border-primary-foreground/10 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-white/10 p-2">
                                            <item.icon className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-sm font-medium opacity-90">{item.label}</span>
                                    </div>
                                    <span className="text-lg font-bold">{item.value}</span>
                                </div>
                            ))}
                            <Button variant="secondary" className="w-full mt-4 font-bold" asChild>
                                <Link href="/admin/reports">
                                    Full Analytics Report
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Stats Grid */}
                    <div className="xl:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() || '0'}</div>
                                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                    <ArrowUp className="h-3 w-3" /> {stats?.growthRate}% growth
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Active Today</CardTitle>
                                <UserCheck className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.activeUsers?.toLocaleString() || '0'}</div>
                                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                    <Zap className="h-3 w-3" /> +{stats?.newUsersToday} new registrations
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${stats?.totalRevenue?.toLocaleString() || '0'}</div>
                                <p className="text-xs text-amber-600 mt-1">Target: $10,000</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                                <BookOpen className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalCourses || '0'}</div>
                                <p className="text-xs text-purple-600 mt-1">12 pending review</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-sky-500 hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Completions</CardTitle>
                                <Award className="h-4 w-4 text-sky-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.courseCompletions || '0'}</div>
                                <p className="text-xs text-sky-600 mt-1">Across all tracks</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-rose-500 hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Support Rate</CardTitle>
                                <MessageSquare className="h-4 w-4 text-rose-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.supportTickets || '0'}</div>
                                <p className="text-xs text-rose-600 mt-1">98% resolution rate</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Quick Actions Control Panel */}
                <Card className="border-none bg-muted/30">
                    <CardHeader className="pb-3 border-b border-border/50 mb-4 bg-muted/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-amber-500" />
                                    Quick Controls
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">Common administrative actions and navigation</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                            {quickActions.map((action, index) => (
                                <Link 
                                    key={index}
                                    href={action.href}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-background hover:bg-muted transition-all text-center group"
                                >
                                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <action.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-bold">{action.title}</span>
                                    <span className="text-[10px] text-muted-foreground line-clamp-1">{action.description}</span>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Bottom Row - Activity & Top Performing */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Activity Feed */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Platform Event Feed
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs">
                                View Logs <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activity.length === 0 ? (
                                    <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                                        No recent events recorded.
                                    </div>
                                ) : activity.map((act, index) => {
                                    const Icon = getActivityIcon(act.type);
                                    return (
                                        <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                            <div className={cn("mt-1 p-2 rounded-md bg-background border border-border shadow-sm", getActivityColor(act.type))}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm font-semibold">{act.message}</p>
                                                    <span className="text-[10px] font-medium text-muted-foreground">{act.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-[10px] h-4">System</Badge>
                                                    <span className="text-[10px] text-muted-foreground">Action completed successfully</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Performing Courses */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Top Learning Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topCourses.length === 0 ? (
                                    <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                                        No performance data yet.
                                    </div>
                                ) : topCourses.map((course, index) => (
                                    <div key={index} className="p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-sm line-clamp-1">{course.title}</h4>
                                            <div className={cn(
                                                "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                                course.trend === 'up' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                            )}>
                                                {course.trend === 'up' ? <ArrowUp className="h-2 w-2 mr-1" /> : <ArrowDown className="h-2 w-2 mr-1" />}
                                                {course.enrollments} Enrolled
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-muted-foreground">Completion Rate</span>
                                                    <span className="font-bold">{course.completion}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${course.completion}%` }} />
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <span className="text-[10px] text-muted-foreground block">Rating</span>
                                                <div className="flex justify-end text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className="text-[10px]">{i < Math.floor(course.rating) ? '★' : '☆'}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full h-8 text-xs font-bold" asChild>
                                            <Link href={`/admin/courses/${course.id || ''}`}>Manage Course</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;