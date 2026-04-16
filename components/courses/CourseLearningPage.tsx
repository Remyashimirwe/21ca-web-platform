'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    BadgeInfo,
    BarChart3,
    BookOpen,
    CheckCircle2,
    Circle,
    Clock,
    ClipboardList,
    FileText,
    HelpCircle,
    Layers3,
    Lock,
    Maximize2,
    Minimize2,
    Play,
    SkipBack,
    SkipForward,
    Star,
    Users,
    Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';

type Lesson = {
    id: string;
    title: string;
    description?: string | null;
    content?: string | null;
    videoUrl?: string | null;
    type: LessonType;
    sortOrder?: number | null;
    isPublished?: boolean | null;
    isFree?: boolean | null;
};

type Module = {
    id: string;
    title: string;
    description?: string | null;
    sortOrder?: number | null;
    lessons?: Lesson[];
};

type Course = {
    id: string;
    title: string;
    slug?: string;
    description?: string | null;
    shortDescription?: string | null;
    thumbnail?: string | null;
    price: number | string | null;
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
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [activeLessonId, setActiveLessonId] = useState<string>(
        enrollment.currentLesson || course.modules?.[0]?.lessons?.[0]?.id || ''
    );
    const [saving, setSaving] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [watchTime, setWatchTime] = useState<number>(0);

    const modules = useMemo(
        () =>
            (course.modules || [])
                .slice()
                .sort((a: Module, b: Module) => (a.sortOrder || 0) - (b.sortOrder || 0)),
        [course.modules]
    );

    const flatLessons = useMemo(
        () => modules.flatMap((mod: Module) => mod.lessons || []),
        [modules]
    );

    const activeLesson = useMemo(() => {
        for (const mod of modules) {
            const found = (mod.lessons || []).find((lesson: Lesson) => lesson.id === activeLessonId);
            if (found) return found;
        }
        return flatLessons[0] || null;
    }, [modules, activeLessonId, flatLessons]);

    const activeIndex = useMemo(
        () => flatLessons.findIndex((lesson: Lesson) => lesson.id === activeLesson?.id),
        [flatLessons, activeLesson]
    );

    const activeModule = useMemo(() => {
        return (
            modules.find((mod: Module) =>
                mod.lessons?.some((lesson: Lesson) => lesson.id === activeLesson?.id)
            ) || modules[0] || null
        );
    }, [modules, activeLesson]);

    const completedIds = useMemo(
        () =>
            new Set(
                lessonProgress
                    .filter((item: LessonProgressItem) => item.isCompleted)
                    .map((item: LessonProgressItem) => item.lessonId)
            ),
        [lessonProgress]
    );

    const watchedMap = useMemo(
        () => new Map(lessonProgress.map((item: LessonProgressItem) => [item.lessonId, item.watchTime] as const)),
        [lessonProgress]
    );

    const courseCompletion = enrollment.progress || 0;

    const formatCurrency = (amount: number | string | null, currency = 'USD') => {
        const safeAmount = Number(amount ?? 0);
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(safeAmount);
    };

    const saveProgress = async (
        lessonId: string,
        payload: { isCompleted?: boolean; watchTime?: number }
    ) => {
        if (!lessonId) return;

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
        } catch (error) {
            console.error('Failed to save progress:', error);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!activeLesson?.id) return;

        const currentWatchTime = Number(watchedMap.get(activeLesson.id) ?? 0);
        const timer = window.setInterval(() => {
            const nextWatchTime = currentWatchTime + 10;
            setWatchTime(nextWatchTime);
            saveProgress(activeLesson.id, { watchTime: nextWatchTime });
        }, 10000);

        return () => window.clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLesson?.id]);

    const goToLesson = async (lessonId: string) => {
        if (activeLesson?.id) {
            await saveProgress(activeLesson.id, { watchTime });
        }
        setActiveLessonId(lessonId);
    };

    const goNext = async () => {
        const next = flatLessons[activeIndex + 1];
        if (next) await goToLesson(next.id);
    };

    const goPrevious = async () => {
        const prev = flatLessons[activeIndex - 1];
        if (prev) await goToLesson(prev.id);
    };

    const markComplete = async () => {
        if (!activeLesson?.id) return;
        await saveProgress(activeLesson.id, { isCompleted: true, watchTime });
        const next = flatLessons[activeIndex + 1];
        if (next) setActiveLessonId(next.id);
    };

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen toggle failed:', error);
        }
    };

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    useEffect(() => {
        if (!activeLesson?.id) return;
        setWatchTime(Number(watchedMap.get(activeLesson.id) ?? 0));
    }, [activeLesson?.id, watchedMap]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || activeLesson?.type !== 'VIDEO') return;

        const handleTimeUpdate = () => {
            const current = video.currentTime || 0;
            const duration = video.duration || 0;

            if (duration > 0) {
                const watchedPercent = (current / duration) * 100;
                const currentSeconds = Math.floor(current);
                setWatchTime(currentSeconds);

                void saveProgress(activeLesson.id, {
                    watchTime: currentSeconds,
                    isCompleted: watchedPercent >= 95,
                });
            }
        };

        const handleEnded = () => {
            void saveProgress(activeLesson.id, {
                watchTime: Math.floor(video.duration || 0),
                isCompleted: true,
            });

            const next = flatLessons[activeIndex + 1];
            if (next) {
                setTimeout(() => setActiveLessonId(next.id), 500);
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
        };
    }, [activeLesson?.id, activeLesson?.type, activeIndex, flatLessons]);

    return (
        <div
            className={cn(
                'min-h-[calc(100vh-4rem)] w-full bg-background',
                isFullscreen && 'fixed inset-0 z-50 min-h-screen overflow-auto bg-background'
            )}
        >
            <div
                className={cn(
                    'sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60',
                    isFullscreen && 'border-white/10 bg-black/40 text-white'
                )}
            >
                <div className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/my-courses')}
                            className={cn(
                                'shrink-0',
                                isFullscreen && 'text-white hover:bg-white/10 hover:text-white'
                            )}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>

                        <div className="min-w-0">
                            <h1 className={cn('truncate text-lg font-semibold', isFullscreen && 'text-white')}>
                                {course.title}
                            </h1>
                            <p className={cn('truncate text-sm text-muted-foreground', isFullscreen && 'text-white/70')}>
                                {course.shortDescription || course.description || 'Continue your learning journey'}
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleFullscreen}
                            className={cn(
                                isFullscreen && 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
                            )}
                        >
                            {isFullscreen ? (
                                <>
                                    <Minimize2 className="mr-2 h-4 w-4" />
                                    Exit Full Screen
                                </>
                            ) : (
                                <>
                                    <Maximize2 className="mr-2 h-4 w-4" />
                                    Full Screen
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full px-4 py-6">
                <main className="space-y-6">
                    <Card className="overflow-hidden border-border/60 shadow-sm">
                        <CardContent className="p-0">
                            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/15 via-background to-primary/5">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_30%)]" />
                                {activeLesson?.type === 'VIDEO' && activeLesson.videoUrl ? (
                                    <video ref={videoRef} controls className="relative z-10 h-full w-full object-cover">
                                        <source src={activeLesson.videoUrl} />
                                    </video>
                                ) : (
                                    <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                            {activeLesson ? getLessonIcon(activeLesson.type) : <BookOpen className="h-7 w-7" />}
                                        </div>
                                        <h2 className="text-2xl font-bold">
                                            {activeLesson?.title || 'Select a lesson'}
                                        </h2>
                                        <p className="mt-2 max-w-2xl text-muted-foreground">
                                            {activeLesson?.description || 'Pick a lesson to start learning.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="space-y-5 p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">{activeLesson?.type || 'LESSON'}</Badge>
                                        {activeLesson?.isFree ? <Badge>Free</Badge> : null}
                                        {activeModule ? <Badge variant="outline">{activeModule.title}</Badge> : null}
                                    </div>
                                    <h2 className="mt-2 text-2xl font-bold">
                                        {activeLesson?.title || 'No lesson selected'}
                                    </h2>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" onClick={() => router.push('/my-courses')}>
                                        Leave Course
                                    </Button>
                                    <Button variant="outline" onClick={goPrevious} disabled={activeIndex <= 0}>
                                        <SkipBack className="mr-2 h-4 w-4" />
                                        Previous
                                    </Button>
                                    <Button onClick={goNext} disabled={activeIndex < 0 || activeIndex >= flatLessons.length - 1}>
                                        Next Lesson
                                        <SkipForward className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" onClick={toggleFullscreen}>
                                        {isFullscreen ? (
                                            <>
                                                Exit Full Screen
                                                <Minimize2 className="ml-2 h-4 w-4" />
                                            </>
                                        ) : (
                                            <>
                                                Full Screen
                                                <Maximize2 className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                                    <div className="whitespace-pre-wrap rounded-2xl border bg-muted/20 p-5 text-sm leading-7">
                                        {activeLesson.content || 'No text content available for this lesson.'}
                                    </div>
                                ) : activeLesson?.type === 'QUIZ' ? (
                                    <div className="rounded-2xl border bg-muted/20 p-5">
                                        <p className="text-muted-foreground">This is a quiz lesson. Add quiz UI here.</p>
                                    </div>
                                ) : activeLesson?.type === 'ASSIGNMENT' ? (
                                    <div className="rounded-2xl border bg-muted/20 p-5">
                                        <p className="text-muted-foreground">This is an assignment lesson. Add submission UI here.</p>
                                    </div>
                                ) : activeLesson?.type === 'LIVE_SESSION' ? (
                                    <div className="rounded-2xl border bg-muted/20 p-5">
                                        <p className="text-muted-foreground">This lesson is a live session. Add meeting link / schedule here.</p>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border bg-muted/20 p-5">
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
                                        <CheckCircle2 className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}