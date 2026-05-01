'use client';

import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    CreditCard,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EarningsData {
    totalEarnings: number;
    thisMonth: number;
    lastMonth: number;
    pending: number;
    available: number;
    lifetimeEarnings: number;
    averagePerCourse: number;
    topCourses: {
        id: string;
        title: string;
        revenue: number;
        sales: number;
        thumbnail: string | null;
    }[];
    recentTransactions: {
        id: string;
        amount: number;
        status: string;
        course: {
            title: string;
        };
        user: {
            firstName: string;
            lastName: string;
        };
        createdAt: Date;
    }[];
    monthlyData: {
        month: string;
        earnings: number;
        sales: number;
    }[];
}

const EarningsPage = () => {
    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [selectedCourse, setSelectedCourse] = useState('all');

    useEffect(() => {
        fetchEarnings();
    }, [selectedPeriod, selectedCourse]);

    const fetchEarnings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/instructor/earnings?period=${selectedPeriod}&course=${selectedCourse}`);
            const data = await response.json();
            setEarnings(data);
        } catch (error) {
            console.error('Failed to fetch earnings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = () => {
        // Implement withdrawal logic
        alert('Withdrawal feature coming soon!');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge className="bg-green-500">Completed</Badge>;
            case 'PENDING':
                return <Badge variant="secondary" className="bg-yellow-500 text-white">Pending</Badge>;
            case 'FAILED':
                return <Badge variant="destructive">Failed</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (loading || !earnings) {
        return (
            <div className="space-y-6 pb-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-48 mb-2" />
                    <div className="h-4 bg-muted rounded w-64" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="h-20 bg-muted rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    const monthlyChange = earnings.lastMonth > 0 
        ? ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100 
        : 0;

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Earnings</h1>
                    <p className="text-muted-foreground">Track your revenue and payouts</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={handleWithdraw} disabled={earnings.available <= 0}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Request Payout</span>
                        <span className="sm:hidden">Payout</span>
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Export Report</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Earnings</p>
                            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                        <p className="text-xl sm:text-2xl font-bold mb-1">{formatCurrency(earnings.totalEarnings)}</p>
                        <div className={cn(
                            "flex items-center gap-1 text-xs",
                            monthlyChange >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                            {monthlyChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(monthlyChange).toFixed(1)}% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">This Month</p>
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <p className="text-xl sm:text-2xl font-bold mb-1">{formatCurrency(earnings.thisMonth)}</p>
                        <p className="text-xs text-muted-foreground">
                            Last month: {formatCurrency(earnings.lastMonth)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Available</p>
                            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                        <p className="text-xl sm:text-2xl font-bold mb-1">{formatCurrency(earnings.available)}</p>
                        <p className="text-xs text-muted-foreground">Ready to withdraw</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</p>
                            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                        </div>
                        <p className="text-xl sm:text-2xl font-bold mb-1">{formatCurrency(earnings.pending)}</p>
                        <p className="text-xs text-muted-foreground">Processing</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-3 py-2 border border-input rounded-md bg-background text-sm flex-1"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                        
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="px-3 py-2 border border-input rounded-md bg-background text-sm flex-1"
                        >
                            <option value="all">All Courses</option>
                            {earnings.topCourses.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Earning Courses */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Top Earning Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {earnings.topCourses.map((course, index) => (
                                <div key={course.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{course.title}</p>
                                        <p className="text-xs text-muted-foreground">{course.sales} sales</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-sm">{formatCurrency(course.revenue)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {earnings.recentTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className="font-medium text-sm truncate">{transaction.course.title}</p>
                                            <p className="font-bold text-sm flex-shrink-0">{formatCurrency(transaction.amount)}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {transaction.user.firstName} {transaction.user.lastName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {getStatusBadge(transaction.status)}
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(transaction.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {earnings.monthlyData.map((data, index) => {
                            const maxEarnings = Math.max(...earnings.monthlyData.map(d => d.earnings));
                            const percentage = (data.earnings / maxEarnings) * 100;
                            
                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{data.month}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-muted-foreground">{data.sales} sales</span>
                                            <span className="font-bold">{formatCurrency(data.earnings)}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EarningsPage;