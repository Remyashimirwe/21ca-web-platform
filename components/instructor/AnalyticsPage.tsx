'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp,
    Users,
    DollarSign,
    BookOpen,
    Star,
    ArrowUp,
    ArrowDown,
    Download,
    BarChart3,
    Clock,
    Activity,
    Target,
    PieChart as PieChartIcon,
    Sparkles,
    LineChart as LineChartIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

interface AnalyticsData {
    overview: {
        totalRevenue: number;
        revenueChange: number;
        totalStudents: number;
        studentsChange: number;
        averageRating: number;
        ratingChange: number;
        completionRate: number;
        completionChange: number;
    };
    coursesPerformance: {
        courseId: string;
        title: string;
        enrollments: number;
        revenue: number;
        averageProgress: number;
        completionRate: number;
        rating: number;
        lessonCompletions?: number;
        watchTimeHours?: number;
    }[];
    monthlyData: {
        month: string;
        revenue: number;
        enrollments: number;
        completions: number;
    }[];
    studentEngagement: {
        date: string;
        activeStudents: number;
        lessonCompletions: number;
        quizAttempts: number;
    }[];
    statusBreakdown?: {
        DRAFT: number;
        UNDER_REVIEW: number;
        PUBLISHED: number;
        ARCHIVED: number;
    };
}

type TooltipItem = {
    name?: string;
    value?: number | string;
    color?: string;
};

type CustomTooltipProps = {
    active?: boolean;
    payload?: TooltipItem[];
    label?: string | number;
    formatter?: (value: number, name?: string) => string;
    labelFormatter?: (label: string) => string;
};

const COLORS = {
    emerald: '#10b981',
    blue: '#3b82f6',
    amber: '#f59e0b',
    violet: '#8b5cf6',
    rose: '#f43f5e',
    teal: '#14b8a6',
    slate: '#64748b'
};

const PIE_COLORS = ['#94a3b8', '#f59e0b', '#10b981', '#64748b'];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount || 0);
}

function AnimatedTooltip({
                             active,
                             payload,
                             label,
                             formatter,
                             labelFormatter
                         }: CustomTooltipProps) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="rounded-2xl border border-border bg-popover/95 px-4 py-3 shadow-xl backdrop-blur-md">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
                {labelFormatter ? labelFormatter(String(label)) : String(label)}
            </p>
            <div className="space-y-1.5">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: String(entry.color || 'currentColor') }}
                            />
                            <span className="text-sm text-popover-foreground">
                                {entry.name}
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-popover-foreground">
                            {formatter ? formatter(Number(entry.value), String(entry.name)) : String(entry.value)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('30d');

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/instructor/analytics?timeframe=${timeframe}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to fetch analytics');
            }

            setAnalytics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            setAnalytics(null);
        } finally {
            setLoading(false);
        }
    };

    const getChangeIndicator = (change: number) => {
        const isPositive = change >= 0;
        return (
            <span className={cn(
                'flex items-center gap-1 text-xs font-medium',
                isPositive ? 'text-emerald-600' : 'text-rose-600'
            )}>
                {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(change || 0).toFixed(1)}%
            </span>
        );
    };

    const chartData = useMemo(() => analytics?.monthlyData ?? [], [analytics]);
    const engagementData = useMemo(() => analytics?.studentEngagement ?? [], [analytics]);

    const topCourses = useMemo(() => {
        return [...(analytics?.coursesPerformance ?? [])]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 6);
    }, [analytics]);

    const statusData = useMemo(() => {
        if (!analytics) return [];

        const breakdown = analytics.statusBreakdown ?? {
            DRAFT: 0,
            UNDER_REVIEW: 0,
            PUBLISHED: 0,
            ARCHIVED: 0
        };

        return [
            { name: 'Draft', value: breakdown.DRAFT },
            { name: 'Review', value: breakdown.UNDER_REVIEW },
            { name: 'Published', value: breakdown.PUBLISHED },
            { name: 'Archived', value: breakdown.ARCHIVED }
        ];
    }, [analytics]);

    if (loading || !analytics) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-9 w-56 rounded bg-muted" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="h-24 rounded-xl bg-muted" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/20 p-5 shadow-sm sm:p-6 lg:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_28%)]" />
                <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
                            <Sparkles className="h-3.5 w-3.5" />
                            Live analytics dashboard
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Analytics
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                Monitor revenue, course performance, and student engagement in real time.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>

                        <Button variant="outline" className="rounded-xl">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="overflow-hidden border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-emerald-900/50 dark:from-emerald-950/35 dark:to-background">
                    <CardContent className="p-5 sm:p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/40">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{formatCurrency(analytics.overview.totalRevenue)}</p>
                        <div className="mt-2">{getChangeIndicator(analytics.overview.revenueChange)}</div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-blue-200/60 bg-gradient-to-br from-blue-50 to-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-blue-900/50 dark:from-blue-950/35 dark:to-background">
                    <CardContent className="p-5 sm:p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Total Students</p>
                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/40">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{analytics.overview.totalStudents.toLocaleString()}</p>
                        <div className="mt-2">{getChangeIndicator(analytics.overview.studentsChange)}</div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-amber-200/60 bg-gradient-to-br from-amber-50 to-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-amber-900/50 dark:from-amber-950/35 dark:to-background">
                    <CardContent className="p-5 sm:p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/40">
                                <Star className="h-4 w-4 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{analytics.overview.averageRating.toFixed(1)}</p>
                        <div className="mt-2">{getChangeIndicator(analytics.overview.ratingChange)}</div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-violet-200/60 bg-gradient-to-br from-violet-50 to-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-violet-900/50 dark:from-violet-950/35 dark:to-background">
                    <CardContent className="p-5 sm:p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Completion Rate</p>
                            <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/40">
                                <TrendingUp className="h-4 w-4 text-violet-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{analytics.overview.completionRate}%</p>
                        <div className="mt-2">{getChangeIndicator(analytics.overview.completionChange)}</div>
                    </CardContent>
                </Card>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="flex items-center gap-2">
                            <LineChartIcon className="h-5 w-5 text-emerald-600" />
                            Revenue Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="hsl(var(--muted-foreground))"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '4 4' }}
                                        content={<AnimatedTooltip formatter={(value) => formatCurrency(value)} />}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke={COLORS.emerald}
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                        activeDot={{ r: 7, strokeWidth: 0 }}
                                        animationDuration={1200}
                                        animationEasing="ease-out"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-blue-600" />
                            Course Status Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={112}
                                        innerRadius={72}
                                        paddingAngle={3}
                                        animationDuration={1000}
                                        animationEasing="ease-out"
                                    >
                                        {statusData.map((_, index) => (
                                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<AnimatedTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        wrapperStyle={{ paddingTop: '16px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-violet-600" />
                            Student Engagement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={engagementData}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="hsl(var(--muted-foreground))"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) =>
                                            new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                        }
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        content={
                                            <AnimatedTooltip
                                                labelFormatter={(label) =>
                                                    new Date(label).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })
                                                }
                                            />
                                        }
                                    />
                                    <defs>
                                        <linearGradient id="activeStudentsFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.35} />
                                            <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.02} />
                                        </linearGradient>
                                        <linearGradient id="lessonCompletionsFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.35} />
                                            <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="activeStudents"
                                        stroke={COLORS.blue}
                                        fill="url(#activeStudentsFill)"
                                        strokeWidth={2.5}
                                        animationDuration={1200}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="lessonCompletions"
                                        stroke={COLORS.emerald}
                                        fill="url(#lessonCompletionsFill)"
                                        strokeWidth={2.5}
                                        animationDuration={1200}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-sm">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-amber-600" />
                            Enrollments vs Completions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="hsl(var(--muted-foreground))"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                                        content={<AnimatedTooltip />}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        wrapperStyle={{ paddingTop: '16px' }}
                                    />
                                    <Bar
                                        dataKey="enrollments"
                                        fill={COLORS.blue}
                                        radius={[8, 8, 0, 0]}
                                        animationDuration={1000}
                                    />
                                    <Bar
                                        dataKey="completions"
                                        fill={COLORS.violet}
                                        radius={[8, 8, 0, 0]}
                                        animationDuration={1000}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <Card className="overflow-hidden shadow-sm">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-emerald-600" />
                        Top Performing Courses
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="h-[28rem] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topCourses}
                                layout="vertical"
                                margin={{ left: 20, right: 20 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    stroke="hsl(var(--border))"
                                    horizontal={false}
                                />
                                <XAxis
                                    type="number"
                                    stroke="hsl(var(--muted-foreground))"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="title"
                                    width={180}
                                    stroke="hsl(var(--muted-foreground))"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }}
                                    content={<AnimatedTooltip formatter={(value) => formatCurrency(value)} />}
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill={COLORS.emerald}
                                    radius={[0, 10, 10, 0]}
                                    animationDuration={1200}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Daily Engagement Snapshot
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="grid gap-4">
                        {analytics.studentEngagement.slice(-7).map((data, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-2 gap-4 rounded-2xl border bg-muted/20 p-4 md:grid-cols-4"
                            >
                                <div>
                                    <p className="mb-1 text-xs text-muted-foreground">Date</p>
                                    <p className="text-sm font-medium">
                                        {new Date(data.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-muted-foreground">Active Students</p>
                                    <p className="text-sm font-bold text-blue-600">{data.activeStudents}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-muted-foreground">Lesson Completions</p>
                                    <p className="text-sm font-bold text-emerald-600">{data.lessonCompletions}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-muted-foreground">Quiz Attempts</p>
                                    <p className="text-sm font-bold text-violet-600">{data.quizAttempts}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsPage;