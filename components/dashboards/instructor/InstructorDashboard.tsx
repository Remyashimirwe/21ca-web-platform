'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import {
    BookOpen,
    Users,
    TrendingUp,
    Star,
    MessageSquare,
    Clock,
    Award,
    Play,
    FileText,
    BarChart3,
    Calendar,
    Upload,
    Edit,
    Eye,
    ThumbsUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InstructorDashboard = () => {
    const { user } = useUser();

    // Get current time for greeting
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Mock instructor data
    const instructorStats = {
        totalStudents: 432,
        activeCourses: 3,
        totalRevenue: 12450,
        averageRating: 4.8,
        completionRate: 78,
        totalLessons: 48,
        hoursWatched: 1245,
        newEnrollmentsThisWeek: 23
    };

    const myCourses = [
        {
            title: "STEM Foundations for Young Innovators",
            students: 234,
            completion: 78,
            rating: 4.9,
            revenue: 8450,
            lastUpdated: "2 days ago",
            status: "active",
            engagement: 92
        },
        {
            title: "Advanced Robotics Workshop",
            students: 156,
            completion: 65,
            rating: 4.8,
            revenue: 3200,
            lastUpdated: "1 week ago",
            status: "active",
            engagement: 88
        },
        {
            title: "Digital Innovation Lab",
            students: 42,
            completion: 45,
            rating: 4.7,
            revenue: 800,
            lastUpdated: "3 days ago",
            status: "draft",
            engagement: 75
        }
    ];

    const recentActivity = [
        {
            type: 'new_review',
            message: 'New 5-star review from Marie Claire on "STEM Foundations"',
            time: '30 minutes ago',
            icon: Star,
            color: 'text-yellow-500'
        },
        {
            type: 'student_question',
            message: 'Patrick asked a question in "Advanced Robotics"',
            time: '2 hours ago',
            icon: MessageSquare,
            color: 'text-blue-500'
        },
        {
            type: 'completion',
            message: '12 students completed "Introduction to Sensors" lesson',
            time: '4 hours ago',
            icon: Award,
            color: 'text-green-500'
        },
        {
            type: 'enrollment',
            message: '5 new students enrolled in your courses today',
            time: '6 hours ago',
            icon: Users,
            color: 'text-purple-500'
        }
    ];

    const upcomingTasks = [
        {
            task: "Record Module 4: Advanced Programming",
            due: "Tomorrow, 2:00 PM",
            type: "Content Creation"
        },
        {
            task: "Review student assignments",
            due: "Aug 30, 5:00 PM",
            type: "Assessment"
        },
        {
            task: "Live Q&A Session",
            due: "Sep 1, 10:00 AM",
            type: "Live Session"
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                                    {getGreeting()}, {user?.firstName || 'Instructor'}!
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Ready to inspire minds and shape the future? Your students are waiting!
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                    {instructorStats.newEnrollmentsThisWeek}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    New Enrollments This Week
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Students
                            </CardTitle>
                            <Users className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{instructorStats.totalStudents}</div>
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
                            <div className="text-2xl font-bold text-foreground">{instructorStats.averageRating}</div>
                            <p className="text-xs text-green-600 dark:text-green-400">
                                Average rating
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Completion Rate
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{instructorStats.completionRate}%</div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                Student completion
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-yellow-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Revenue
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">${instructorStats.totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* My Courses */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    My Courses
                                </CardTitle>
                                <Button size="sm" className="gap-2">
                                    <Upload className="h-4 w-4" />
                                    Create Course
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {myCourses.map((course, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-300 group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                                            {course.title}
                                                        </h4>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                                            course.status === 'active'
                                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                        }`}>
                              {course.status}
                            </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Last updated: {course.lastUpdated}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <div className="text-foreground font-medium">{course.students}</div>
                                                    <div className="text-muted-foreground">Students</div>
                                                </div>
                                                <div>
                                                    <div className="text-foreground font-medium">{course.completion}%</div>
                                                    <div className="text-muted-foreground">Completion</div>
                                                </div>
                                                <div>
                                                    <div className="text-foreground font-medium flex items-center gap-1">
                                                        {course.rating} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    </div>
                                                    <div className="text-muted-foreground">Rating</div>
                                                </div>
                                                <div>
                                                    <div className="text-foreground font-medium">${course.revenue}</div>
                                                    <div className="text-muted-foreground">Revenue</div>
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                    <span>Student Engagement</span>
                                                    <span>{course.engagement}%</span>
                                                </div>
                                                <div className="w-full bg-background rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${course.engagement}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity & Tasks */}
                    <div className="space-y-8">
                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                                        >
                                            <div className={`p-2 rounded-full bg-background ${activity.color}`}>
                                                <activity.icon className="h-3 w-3" />
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
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Tasks */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Upcoming Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {upcomingTasks.map((task, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-foreground mb-1">
                                                        {task.task}
                                                    </h5>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        {task.due}
                                                    </p>
                                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                            {task.type}
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

                {/* Quick Actions */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Button
                                    className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                                    variant="outline"
                                >
                                    <Upload className="h-6 w-6 text-primary" />
                                    <span>Upload Content</span>
                                </Button>
                                <Button
                                    className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                                    variant="outline"
                                >
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                    <span>Answer Questions</span>
                                </Button>
                                <Button
                                    className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                                    variant="outline"
                                >
                                    <BarChart3 className="h-6 w-6 text-primary" />
                                    <span>View Analytics</span>
                                </Button>
                                <Button
                                    className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                                    variant="outline"
                                >
                                    <Play className="h-6 w-6 text-primary" />
                                    <span>Schedule Live Session</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;