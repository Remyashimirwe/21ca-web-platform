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
    ExternalLink,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';
type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY' | 'CHECKBOX';
type CalendarProvider = 'NONE' | 'GOOGLE' | 'MICROSOFT';

type QuizOption = {
    id: string;
    text: string;
    isCorrect: boolean;
    sortOrder?: number | null;
};

type QuizQuestion = {
    id: string;
    question: string;
    type: QuestionType;
    points: number;
    answerText?: string | null;
    sortOrder?: number | null;
    options?: QuizOption[];
};

type AssignmentOption = {
    id: string;
    text: string;
    isCorrect: boolean;
    sortOrder?: number | null;
};

type AssignmentQuestion = {
    id: string;
    title: string;
    type: QuestionType;
    points: number;
    answerText?: string | null;
    sortOrder?: number | null;
    options?: AssignmentOption[];
};

type LiveSession = {
    id: string;
    title: string;
    description?: string | null;
    date: string | Date;
    time: string;
    duration: number;
    meetingLink?: string | null;
    calendarProvider: CalendarProvider;
};

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
    quizQuestions?: QuizQuestion[];
    assignmentQuestions?: AssignmentQuestion[];
    liveSession?: LiveSession | null;
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

type VideoSource =
    | { kind: 'html5'; url: string }
    | { kind: 'youtube'; url: string; embedUrl: string }
    | { kind: 'vimeo'; url: string; embedUrl: string }
    | { kind: 'cloudinary'; url: string }
    | { kind: 'unknown'; url: string };

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

function getCalendarLabel(provider?: CalendarProvider | null) {
    switch (provider) {
        case 'GOOGLE':
            return 'Google Calendar';
        case 'MICROSOFT':
            return 'Microsoft Calendar';
        default:
            return 'No Calendar Sync';
    }
}

function extractYouTubeId(url: string) {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace('www.', '');

        if (host === 'youtu.be') {
            return parsed.pathname.replace('/', '') || null;
        }

        if (host.includes('youtube.com')) {
            const v = parsed.searchParams.get('v');
            if (v) return v;

            const pathMatch = parsed.pathname.match(/\/embed\/([^/]+)/);
            if (pathMatch?.[1]) return pathMatch[1];

            const shortsMatch = parsed.pathname.match(/\/shorts\/([^/]+)/);
            if (shortsMatch?.[1]) return shortsMatch[1];
        }

        return null;
    } catch {
        return null;
    }
}

function extractVimeoId(url: string) {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace('www.', '');

        if (!host.includes('vimeo.com')) return null;

        const pathMatch = parsed.pathname.match(/\/(\d+)/);
        return pathMatch?.[1] || null;
    } catch {
        return null;
    }
}

function getVideoSource(url?: string | null): VideoSource | null {
    if (!url) return null;

    const trimmed = url.trim();
    if (!trimmed) return null;

    const lowered = trimmed.toLowerCase();

    if (
        lowered.startsWith('http://') ||
        lowered.startsWith('https://') ||
        lowered.startsWith('blob:') ||
        lowered.startsWith('data:')
    ) {
        const youtubeId = extractYouTubeId(trimmed);
        if (youtubeId) {
            return {
                kind: 'youtube',
                url: trimmed,
                embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`,
            };
        }

        const vimeoId = extractVimeoId(trimmed);
        if (vimeoId) {
            return {
                kind: 'vimeo',
                url: trimmed,
                embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
            };
        }

        if (
            lowered.includes('res.cloudinary.com') ||
            lowered.includes('cloudinary.com')
        ) {
            return { kind: 'cloudinary', url: trimmed };
        }

        const isVideoFile =
            lowered.includes('.mp4') ||
            lowered.includes('.webm') ||
            lowered.includes('.ogg') ||
            lowered.includes('.mov') ||
            lowered.includes('.m3u8');

        if (isVideoFile) {
            return { kind: 'html5', url: trimmed };
        }

        return { kind: 'unknown', url: trimmed };
    }

    if (trimmed.startsWith('/')) {
        return { kind: 'html5', url: trimmed };
    }

    return { kind: 'html5', url: `/${trimmed}` };
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
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string[]>>({});
    const [assignmentText, setAssignmentText] = useState<Record<string, string>>({});
    const [videoError, setVideoError] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);

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

    useEffect(() => {
        if (!activeLesson?.id) return;
        setWatchTime(Number(watchedMap.get(activeLesson.id) ?? 0));
    }, [activeLesson?.id, watchedMap]);

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

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

    const goToLesson = async (lessonId: string) => {
        if (activeLesson?.id) {
            await saveProgress(activeLesson.id, { watchTime });
        }
        setActiveLessonId(lessonId);
        setVideoError(false);
        setIsVideoReady(false);
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

    const getQuizSelected = (questionId: string) => quizAnswers[questionId] || [];
    const setQuizSelected = (questionId: string, values: string[]) => {
        setQuizAnswers((prev) => ({ ...prev, [questionId]: values }));
    };

    const renderQuiz = (lesson: Lesson) => {
        const questions = lesson.quizQuestions || [];
        if (!questions.length) {
            return <p className="text-muted-foreground">No quiz questions available.</p>;
        }

        return (
            <div className="space-y-4">
                {questions.map((question) => {
                    const selected = getQuizSelected(question.id);
                    const isCheckbox = question.type === 'CHECKBOX';
                    const isSingle = question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE';

                    return (
                        <div key={question.id} className="rounded-2xl border bg-background p-4">
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div>
                                    <h4 className="font-semibold">{question.question}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {question.type.replace('_', ' ')} · {question.points} point(s)
                                    </p>
                                </div>
                                <Badge variant="secondary">Quiz</Badge>
                            </div>

                            <div className="space-y-2">
                                {(question.options || []).map((option) => {
                                    const checked = selected.includes(option.id);

                                    return (
                                        <label
                                            key={option.id}
                                            className="flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 hover:bg-muted/30"
                                        >
                                            <input
                                                type={isCheckbox ? 'checkbox' : 'radio'}
                                                name={question.id}
                                                checked={checked}
                                                onChange={(e) => {
                                                    if (isCheckbox) {
                                                        const next = e.target.checked
                                                            ? [...selected, option.id]
                                                            : selected.filter((id) => id !== option.id);
                                                        setQuizSelected(question.id, next);
                                                    } else if (isSingle) {
                                                        setQuizSelected(question.id, [option.id]);
                                                    }
                                                }}
                                            />
                                            <span>{option.text}</span>
                                        </label>
                                    );
                                })}
                            </div>

                            {question.answerText ? (
                                <p className="mt-3 text-xs text-muted-foreground">
                                    Hint: {question.answerText}
                                </p>
                            ) : null}
                        </div>
                    );
                })}

                <Button onClick={() => void saveProgress(lesson.id, { isCompleted: true, watchTime })}>
                    Submit Quiz
                </Button>
            </div>
        );
    };

    const renderAssignment = (lesson: Lesson) => {
        const questions = lesson.assignmentQuestions || [];
        if (!questions.length) {
            return <p className="text-muted-foreground">No assignment questions available.</p>;
        }

        return (
            <div className="space-y-4">
                {questions.map((question) => (
                    <div key={question.id} className="rounded-2xl border bg-background p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                                <h4 className="font-semibold">{question.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {question.type.replace('_', ' ')} · {question.points} point(s)
                                </p>
                            </div>
                            <Badge variant="secondary">Assignment</Badge>
                        </div>

                        <textarea
                            className="min-h-32 w-full rounded-xl border bg-background p-3 text-sm"
                            placeholder="Write your answer here..."
                            value={assignmentText[question.id] || ''}
                            onChange={(e) =>
                                setAssignmentText((prev) => ({ ...prev, [question.id]: e.target.value }))
                            }
                        />

                        {question.answerText ? (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Grading note: {question.answerText}
                            </p>
                        ) : null}
                    </div>
                ))}

                <Button onClick={() => void saveProgress(lesson.id, { isCompleted: true, watchTime })}>
                    Submit Assignment
                </Button>
            </div>
        );
    };

    const renderLiveSession = (lesson: Lesson) => {
        const session = lesson.liveSession;
        if (!session) {
            return <p className="text-muted-foreground">No live session details available.</p>;
        }

        return (
            <div className="space-y-4 rounded-2xl border bg-background p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-bold">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {session.description || 'Live session for this lesson.'}
                        </p>
                    </div>
                    <Badge variant="secondary">{getCalendarLabel(session.calendarProvider)}</Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-medium">{session.time}</p>
                    </div>
                    <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium">{session.duration} minutes</p>
                    </div>
                    <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground">Meeting Link</p>
                        {session.meetingLink ? (
                            <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-primary underline"
                            >
                                Join session
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        ) : (
                            <p className="font-medium">Not available</p>
                        )}
                    </div>
                </div>

                <Button onClick={() => void saveProgress(lesson.id, { isCompleted: true, watchTime })}>
                    Mark Live Session as Attended
                </Button>
            </div>
        );
    };

    const videoSource = getVideoSource(activeLesson?.videoUrl || null);

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
                            className={cn('shrink-0', isFullscreen && 'text-white hover:bg-white/10 hover:text-white')}
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

                                {activeLesson?.type === 'VIDEO' ? (
                                    videoSource ? (
                                        videoError ? (
                                            <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                                                    <AlertCircle className="h-7 w-7 text-red-500" />
                                                </div>
                                                <h2 className="text-2xl font-bold">
                                                    Video could not be played
                                                </h2>
                                                <p className="mt-2 max-w-2xl text-muted-foreground">
                                                    The video URL may be invalid or not compatible with the browser player.
                                                </p>
                                                <p className="mt-3 break-all text-xs text-muted-foreground">
                                                    {activeLesson.videoUrl}
                                                </p>
                                            </div>
                                        ) : videoSource.kind === 'youtube' || videoSource.kind === 'vimeo' ? (
                                            <iframe
                                                key={activeLesson.id}
                                                src={videoSource.embedUrl}
                                                title={activeLesson.title}
                                                className="relative z-10 h-full w-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="relative z-10 h-full w-full">
                                                {!isVideoReady ? (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                        <div className="rounded-2xl bg-background/90 px-4 py-2 text-sm shadow-md">
                                                            Loading video...
                                                        </div>
                                                    </div>
                                                ) : null}

                                                <video
                                                    key={activeLesson.id}
                                                    ref={videoRef}
                                                    controls
                                                    playsInline
                                                    preload="metadata"
                                                    className="h-full w-full bg-black object-contain"
                                                    onLoadedMetadata={() => setIsVideoReady(true)}
                                                    onCanPlay={() => setIsVideoReady(true)}
                                                    onError={() => setVideoError(true)}
                                                >
                                                    <source src={videoSource.url} />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        )
                                    ) : (
                                        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                                {activeLesson ? getLessonIcon(activeLesson.type) : <BookOpen className="h-7 w-7" />}
                                            </div>
                                            <h2 className="text-2xl font-bold">
                                                {activeLesson?.title || 'Select a lesson'}
                                            </h2>
                                            <p className="mt-2 max-w-2xl text-muted-foreground">
                                                {activeLesson?.videoUrl
                                                    ? 'The video link is not in a supported format.'
                                                    : 'Pick a lesson to start learning.'}
                                            </p>
                                        </div>
                                    )
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
                                        {completedIds.has(activeLesson?.id || '') ? (
                                            <Badge variant="secondary" className="gap-1">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Completed
                                            </Badge>
                                        ) : null}
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
                                    <div className="rounded-2xl border bg-muted/20 p-5">{renderQuiz(activeLesson)}</div>
                                ) : activeLesson?.type === 'ASSIGNMENT' ? (
                                    <div className="rounded-2xl border bg-muted/20 p-5">{renderAssignment(activeLesson)}</div>
                                ) : activeLesson?.type === 'LIVE_SESSION' ? (
                                    <div className="rounded-2xl border bg-muted/20 p-5">{renderLiveSession(activeLesson)}</div>
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

                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="mb-4 font-semibold">Course Modules</h3>
                            <div className="space-y-3">
                                {modules.map((mod, index) => (
                                    <div key={mod.id} className="rounded-2xl border p-4">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <div>
                                                <div className="font-medium">
                                                    {index + 1}. {mod.title}
                                                </div>
                                                {mod.description ? (
                                                    <p className="text-sm text-muted-foreground">{mod.description}</p>
                                                ) : null}
                                            </div>
                                            <Badge variant="outline">{mod.lessons?.length || 0} lessons</Badge>
                                        </div>

                                        <div className="space-y-2">
                                            {(mod.lessons || []).map((lesson) => {
                                                const completed = completedIds.has(lesson.id);
                                                const active = lesson.id === activeLesson?.id;

                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        type="button"
                                                        onClick={() => goToLesson(lesson.id)}
                                                        className={cn(
                                                            'flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-colors',
                                                            active ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'
                                                        )}
                                                    >
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                                                                {completed ? (
                                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                ) : lesson.isFree ? (
                                                                    <Circle className="h-4 w-4" />
                                                                ) : (
                                                                    <Lock className="h-4 w-4" />
                                                                )}
                                                            </span>
                                                            <div className="min-w-0">
                                                                <div className="truncate font-medium">{lesson.title}</div>
                                                                <div className="truncate text-xs text-muted-foreground">
                                                                    {lesson.type.replace('_', ' ')}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {lesson.isFree ? <Badge>Free</Badge> : null}
                                                            {completed ? <Badge variant="secondary">Done</Badge> : null}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}