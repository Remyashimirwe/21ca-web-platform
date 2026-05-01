'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Search,
    Filter,
    Download,
    Mail,
    MessageSquare,
    TrendingUp,
    Clock,
    Award,
    BookOpen,
    Calendar,
    MoreVertical,
    Eye,
    Send,
    FileText,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Student {
    id: string;
    clerkId: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string | null;
    enrollments: {
        id: string;
        progress: number;
        enrolledAt: Date;
        completedAt: Date | null;
        status: string;
        course: {
            id: string;
            title: string;
            thumbnail: string | null;
        };
    }[];
}

interface StudentStats {
    totalStudents: number;
    activeStudents: number;
    completedCourses: number;
    averageProgress: number;
    newThisWeek: number;
    newThisMonth: number;
}

const StudentsPage = () => {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [stats, setStats] = useState<StudentStats>({
        totalStudents: 0,
        activeStudents: 0,
        completedCourses: 0,
        averageProgress: 0,
        newThisWeek: 0,
        newThisMonth: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        fetchStudents();
        fetchStats();
        fetchCourses();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/instructor/students');
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/instructor/students/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/instructor/courses');
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCourse = selectedCourse === 'all' || 
            student.enrollments.some(e => e.course.id === selectedCourse);

        const matchesStatus = selectedStatus === 'all' ||
            student.enrollments.some(e => e.status === selectedStatus.toUpperCase());

        return matchesSearch && matchesCourse && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge variant="default" className="bg-blue-500">Active</Badge>;
            case 'COMPLETED':
                return <Badge variant="default" className="bg-green-500">Completed</Badge>;
            case 'DROPPED':
                return <Badge variant="secondary">Dropped</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const handleSendMessage = (studentId: string) => {
        router.push(`/messages?to=${studentId}`);
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Students</h1>
                    <p className="text-muted-foreground">Track and manage your students' progress</p>
                </div>
                <Button onClick={() => router.push('/messages')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message All
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Students</p>
                                <p className="text-xl sm:text-2xl font-bold">{stats.totalStudents}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    +{stats.newThisMonth} this month
                                </p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Students</p>
                                <p className="text-xl sm:text-2xl font-bold">{stats.activeStudents}</p>
                                <p className="text-xs text-blue-600">Currently learning</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Completed Courses</p>
                                <p className="text-xl sm:text-2xl font-bold">{stats.completedCourses}</p>
                                <p className="text-xs text-yellow-600">Certificates issued</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg Progress</p>
                                <p className="text-xl sm:text-2xl font-bold">{stats.averageProgress}%</p>
                                <p className="text-xs text-purple-600">Across all courses</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                                <option value="all">All Courses</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                            
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="dropped">Dropped</option>
                            </select>

                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Students List */}
            {loading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-muted rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-muted rounded w-1/4" />
                                        <div className="h-3 bg-muted rounded w-1/3" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredStudents.length === 0 ? (
                <Card className="p-8 sm:p-12 text-center">
                    <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No students found</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        {searchQuery ? "Try adjusting your search" : "Students will appear here once they enroll in your courses"}
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredStudents.map((student) => (
                        <Card key={student.id} className="hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                                        <AvatarImage src={student.imageUrl || ''} />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0 space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-base sm:text-lg truncate">
                                                    {student.firstName} {student.lastName}
                                                </h3>
                                                <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleSendMessage(student.clerkId)}
                                                >
                                                    <Mail className="h-4 w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">Message</span>
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/instructor/students/${student.id}`)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleSendMessage(student.clerkId)}>
                                                            <Send className="h-4 w-4 mr-2" />
                                                            Send Message
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            View Progress Report
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {student.enrollments.slice(0, 2).map((enrollment) => (
                                                <div key={enrollment.id} className="p-3 bg-muted/30 rounded-lg">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <BookOpen className="h-4 w-4 flex-shrink-0 text-primary" />
                                                            <span className="text-sm font-medium truncate">{enrollment.course.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            {getStatusBadge(enrollment.status)}
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                {enrollment.progress}% complete
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-background rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${enrollment.progress}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Enrolled {formatDate(enrollment.enrolledAt)}
                                                        </span>
                                                        {enrollment.completedAt && (
                                                            <span className="flex items-center gap-1">
                                                                <Award className="h-3 w-3" />
                                                                Completed {formatDate(enrollment.completedAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {student.enrollments.length > 2 && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="w-full text-xs"
                                                    onClick={() => router.push(`/instructor/students/${student.id}`)}
                                                >
                                                    View {student.enrollments.length - 2} more courses
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentsPage;