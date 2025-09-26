// components/dashboards/user/UserDashboard.tsx
'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import {
    BookOpen,
    Clock,
    Award,
    TrendingUp,
    Calendar,
    Users,
    Star,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UserDashboard = () => {
    const { user } = useUser();

    // Get current time for greeting
    const currentHour = new Date().getHours();
    const getGreeting = () => {
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Mock data - you can replace with real data later
    const userStats = {
        coursesEnrolled: 3,
        coursesCompleted: 1,
        totalHours: 24,
        currentStreak: 5,
        certificates: 1
    };

    const recentCourses = [
        {
            title: "STEM Foundations for Young Innovators",
            progress: 75,
            nextLesson: "Introduction to Robotics",
            instructor: "Dr. Sarah Uwimana",
            image: "https://images.unsplash.com/photo-1634951401794-6c84f593db82?w=300&h=200&fit=crop"
        },
        {
            title: "Digital Financial Literacy Essentials",
            progress: 45,
            nextLesson: "Mobile Banking Basics",
            instructor: "Jean Claude Mugabo",
            image: "https://images.unsplash.com/photo-1634586720560-d5c61d450133?w=300&h=200&fit=crop"
        },
        {
            title: "Green Entrepreneurship Bootcamp",
            progress: 20,
            nextLesson: "Sustainable Business Models",
            instructor: "Grace Nyirahabimana",
            image: "https://plus.unsplash.com/premium_photo-1723672919439-c37b99155360?w=300&h=200&fit=crop"
        }
    ];

    const upcomingEvents = [
        {
            title: "STEM Workshop: Building Solar Panels",
            date: "Today, 2:00 PM",
            type: "Live Session"
        },
        {
            title: "Q&A with Digital Finance Expert",
            date: "Tomorrow, 10:00 AM",
            type: "Interactive Session"
        },
        {
            title: "Assignment Due: Business Plan Draft",
            date: "Aug 31, 11:59 PM",
            type: "Deadline"
        }
    ];

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
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                            Day {userStats.currentStreak}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Learning Streak
                        </div>
                    </div>
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
                        <p className="text-xs text-green-600 dark:text-green-400">
                            +1 this month
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
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            +4h this week
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
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            Next one at 95% progress
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
                        <div className="text-2xl font-bold text-foreground">47%</div>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
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
                                {recentCourses.map((course, index) => (
                                    <div
                                        key={index}
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
                                                Next: {course.nextLesson}
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
                                    </div>
                                ))}
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
                                {upcomingEvents.map((event, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors duration-300"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0" />
                                            <div className="flex-1">
                                                <h5 className="font-medium text-foreground mb-1">
                                                    {event.title}
                                                </h5>
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    {event.date}
                                                </p>
                                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                  {event.type}
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
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span>Browse Courses</span>
                        </Button>
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
                        <Button
                            className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
                            variant="outline"
                        >
                            <Award className="h-6 w-6 text-primary" />
                            <span>View Certificates</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDashboard;