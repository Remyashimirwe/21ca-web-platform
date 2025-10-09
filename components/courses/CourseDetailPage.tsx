// components/courses/CourseDetailPage.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
    BookOpen,
    Users,
    Clock,
    Star,
    Award,
    CheckCircle,
    PlayCircle,
    Download,
    Share2,
    Heart,
    Globe,
    Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CourseDetailPageProps {
    course: any;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course }) => {
    const router = useRouter();
    const { user } = useUser();
    const [activeModule, setActiveModule] = useState<string | null>(null);

    const totalLessons = course.modules.reduce(
        (total: number, module: any) => total + module.lessons.length,
        0
    );

    const totalDuration = course.modules.reduce(
        (total: number, module: any) =>
            total + module.lessons.reduce(
                (moduleTotal: number, lesson: any) => moduleTotal + (lesson.videoDuration || 0),
                0
            ),
        0
    );

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const handleEnroll = async () => {
        if (!user) {
            router.push('/sign-in');
            return;
        }

        try {
            const response = await fetch('/api/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: course.id })
            });

            if (response.ok) {
                alert('Successfully enrolled!');
                router.push(`/courses/my-courses`);
            } else {
                alert('Failed to enroll');
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            alert('Failed to enroll');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Course Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary">{course.category.name}</Badge>
                                <Badge variant="outline" className="capitalize">
                                    {course.level.toLowerCase()}
                                </Badge>
                                {course.status === 'UNDER_REVIEW' && (
                                    <Badge className="bg-yellow-500">Under Review</Badge>
                                )}
                                {course.isPublished && (
                                    <Badge className="bg-green-500">Published</Badge>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                {course.title}
                            </h1>

                            <p className="text-lg text-muted-foreground">
                                {course.shortDescription}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">
                                        {course.averageRating?.toFixed(1) || 'New'}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ({course._count.reviews} reviews)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{course._count.enrollments} students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDuration(totalDuration)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    <span className="capitalize">{course.language}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={course.instructor.imageUrl || ''} />
                                    <AvatarFallback>
                                        {course.instructor.firstName?.charAt(0)}
                                        {course.instructor.lastName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm text-muted-foreground">Instructor</p>
                                    <p className="font-medium">
                                        {course.instructor.firstName} {course.instructor.lastName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Price Card */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardContent className="p-6 space-y-4">
                                    {course.thumbnail && (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    )}

                                    <div>
                                        <div className="text-3xl font-bold mb-2">
                                            {course.discountPrice ? (
                                                <>
                                                    <span>${course.discountPrice}</span>
                                                    <span className="text-lg text-muted-foreground line-through ml-2">
                                                        ${course.price}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>${course.price}</span>
                                            )}
                                        </div>
                                        {course.discountPrice && (
                                            <Badge variant="destructive">
                                                Save ${(Number(course.price) - Number(course.discountPrice)).toFixed(2)}
                                            </Badge>
                                        )}
                                    </div>

                                    <Button onClick={handleEnroll} className="w-full" size="lg">
                                        Enroll Now
                                    </Button>

                                    <div className="space-y-2 pt-4 border-t">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Modules</span>
                                            <span className="font-medium">{course.modules.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Lessons</span>
                                            <span className="font-medium">{totalLessons}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Duration</span>
                                            <span className="font-medium">{formatDuration(totalDuration)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Certificate</span>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Save
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {course.objectives.map((objective: string, index: number) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{objective}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold mb-4">About this course</h2>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {course.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Course Content */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold mb-4">Course content</h2>
                                <div className="space-y-2">
                                    {course.modules.map((module: any, index: number) => (
                                        <div key={module.id} className="border rounded-lg">
                                            <button
                                                onClick={() =>
                                                    setActiveModule(
                                                        activeModule === module.id ? null : module.id
                                                    )
                                                }
                                                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-sm font-medium">{index + 1}</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 className="font-medium">{module.title}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {module.lessons.length} lessons
                                                        </p>
                                                    </div>
                                                </div>
                                                <PlayCircle className="h-5 w-5" />
                                            </button>

                                            {activeModule === module.id && (
                                                <div className="border-t bg-muted/30">
                                                    {module.lessons.map((lesson: any, lessonIndex: number) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="p-4 flex items-center justify-between border-b last:border-b-0"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <PlayCircle className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm">{lesson.title}</span>
                                                                {lesson.isFree && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        Free
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {lesson.videoDuration && (
                                                                <span className="text-sm text-muted-foreground">
                                                                    {lesson.videoDuration}m
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        {course.requirements.length > 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                                    <ul className="space-y-2">
                                        {course.requirements.map((req: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span className="text-muted-foreground">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Instructor */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-bold mb-4">Instructor</h3>
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={course.instructor.imageUrl || ''} />
                                        <AvatarFallback>
                                            {course.instructor.firstName?.charAt(0)}
                                            {course.instructor.lastName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {course.instructor.firstName} {course.instructor.lastName}
                                        </p>
                                        {course.instructor.bio && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {course.instructor.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;