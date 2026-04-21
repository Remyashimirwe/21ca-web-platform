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
    CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

type SubmissionItem = {
    id: string;
    assignmentId: string;
    assignmentTitle: string;
    status: string;
    points?: number | null;
    feedback?: string | null;
    submittedAt: string;
};

type Props = {
    course: Course;
    enrollment: Enrollment;
    lessonProgress: LessonProgressItem[];
    submissions: SubmissionItem[];
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
            return <Video className="h-4 w-4" />;
        default:
            return <BookOpen className="h-4 w-4" />;
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

export default function CourseLearningPage({ course, enrollment, lessonProgress, submissions }: Props) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [activeLessonId, setActiveLessonId] = useState<string>(
        enrollment.currentLesson || course.modules?.[0]?.lessons?.[0]?.id || ''
    );
    const [saving, setSaving] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [watchTime, setWatchTime] = useState<number>(0);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]>>({});
    const [assignmentAnswers, setAssignmentAnswers] = useState<Record<string, string | string[]>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
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

    const getQuizSelected = (questionId: string): string[] => {
        const val = quizAnswers[questionId];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return [val];
        return [];
    };

    const getQuizText = (questionId: string): string => {
        const val = quizAnswers[questionId];
        if (typeof val === 'string') return val;
        return '';
    };

    const setQuizValue = (questionId: string, value: string | string[]) => {
        setQuizAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const getAssignmentSelected = (questionId: string): string[] => {
        const val = assignmentAnswers[questionId];
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return [val];
        return [];
    };

    const getAssignmentText = (questionId: string): string => {
        const val = assignmentAnswers[questionId];
        if (typeof val === 'string') return val;
        return '';
    };

    const setAssignmentValue = (questionId: string, value: string | string[]) => {
        setAssignmentAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmitQuiz = async (lesson: Lesson) => {
        if (!lesson.id) return;
        try {
            setSubmitting(true);
            const response = await fetch('/api/my-courses/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enrollmentId: enrollment.id,
                    lessonId: lesson.id,
                    type: 'QUIZ',
                    answers: quizAnswers,
                }),
            });

            if (response.ok) {
                setSubmittedIds((prev) => new Set([...prev, lesson.id]));
                await saveProgress(lesson.id, { isCompleted: true, watchTime });
            }
        } catch (error) {
            console.error('Failed to submit quiz:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitAssignment = async (lesson: Lesson) => {
        if (!lesson.id) return;
        try {
            setSubmitting(true);
            const response = await fetch('/api/my-courses/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enrollmentId: enrollment.id,
                    lessonId: lesson.id,
                    type: 'ASSIGNMENT',
                    answers: assignmentAnswers,
                }),
            });

            if (response.ok) {
                setSubmittedIds((prev) => new Set([...prev, lesson.id]));
                await saveProgress(lesson.id, { isCompleted: true, watchTime });
            }
        } catch (error) {
            console.error('Failed to submit assignment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderQuiz = (lesson: Lesson) => {
        const questions = lesson.quizQuestions || [];
        const isSubmitted = submittedIds.has(lesson.id) || completedIds.has(lesson.id);
        const submission = submissions.find(s => s.assignmentId === lesson.id || s.assignmentTitle.includes(lesson.id));

        if (!questions.length) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                        <HelpCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No Questions Available</h3>
                    <p className="text-sm text-muted-foreground">This quiz doesn't have any questions yet.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-primary">Course Quiz</h3>
                        <p className="text-sm text-muted-foreground">Answer all questions to complete this lesson.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSubmitted && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Submitted
                            </Badge>
                        )}
                        <Badge variant="outline" className="px-3 py-1">
                            {questions.length} Questions
                        </Badge>
                    </div>
                </div>

                {isSubmitted && submission && submission.status === 'GRADED' && (
                    <Card className="bg-primary/5 border-primary/20 overflow-hidden">
                        <div className="bg-primary/10 px-4 py-2 border-b border-primary/20 flex items-center justify-between">
                            <span className="text-sm font-bold text-primary flex items-center">
                                <Star className="mr-2 h-4 w-4 fill-primary" />
                                Instructor Feedback
                            </span>
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-none">
                                {submission.points} Points Earned
                            </Badge>
                        </div>
                        <CardContent className="p-4">
                            <p className="text-sm italic text-muted-foreground">
                                "{submission.feedback || "Your submission has been reviewed. Great job!"}"
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-6">
                    {questions.map((question, qIdx) => {
                        const selected = getQuizSelected(question.id);
                        const textVal = getQuizText(question.id);
                        const isCheckbox = question.type === 'CHECKBOX';
                        const isSingle = question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE';
                        const isText = question.type === 'SHORT_ANSWER' || question.type === 'ESSAY';

                        return (
                            <div key={question.id} className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div className="flex gap-4">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            {qIdx + 1}
                                        </span>
                                        <div>
                                            <h4 className="text-base font-semibold leading-tight">{question.question}</h4>
                                            <div className="mt-2 flex items-center gap-3">
                                                <Badge variant="secondary" className="bg-muted/50 text-[10px] uppercase tracking-wider">
                                                    {question.type.replace('_', ' ')}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {question.points} {question.points === 1 ? 'point' : 'points'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-12">
                                    {isText ? (
                                        <div className="grid gap-3">
                                            {question.type === 'SHORT_ANSWER' ? (
                                                <Input
                                                    placeholder="Type your answer here..."
                                                    value={textVal}
                                                    disabled={isSubmitted}
                                                    onChange={(e) => setQuizValue(question.id, e.target.value)}
                                                    className="rounded-xl border-border focus:ring-primary/20"
                                                />
                                            ) : (
                                                <Textarea
                                                    placeholder="Type your essay answer here..."
                                                    value={textVal}
                                                    disabled={isSubmitted}
                                                    onChange={(e) => setQuizValue(question.id, e.target.value)}
                                                    className="min-h-40 rounded-xl border-border focus:ring-primary/20"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid gap-3">
                                            {(question.options || []).map((option) => {
                                                const checked = selected.includes(option.id);

                                                return (
                                                    <label
                                                        key={option.id}
                                                        className={cn(
                                                            'flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all hover:bg-muted/50',
                                                            checked ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border',
                                                            isSubmitted && 'cursor-default opacity-80'
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "flex h-5 w-5 shrink-0 items-center justify-center border transition-all",
                                                            isCheckbox ? "rounded-md" : "rounded-full",
                                                            checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                                                        )}>
                                                            {checked && <div className={cn("h-2 w-2 bg-current", isCheckbox ? "" : "rounded-full")} />}
                                                        </div>
                                                        <input
                                                            type={isCheckbox ? 'checkbox' : 'radio'}
                                                            name={question.id}
                                                            checked={checked}
                                                            disabled={isSubmitted}
                                                            className="sr-only"
                                                            onChange={(e) => {
                                                                if (isSubmitted) return;
                                                                if (isCheckbox) {
                                                                    const next = e.target.checked
                                                                        ? [...selected, option.id]
                                                                        : selected.filter((id) => id !== option.id);
                                                                    setQuizValue(question.id, next);
                                                                } else if (isSingle) {
                                                                    setQuizValue(question.id, [option.id]);
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-sm font-medium">{option.text}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {question.answerText && !isSubmitted ? (
                                    <div className="mt-4 ml-12 rounded-lg bg-blue-50/50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                        <span className="font-bold">Hint:</span> {question.answerText}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        size="lg"
                        className="px-8 font-semibold shadow-lg shadow-primary/20"
                        onClick={() => handleSubmitQuiz(lesson)}
                        disabled={submitting || isSubmitted}
                    >
                        {submitting ? 'Submitting...' : isSubmitted ? 'Quiz Submitted' : 'Submit Quiz'}
                        {!submitting && !isSubmitted && <CheckCircle2 className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </div>
        );
    };

    const renderAssignment = (lesson: Lesson) => {
        const questions = lesson.assignmentQuestions || [];
        const isSubmitted = submittedIds.has(lesson.id) || completedIds.has(lesson.id);
        const submission = submissions.find(s => s.assignmentId === lesson.id || s.assignmentTitle.includes(lesson.id));

        if (!questions.length) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                        <ClipboardList className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No Assignment Content</h3>
                    <p className="text-sm text-muted-foreground">This assignment doesn't have any specific tasks yet.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-primary">Assignment Task</h3>
                        <p className="text-sm text-muted-foreground">Complete the following tasks and submit your response.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSubmitted && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Submitted
                            </Badge>
                        )}
                        <Badge variant="outline" className="px-3 py-1">
                            {questions.length} Tasks
                        </Badge>
                    </div>
                </div>

                {isSubmitted && submission && submission.status === 'GRADED' && (
                    <Card className="bg-primary/5 border-primary/20 overflow-hidden mb-6">
                        <div className="bg-primary/10 px-4 py-2 border-b border-primary/20 flex items-center justify-between">
                            <span className="text-sm font-bold text-primary flex items-center">
                                <Star className="mr-2 h-4 w-4 fill-primary" />
                                Instructor Feedback
                            </span>
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-none">
                                {submission.points} Points Earned
                            </Badge>
                        </div>
                        <CardContent className="p-4">
                            <p className="text-sm italic text-muted-foreground">
                                "{submission.feedback || "Your assignment has been graded. Well done!"}"
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-6">
                    {questions.map((question, qIdx) => {
                        const selected = getAssignmentSelected(question.id);
                        const textVal = getAssignmentText(question.id);
                        const isCheckbox = question.type === 'CHECKBOX';
                        const isSingle = question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE';
                        const isText = question.type === 'SHORT_ANSWER' || question.type === 'ESSAY';

                        return (
                            <div key={question.id} className="rounded-2xl border bg-card p-6 shadow-sm">
                                <div className="mb-4 flex items-start gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                        {qIdx + 1}
                                    </span>
                                    <div className="space-y-1">
                                        <h4 className="text-base font-semibold">{question.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="secondary" className="bg-muted/50 text-[10px] uppercase tracking-wider">
                                                {question.type.replace('_', ' ')}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {question.points} {question.points === 1 ? 'point' : 'points'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-12">
                                    {isText ? (
                                        <Textarea
                                            className="min-h-40 rounded-xl border-border focus:ring-primary/20"
                                            placeholder="Write your detailed answer here..."
                                            value={textVal}
                                            disabled={isSubmitted}
                                            onChange={(e) =>
                                                setAssignmentValue(question.id, e.target.value)
                                            }
                                        />
                                    ) : (
                                        <div className="grid gap-3">
                                            {(question.options || []).map((option) => {
                                                const checked = selected.includes(option.id);

                                                return (
                                                    <label
                                                        key={option.id}
                                                        className={cn(
                                                            'flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all hover:bg-muted/50',
                                                            checked ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border',
                                                            isSubmitted && 'cursor-default opacity-80'
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "flex h-5 w-5 shrink-0 items-center justify-center border transition-all",
                                                            isCheckbox ? "rounded-md" : "rounded-full",
                                                            checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                                                        )}>
                                                            {checked && <div className={cn("h-2 w-2 bg-current", isCheckbox ? "" : "rounded-full")} />}
                                                        </div>
                                                        <input
                                                            type={isCheckbox ? 'checkbox' : 'radio'}
                                                            name={question.id}
                                                            checked={checked}
                                                            disabled={isSubmitted}
                                                            className="sr-only"
                                                            onChange={(e) => {
                                                                if (isSubmitted) return;
                                                                if (isCheckbox) {
                                                                    const next = e.target.checked
                                                                        ? [...selected, option.id]
                                                                        : selected.filter((id) => id !== option.id);
                                                                    setAssignmentValue(question.id, next);
                                                                } else if (isSingle) {
                                                                    setAssignmentValue(question.id, [option.id]);
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-sm font-medium">{option.text}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {question.answerText ? (
                                    <div className="mt-4 ml-12 rounded-lg bg-blue-50/50 p-4 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                        <span className="font-bold">Grading Criteria:</span> {question.answerText}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        size="lg"
                        className="px-8 font-semibold shadow-lg shadow-primary/20"
                        onClick={() => handleSubmitAssignment(lesson)}
                        disabled={submitting || isSubmitted}
                    >
                        {submitting ? 'Submitting...' : isSubmitted ? 'Assignment Submitted' : 'Submit Assignment'}
                        {!submitting && !isSubmitted && <CheckCircle2 className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </div>
        );
    };

    const renderLiveSession = (lesson: Lesson) => {
        const session = lesson.liveSession;
        if (!session) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                        <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No Session Details</h3>
                    <p className="text-sm text-muted-foreground">The details for this live session haven't been set yet.</p>
                </div>
            );
        }

        const sessionDate = new Date(session.date);
        const isPast = sessionDate < new Date();

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-primary">Live Session</h3>
                        <p className="text-sm text-muted-foreground">Join the live session at the scheduled time.</p>
                    </div>
                    <Badge
                        variant={isPast ? 'secondary' : 'outline'}
                        className={cn("px-3 py-1", !isPast && "text-primary animate-pulse")}
                    >
                        {isPast ? 'Past Session' : 'Upcoming'}
                    </Badge>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xl font-bold">{session.title}</h4>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{session.description || 'Live session for this lesson.'}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <CalendarDays className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="font-medium">{sessionDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Clock className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="font-medium">{session.time} ({session.duration} mins)</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 p-6 text-center">
                            <Video className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            {session.meetingLink ? (
                                <div className="w-full space-y-3">
                                    <p className="text-xs text-muted-foreground">Your meeting is ready</p>
                                    <Button className="w-full" asChild>
                                        <a href={session.meetingLink.startsWith('http') ? session.meetingLink : `https://${session.meetingLink}`} target="_blank" rel="noopener noreferrer">
                                            Join Meeting
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                    <p className="text-[10px] text-muted-foreground italic">Powered by {session.calendarProvider !== 'NONE' ? getCalendarLabel(session.calendarProvider) : 'Internal Session'}</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <p className="font-medium">Link Not Available</p>
                                    <p className="text-xs text-muted-foreground">The meeting link will appear here before the session starts.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="px-8"
                        onClick={() => void saveProgress(lesson.id, { isCompleted: true, watchTime })}
                    >
                        Mark Session as Attended
                    </Button>
                </div>
            </div>
        );
    };

    const videoSource = getVideoSource(activeLesson?.videoUrl || null);

    return (
        <div
            className={cn(
                'min-h-screen w-full bg-background',
                isFullscreen && 'fixed inset-0 z-50 overflow-auto bg-background'
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={cn(isFullscreen && 'text-white')}
                        >
                            <Layers3 className="h-4 w-4" />
                        </Button>
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

            <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6">
                <main className={cn("flex-1 space-y-6 transition-all duration-300", !sidebarOpen && "max-w-4xl mx-auto w-full")}>
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

                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="hidden lg:flex"
                                >
                                    <Layers3 className="mr-2 h-4 w-4" />
                                    {sidebarOpen ? 'Hide Content' : 'Show Content'}
                                </Button>
                                <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {course.duration ? `${course.duration} minutes` : 'Self paced'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Layers3 className="h-4 w-4" />
                                        {modules.length} modules
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {activeLesson?.type === 'TEXT' ? (
                                    <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-2xl border bg-card p-8 leading-relaxed shadow-sm">
                                        <div className="mb-6 flex items-center justify-between border-b pb-4">
                                            <h3 className="text-lg font-semibold text-primary">Lesson Content</h3>
                                            <Badge variant="outline">Text Lesson</Badge>
                                        </div>
                                        {activeLesson.content || 'No text content available for this lesson.'}
                                    </div>
                                ) : activeLesson?.type === 'QUIZ' ? (
                                    <div className="rounded-2xl border bg-muted/10 p-2 md:p-6">{renderQuiz(activeLesson)}</div>
                                ) : activeLesson?.type === 'ASSIGNMENT' ? (
                                    <div className="rounded-2xl border bg-muted/10 p-2 md:p-6">{renderAssignment(activeLesson)}</div>
                                ) : activeLesson?.type === 'LIVE_SESSION' ? (
                                    <div className="rounded-2xl border bg-muted/10 p-2 md:p-6">{renderLiveSession(activeLesson)}</div>
                                ) : (
                                    <div className="rounded-2xl border bg-card p-8 shadow-sm">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="mb-4 rounded-full bg-primary/5 p-4">
                                                {activeLesson?.videoUrl ? <Video className="h-8 w-8 text-primary" /> : <BookOpen className="h-8 w-8 text-primary" />}
                                            </div>
                                            <p className="max-w-md text-muted-foreground">
                                                {activeLesson?.videoUrl
                                                    ? 'Watch the video lesson above. Once you are finished, mark it as complete below.'
                                                    : 'Select a lesson from the sidebar to begin your learning journey.'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!['QUIZ', 'ASSIGNMENT', 'LIVE_SESSION'].includes(activeLesson?.type || '') && (
                                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                                        <Button
                                            size="lg"
                                            className="px-8 font-semibold shadow-lg shadow-primary/20"
                                            onClick={markComplete}
                                            disabled={saving || !activeLesson}
                                        >
                                            {saving ? 'Saving...' : 'Mark as Complete'}
                                            <CheckCircle2 className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
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
                                                            'flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200',
                                                            active 
                                                                ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20' 
                                                                : 'border-transparent hover:bg-muted/40 hover:border-border'
                                                        )}
                                                    >
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <span className={cn(
                                                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                                                                completed ? "bg-green-100 text-green-600" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                                            )}>
                                                                {completed ? (
                                                                    <CheckCircle2 className="h-5 w-5" />
                                                                ) : (
                                                                    getLessonIcon(lesson.type)
                                                                )}
                                                            </span>
                                                            <div className="min-w-0">
                                                                <div className={cn(
                                                                    "truncate text-sm font-semibold",
                                                                    active ? "text-primary" : "text-foreground"
                                                                )}>
                                                                    {lesson.title}
                                                                </div>
                                                                <div className="flex items-center gap-2 truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                                    {lesson.type.replace('_', ' ')}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {lesson.isFree && !completed ? <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none h-5 px-1.5 text-[10px]">Free</Badge> : null}
                                                            {!completed && !lesson.isFree && <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />}
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

                {sidebarOpen && (
                    <aside className="hidden w-80 shrink-0 space-y-6 lg:block">
                        <Card className="sticky top-24 border-border/60 shadow-md max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
                            <CardContent className="p-0 overflow-hidden flex flex-col h-full">
                                <div className="p-6 border-b">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        Course Content
                                    </h3>
                                    <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary transition-all duration-500" 
                                            style={{ width: `${courseCompletion}%` }}
                                        />
                                    </div>
                                    <p className="mt-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                        {courseCompletion}% Completed
                                    </p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {modules.map((mod, index) => (
                                        <div key={mod.id} className="space-y-2">
                                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
                                                Module {index + 1}: {mod.title}
                                            </h4>
                                            <div className="space-y-1">
                                                {(mod.lessons || []).map((lesson) => {
                                                    const completed = completedIds.has(lesson.id);
                                                    const active = lesson.id === activeLesson?.id;

                                                    return (
                                                        <button
                                                            key={lesson.id}
                                                            type="button"
                                                            onClick={() => goToLesson(lesson.id)}
                                                            className={cn(
                                                                'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 group',
                                                                active 
                                                                    ? 'bg-primary/10 text-primary' 
                                                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                                            )}
                                                        >
                                                            <div className="flex min-w-0 items-center gap-3">
                                                                <span className={cn(
                                                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                                                                    completed ? "text-green-500" : active ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground"
                                                                )}>
                                                                    {completed ? (
                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                    ) : (
                                                                        getLessonIcon(lesson.type)
                                                                    )}
                                                                </span>
                                                                <div className="min-w-0">
                                                                    <div className={cn(
                                                                        "truncate text-xs font-semibold",
                                                                        active ? "text-primary" : "text-foreground/80"
                                                                    )}>
                                                                        {lesson.title}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {lesson.isFree && !completed && <Badge className="bg-blue-100 text-blue-700 h-4 px-1 text-[8px]">Free</Badge>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                )}
            </div>
        </div>
    );
}