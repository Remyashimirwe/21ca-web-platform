'use client';

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Users,
    DollarSign,
    BookOpen,
    Clock,
    Star,
    Calendar as CalendarIcon,
    ArrowUp,
    ArrowDown,
    Download,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getChangeIndicator = (change: number) => {
        const isPositive = change >= 0;
        return (
            <span className={cn(
                'flex items-center gap-1 text-xs',
                isPositive ? 'text-green-600' : 'text-red-600'
            )}>
                {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(change).toFixed(1)}%
            </span>
        );
    };

    if (loading || !analytics) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-48 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="h-20 bg-muted rounded" />
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground font-semibold ">Track your course performance and student engagement</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="px-3 py-2 border border-input rounded-md bg-background text-sm font-semibold "
                    >
                        <option value="7d" className='font-semibold'>Last 7 days</option>
                        <option value="30d" className='font-semibold'>Last 30 days</option>
                        <option value="90d" className='font-semibold'>Last 90 days</option>
                        <option value="1y" className='font-semibold'>Last year</option>
                    </select>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold mb-1">
                            {formatCurrency(analytics.overview.totalRevenue)}
                        </p>
                        {getChangeIndicator(analytics.overview.revenueChange)}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">Total Students</p>
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold mb-1">
                            {analytics.overview.totalStudents.toLocaleString()}
                        </p>
                        {getChangeIndicator(analytics.overview.studentsChange)}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                            <Star className="h-4 w-4 text-yellow-600" />
                        </div>
                        <p className="text-2xl font-bold mb-1">
                            {analytics.overview.averageRating.toFixed(1)}
                        </p>
                        {getChangeIndicator(analytics.overview.ratingChange)}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">Completion Rate</p>
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold mb-1">
                            {analytics.overview.completionRate}%
                        </p>
                        {getChangeIndicator(analytics.overview.completionChange)}
                    </CardContent>
                </Card>
            </div>

            {/* Revenue & Enrollments Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.monthlyData.map((data, index) => {
                                const maxRevenue = Math.max(...analytics.monthlyData.map(d => d.revenue));
                                const percentage = (data.revenue / maxRevenue) * 100;
                                
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{data.month}</span>
                                            <span className="font-bold">{formatCurrency(data.revenue)}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{data.enrollments} enrollments</span>
                                            <span>{data.completions} completions</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Course Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Course Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.coursesPerformance.map((course, index) => (
                                <div key={course.courseId} className="p-4 bg-muted/30 rounded-lg">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm mb-1">{course.title}</h4>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>{course.enrollments} students</span>
                                                <span className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    {course.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">{formatCurrency(course.revenue)}</p>
                                            <p className="text-xs text-muted-foreground">Revenue</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span>Completion Rate</span>
                                            <span className="font-medium">{course.completionRate}%</span>
                                        </div>
                                        <div className="w-full bg-background rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                                                style={{ width: `${course.completionRate}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Student Engagement */}
            <Card>
                <CardHeader>
                    <CardTitle>Student Engagement Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.studentEngagement.slice(-7).map((data, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-muted/20 rounded-lg">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                                    <p className="font-medium text-sm">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Active Students</p>
                                    <p className="font-bold text-sm">{data.activeStudents}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Lesson Completions</p>
                                    <p className="font-bold text-sm">{data.lessonCompletions}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Quiz Attempts</p>
                                    <p className="font-bold text-sm">{data.quizAttempts}</p>
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