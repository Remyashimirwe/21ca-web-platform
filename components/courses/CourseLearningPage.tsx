'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    BookOpen,
    CheckCircle2,
    Circle,
    Clock,
    FileText,
    HelpCircle,
    ClipboardList,
    Video,
    BadgeInfo,
    Play,
    ChevronDown,
    ChevronRight,
    Layers3,
    BarChart3,
    Users,
    Star,
    ArrowLeft,
    MoveRight,
    SkipForward,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';

type Lesson = {
    id: string;
    title: string;
    description?: string | null;
    content?: string | null;
    videoUrl?: string | null;
    type: LessonType;
    sortOrder?: number;
    isPublished?: boolean;
    isFree?: boolean;
};

type Module = {
    id: string;
    title: string;
    description?: string | null;
    sortOrder?: number;
    lessons?: Lesson[];
};

type Course = {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    thumbnail?: string | null;
    price: number | string;
    currency?: string | null;
    level?: string | null;
    duration?: number | null;
    averageRating?: number | string | null;
    enrollmentCount?: number;
    category?: { name: string; slug: string } | null;
    instructor?: {
        firstName?: string | null;
        lastName?: string | null;
        imageUrl?: string | null;
        bio?: string | null;
    } | null;
    modules?: Module[];
    _count?: {
        enrollments?: number;
        reviews?: number;
    };
};

type Enrollment = {
    id: string;
    progress: number;
    status: string;
    currentLesson?: string | null;
};

type LessonProgressItem = {
    lessonId: string;
    isCompleted: boolean;
    watchTime: number;
};

type Props = {
    course: Course;
    enrollment: Enrollment;
    lessonProgress: LessonProgressItem[];
};

function getLessonIcon(type: LessonType) {
    switch (type) {
        case 'VIDEO':
            return <Video className="h-4 w-4" />;
        case 'TEXT':
            return <FileText className="h-4 w-4" />;
        case 'QUIZ':
            return <HelpCircle className="h-4 w-4" />;
        case 'ASSIGNMENT':
            return <ClipboardList className="h-4 w-4" />;
        case 'LIVE_SESSION':
            return <BadgeInfo className="h-4 w-4" />;
        default:
            return <Play className="h-4 w-4" />;
    }
}

export default function CourseLearningPage({ course, enrollment, lessonProgress }: Props) {
    const router = useRouter();
    const [activeLessonId, setActiveLessonId] = useState<string>(
        enrollment.currentLesson || course.modules?.[0]?.lessons?.[0]?.id || ''
    );
    const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});
    const [saving, setSaving] = useState(false);

    const modules = useMemo(
        () => (course.modules || []).slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
        [course.modules]
    );

    const flatLessons = useMemo(
        () => modules.flatMap((mod) => mod.lessons || []),
        [modules]
    );

    const activeLesson = useMemo(() => {
        for (const mod of modules) {
            const found = (mod.lessons || []).find((lesson) => lesson.id === activeLessonId);
            if (found) return found;
        }
        return flatLessons[0] || null;
    }, [modules, activeLessonId, flatLessons]);

    const activeModule = useMemo(() => {
        return modules.find((mod) => mod.lessons?.some((lesson) => lesson.id === activeLesson?.id)) || modules[0] || null;
    }, [modules, activeLesson]);

    const completedIds = new Set(lessonProgress.filter((item) => item.isCompleted).map((item) => item.lessonId));
    const watchedMap = new Map(lessonProgress.map((item) => [item.lessonId, item.watchTime]));
    const courseCompletion = enrollment.progress || 0;

    const formatCurrency = (amount: number | string, currency = 'USD') =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(amount) || 0);

    const saveProgress = async (lessonId: string, payload: { isCompleted?: boolean; watchTime?: number }) => {
        try {
            setSaving(true);
            await fetch('/api/my-courses/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enrollmentId: enrollment.id,
                    lessonId,
                    ...payload,
                }),
            });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!activeLesson?.id) return;

        const currentWatchTime = watchedMap.get(activeLesson.id) || 0;
        const timer = window.setInterval(() => {
            saveProgress(activeLesson.id, {
                watchTime: currentWatchTime + 10,
            });
        }, 10000);

        return () => window.clearInterval(timer);
    }, [activeLesson?.id]);

    const markComplete = async () => {
        if (!activeLesson?.id) return;
        await saveProgress(activeLesson.id, { isCompleted: true });
    };

    const nextLesson = useMemo(() => {
        const idx = flatLessons.findIndex((l) => l.id === activeLesson?.id);
        return idx >= 0 ? flatLessons[idx + 1] || null : null;
    }, [flatLessons, activeLesson]);

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-background">
            <div className="border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-20">
                <div className="mx-auto w-full px-4 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/my-courses')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold truncate">{course.title}</h1>
                            <p className="text-sm text-muted-foreground truncate">
                                {course.shortDescription || course.description || 'Continue your learning journey'}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Badge variant="secondary" className="gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {course._count?.enrollments || course.enrollmentCount || 0}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                            <Star className="h-3.5 w-3.5" />
                            {course.averageRating ? Number(course.averageRating).toFixed(1) : 'N/A'}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                            <BarChart3 className="h-3.5 w-3.5" />
                            {courseCompletion}% complete
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 py-6 grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_340px] gap-6">
                <aside className="space-y-4">
                    <Card className="h-fit">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold">Course Content</h2>
                                <Badge>{modules.length}</Badge>
                            </div>

                            <div className="space-y-2">
                                {modules.map((mod) => {
                                    const lessons = mod.lessons || [];
                                    const completedCount = lessons.filter((lesson) => completedIds.has(lesson.id)).length;
                                    const open = collapsedModules[mod.id] ?? true;

                                    return (
                                        <div key={mod.id} className="rounded-xl border bg-card">
                                            <button
                                                className="w-full flex items-center justify-between gap-3 p-3 text-left"
                                                onClick={() =>
                                                    setCollapsedModules((prev) => ({
                                                        ...prev,
                                                        [mod.id]: !open,
                                                    }))
                                                }
                                            >
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">{mod.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {completedCount}/{lessons.length} lessons
                                                    </p>
                                                </div>
                                                {open ? (
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </button>

                                            {open && (
                                                <div className="border-t p-2 space-y-1">
                                                    {lessons.map((lesson) => {
                                                        const isActive = lesson.id === activeLesson?.id;
                                                        const isDone = completedIds.has(lesson.id);

                                                        return (
                                                            <button
                                                                key={lesson.id}
                                                                onClick={() => setActiveLessonId(lesson.id)}
                                                                className={cn(
                                                                    'w-full flex items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                                                                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60'
                                                                )}
                                                            >
                                                                <div className="mt-0.5 flex-shrink-0">
                                                                    {isDone ? (
                                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                    ) : (
                                                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="text-sm font-medium line-clamp-1">
                                                                            {lesson.title}
                                                                        </span>
                                                                        <Badge variant="outline" className="text-[10px]">
                                                                            {lesson.type}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                                        {lesson.description || 'Lesson content'}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                <main className="space-y-6">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="aspect-video bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                                {activeLesson?.type === 'VIDEO' && activeLesson.videoUrl ? (
                                    <video controls className="w-full h-full object-cover">
                                        <source src={activeLesson.videoUrl} />
                                    </video>
                                ) : (
                                    <div className="text-center p-8 max-w-2xl">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                            {activeLesson ? getLessonIcon(activeLesson.type) : <BookOpen className="h-7 w-7" />}
                                        </div>
                                        <h2 className="text-2xl font-bold">
                                            {activeLesson?.title || 'Select a lesson'}
                                        </h2>
                                        <p className="text-muted-foreground mt-2">
                                            {activeLesson?.description || 'Pick a lesson from the sidebar to start learning.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="secondary">{activeLesson?.type || 'LESSON'}</Badge>
                                        {activeLesson?.isFree ? <Badge>Free</Badge> : null}
                                        {activeModule ? <Badge variant="outline">{activeModule.title}</Badge> : null}
                                    </div>
                                    <h2 className="text-2xl font-bold mt-2">
                                        {activeLesson?.title || 'No lesson selected'}
                                    </h2>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => router.push('/my-courses')}>
                                        Leave Course
                                    </Button>
                                    {nextLesson ? (
                                        <Button onClick={() => setActiveLessonId(nextLesson.id)}>
                                            Next Lesson
                                            <SkipForward className="h-4 w-4 ml-2" />
                                        </Button>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {course.duration ? `${course.duration} minutes` : 'Self paced'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Layers3 className="h-4 w-4" />
                                    {modules.length} modules
                                </span>
                                <span className="flex items-center gap-1">
                                    <BarChart3 className="h-4 w-4" />
                                    {courseCompletion}% complete
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    {formatCurrency(course.price, course.currency || 'USD')}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {activeLesson?.type === 'TEXT' ? (
                                    <div className="whitespace-pre-wrap text-sm leading-7 rounded-lg border p-4 bg-muted/20">
                                        {activeLesson.content || 'No text content available for this lesson.'}
                                    </div>
                                ) : activeLesson?.type === 'QUIZ' ? (
                                    <div className="rounded-lg border p-4 bg-muted/20">
                                        <p className="text-muted-foreground">This is a quiz lesson. Add quiz UI here.</p>
                                    </div>
                                ) : activeLesson?.type === 'ASSIGNMENT' ? (
                                    <div className="rounded-lg border p-4 bg-muted/20">
                                        <p className="text-muted-foreground">This is an assignment lesson. Add submission UI here.</p>
                                    </div>
                                ) : activeLesson?.type === 'LIVE_SESSION' ? (
                                    <div className="rounded-lg border p-4 bg-muted/20">
                                        <p className="text-muted-foreground">This lesson is a live session. Add meeting link / schedule here.</p>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border p-4 bg-muted/20">
                                        <p className="text-muted-foreground">
                                            {activeLesson?.videoUrl
                                                ? 'Use the video player above to watch this lesson.'
                                                : 'Select a lesson to begin.'}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Button onClick={markComplete} disabled={saving || !activeLesson}>
                                        {saving ? 'Saving...' : 'Mark as Complete'}
                                        <CheckCircle2 className="h-4 w-4 ml-2" />
                                    </Button>
                                    <Button variant="outline" onClick={() => saveProgress(activeLesson?.id || '', { watchTime: (watchedMap.get(activeLesson?.id || '') || 0) + 30 })}>
                                        Save Progress
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>

                <aside className="space-y-4">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <h3 className="font-semibold">Course Progress</h3>

                            <div className="rounded-lg bg-muted/40 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Completed</span>
                                    <span className="text-sm font-medium">{courseCompletion}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-300"
                                        style={{ width: `${courseCompletion}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg border p-3">
                                    <p className="text-muted-foreground">Lessons</p>
                                    <p className="font-semibold">{flatLessons.length}</p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-muted-foreground">Completed</p>
                                    <p className="font-semibold">{completedIds.size}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold">Instructor</h3>
                            <div>
                                <p className="font-medium">
                                    {course.instructor?.firstName || ''} {course.instructor?.lastName || ''}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-6">
                                    {course.instructor?.bio || 'No instructor bio provided.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}