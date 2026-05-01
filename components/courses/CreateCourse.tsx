'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CircleHelp,
    ClipboardList,
    CloudUpload,
    DollarSign,
    FileText,
    Globe,
    Image as ImageIcon,
    Link2,
    Loader2,
    Plus,
    Save,
    Sparkles,
    Trash2,
    Upload,
    Users,
    Clock,
    Video,
    Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CourseFormData {
    title: string;
    shortDescription: string;
    description: string;
    thumbnail: string;
    price: number;
    discountPrice: number | null;
    currency: string;
    language: string;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    duration: number | null;
    categoryId: string;
    objectives: string[];
    requirements: string[];
    targetAudience: string[];
    tags: string[];
    metaTitle: string;
    metaDescription: string;
}

type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';
type VideoSourceType = 'URL' | 'UPLOAD';
type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY' | 'CHECKBOX';
type CalendarProvider = 'NONE' | 'GOOGLE' | 'MICROSOFT';

interface QuizOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface QuizQuestion {
    id: string;
    question: string;
    type: QuestionType;
    points: number;
    options: QuizOption[];
    answerText: string;
}

interface AssignmentQuestion {
    id: string;
    title: string;
    type: QuestionType;
    points: number;
    options: QuizOption[];
    answerText: string;
}

interface LiveSessionData {
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number;
    meetingLink: string;
    calendarProvider: CalendarProvider;
}

interface Lesson {
    id?: string;
    title: string;
    description: string;
    content: string;
    type: LessonType;
    isFree: boolean;
    videoUrl: string;
    videoFileUrl: string;
    videoSourceType: VideoSourceType;
    videoDuration: number | null;
    quizQuestions: QuizQuestion[];
    assignmentQuestions: AssignmentQuestion[];
    liveSession: LiveSessionData;
}

interface Module {
    id?: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

const createQuizOption = (): QuizOption => ({
    id: crypto.randomUUID(),
    text: '',
    isCorrect: false,
});

const createQuizQuestion = (): QuizQuestion => ({
    id: crypto.randomUUID(),
    question: '',
    type: 'MULTIPLE_CHOICE',
    points: 1,
    options: [createQuizOption(), createQuizOption()],
    answerText: '',
});

const createAssignmentQuestion = (): AssignmentQuestion => ({
    id: crypto.randomUUID(),
    title: '',
    type: 'SHORT_ANSWER',
    points: 1,
    options: [createQuizOption(), createQuizOption()],
    answerText: '',
});

const createLiveSessionData = (): LiveSessionData => ({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    meetingLink: '',
    calendarProvider: 'NONE',
});

const createLesson = (): Lesson => ({
    title: '',
    description: '',
    content: '',
    type: 'VIDEO',
    isFree: false,
    videoUrl: '',
    videoFileUrl: '',
    videoSourceType: 'URL',
    videoDuration: null,
    quizQuestions: [createQuizQuestion()],
    assignmentQuestions: [createAssignmentQuestion()],
    liveSession: createLiveSessionData(),
});

const createModule = (): Module => ({
    title: '',
    description: '',
    lessons: [createLesson()],
});

export default function CreateCourse() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [categories, setCategories] = useState<any[]>([]);
    const [availableTags, setAvailableTags] = useState<any[]>([]);

    const [courseData, setCourseData] = useState<CourseFormData>({
        title: '',
        shortDescription: '',
        description: '',
        thumbnail: '',
        price: 0,
        discountPrice: null,
        currency: 'USD',
        language: 'en',
        level: 'BEGINNER',
        duration: null,
        categoryId: '',
        objectives: [''],
        requirements: [''],
        targetAudience: [''],
        tags: [],
        metaTitle: '',
        metaDescription: '',
    });

    const [modules, setModules] = useState<Module[]>([createModule()]);

    useEffect(() => {
        void fetchCategories();
        void fetchTags();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await fetch('/api/tags');
            const data = await response.json();
            setAvailableTags(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch tags:', error);
        }
    };

    const handleInputChange = <K extends keyof CourseFormData>(field: K, value: CourseFormData[K]) => {
        setCourseData((prev) => ({ ...prev, [field]: value }));
    };

    const handleArrayFieldChange = (
        field: keyof Pick<CourseFormData, 'objectives' | 'requirements' | 'targetAudience'>,
        index: number,
        value: string
    ) => {
        setCourseData((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) => (i === index ? value : item)),
        }));
    };

    const addArrayField = (field: keyof Pick<CourseFormData, 'objectives' | 'requirements' | 'targetAudience'>) => {
        setCourseData((prev) => ({
            ...prev,
            [field]: [...prev[field], ''],
        }));
    };

    const removeArrayField = (
        field: keyof Pick<CourseFormData, 'objectives' | 'requirements' | 'targetAudience'>,
        index: number
    ) => {
        setCourseData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const addModule = () => {
        setModules((prev) => [...prev, createModule()]);
    };

    const removeModule = (index: number) => {
        setModules((prev) => prev.filter((_, i) => i !== index));
    };

    const updateModule = (index: number, field: keyof Module, value: any) => {
        setModules((prev) => prev.map((module, i) => (i === index ? { ...module, [field]: value } : module)));
    };

    const addLesson = (moduleIndex: number) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                        ...module,
                        lessons: [...module.lessons, createLesson()],
                    }
                    : module
            )
        );
    };

    const removeLesson = (moduleIndex: number, lessonIndex: number) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.filter((_, j) => j !== lessonIndex),
                    }
                    : module
            )
        );
    };

    const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, value: any) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.map((lesson, j) =>
                            j === lessonIndex ? { ...lesson, [field]: value } : lesson
                        ),
                    }
                    : module
            )
        );
    };

    const updateQuizQuestion = (
        moduleIndex: number,
        lessonIndex: number,
        questionIndex: number,
        field: keyof QuizQuestion,
        value: any
    ) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.map((lesson, j) =>
                            j === lessonIndex
                                ? {
                                    ...lesson,
                                    quizQuestions: lesson.quizQuestions.map((question, k) =>
                                        k === questionIndex ? { ...question, [field]: value } : question
                                    ),
                                }
                                : lesson
                        ),
                    }
                    : module
            )
        );
    };

    const updateAssignmentQuestion = (
        moduleIndex: number,
        lessonIndex: number,
        questionIndex: number,
        field: keyof AssignmentQuestion,
        value: any
    ) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.map((lesson, j) =>
                            j === lessonIndex
                                ? {
                                    ...lesson,
                                    assignmentQuestions: lesson.assignmentQuestions.map((question, k) =>
                                        k === questionIndex ? { ...question, [field]: value } : question
                                    ),
                                }
                                : lesson
                        ),
                    }
                    : module
            )
        );
    };

    const addQuizQuestion = (moduleIndex: number, lessonIndex: number) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.map((lesson, j) =>
                            j === lessonIndex
                                ? {
                                    ...lesson,
                                    quizQuestions: [...lesson.quizQuestions, createQuizQuestion()],
                                }
                                : lesson
                        ),
                    }
                    : module
            )
        );
    };

    const addAssignmentQuestion = (moduleIndex: number, lessonIndex: number) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.map((lesson, j) =>
                            j === lessonIndex
                                ? {
                                    ...lesson,
                                    assignmentQuestions: [...lesson.assignmentQuestions, createAssignmentQuestion()],
                                }
                                : lesson
                        ),
                    }
                    : module
            )
        );
    };

    const removeQuizQuestion = (moduleIndex: number, lessonIndex: number, questionIndex: number) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.map((lesson, j) =>
                            j === lessonIndex
                                ? {
                                    ...lesson,
                                    quizQuestions: lesson.quizQuestions.filter((_, k) => k !== questionIndex),
                                }
                                : lesson
                        ),
                    }
                    : module
            )
        );
    };

    const removeAssignmentQuestion = (moduleIndex: number, lessonIndex: number, questionIndex: number) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                        ...module,
                        lessons: module.lessons.map((lesson, j) =>
                            j === lessonIndex
                                ? {
                                    ...lesson,
                                    assignmentQuestions: lesson.assignmentQuestions.filter((_, k) => k !== questionIndex),
                                }
                                : lesson
                        ),
                    }
                    : module
            )
        );
    };

    const handleVideoUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        moduleIndex: number,
        lessonIndex: number
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            alert('Please select a video file');
            return;
        }

        if (file.size > 500 * 1024 * 1024) {
            alert('Video must be smaller than 500MB');
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/uploads/video', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || 'Video upload failed');
            }

            updateLesson(moduleIndex, lessonIndex, 'videoFileUrl', data.url);
            updateLesson(moduleIndex, lessonIndex, 'videoSourceType', 'UPLOAD');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setThumbnailPreview(result);
                handleInputChange('thumbnail', result);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleTagToggle = (tagId: string) => {
        setCourseData((prev) => ({
            ...prev,
            tags: prev.tags.includes(tagId) ? prev.tags.filter((id) => id !== tagId) : [...prev.tags, tagId],
        }));
    };

    const validateCourseData = () => {
        if (!courseData.title.trim()) {
            alert('Please enter a course title');
            return false;
        }
        if (!courseData.categoryId) {
            alert('Please select a category');
            return false;
        }
        if (!courseData.shortDescription.trim()) {
            alert('Please enter a short description');
            return false;
        }
        if (!courseData.description.trim()) {
            alert('Please enter a full course description');
            return false;
        }
        if (modules.length === 0 || !modules[0].title.trim()) {
            alert('Please add at least one module');
            return false;
        }

        const hasInvalidLesson = modules.some((module) =>
            module.lessons.some((lesson) => {
                if (!lesson.title.trim()) return true;

                if (lesson.type === 'VIDEO') {
                    const hasVideoUrl = lesson.videoSourceType === 'URL' && !lesson.videoUrl.trim();
                    const hasUploadedVideo = lesson.videoSourceType === 'UPLOAD' && !lesson.videoFileUrl.trim();
                    return hasVideoUrl || hasUploadedVideo;
                }

                if (lesson.type === 'QUIZ') {
                    return (
                        lesson.quizQuestions.length === 0 ||
                        lesson.quizQuestions.some(
                            (q) =>
                                !q.question.trim() ||
                                ((q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX') &&
                                    q.options.filter((opt) => opt.text.trim()).length < 2)
                        )
                    );
                }

                if (lesson.type === 'ASSIGNMENT') {
                    return (
                        lesson.assignmentQuestions.length === 0 ||
                        lesson.assignmentQuestions.some(
                            (q) =>
                                !q.title.trim() ||
                                ((q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX') &&
                                    q.options.filter((opt) => opt.text.trim()).length < 2)
                        )
                    );
                }

                if (lesson.type === 'LIVE_SESSION') {
                    return (
                        !lesson.liveSession.title.trim() ||
                        !lesson.liveSession.date ||
                        !lesson.liveSession.time ||
                        lesson.liveSession.duration < 15
                    );
                }

                return false;
            })
        );

        if (hasInvalidLesson) {
            alert('Please complete all lesson fields before saving');
            return false;
        }

        return true;
    };

    const serializeModules = () => {
        return modules.map((module, moduleIndex) => ({
            title: module.title.trim(),
            description: module.description.trim() || null,
            sortOrder: moduleIndex,
            lessons: module.lessons.map((lesson, lessonIndex) => {
                const videoUrl =
                    lesson.type === 'VIDEO'
                        ? lesson.videoSourceType === 'UPLOAD'
                            ? lesson.videoFileUrl.trim()
                            : lesson.videoUrl.trim()
                        : null;

                return {
                    title: lesson.title.trim(),
                    description: lesson.description.trim() || null,
                    content: lesson.content.trim() || null,
                    videoUrl,
                    videoDuration: lesson.videoDuration,
                    type: lesson.type,
                    isFree: lesson.isFree,
                    sortOrder: lessonIndex,
                    quizQuestions:
                        lesson.type === 'QUIZ'
                            ? lesson.quizQuestions.map((question, questionIndex) => ({
                                question: question.question.trim(),
                                type: question.type,
                                points: question.points,
                                answerText: question.answerText.trim() || null,
                                sortOrder: questionIndex,
                                options: question.options
                                    .filter((option) => option.text.trim())
                                    .map((option, optionIndex) => ({
                                        text: option.text.trim(),
                                        isCorrect: option.isCorrect,
                                        sortOrder: optionIndex,
                                    })),
                            }))
                            : [],
                    assignmentQuestions:
                        lesson.type === 'ASSIGNMENT'
                            ? lesson.assignmentQuestions.map((question, questionIndex) => ({
                                title: question.title.trim(),
                                type: question.type,
                                points: question.points,
                                answerText: question.answerText.trim() || null,
                                sortOrder: questionIndex,
                                options: question.options
                                    .filter((option) => option.text.trim())
                                    .map((option, optionIndex) => ({
                                        text: option.text.trim(),
                                        isCorrect: option.isCorrect,
                                        sortOrder: optionIndex,
                                    })),
                            }))
                            : [],
                    liveSession:
                        lesson.type === 'LIVE_SESSION'
                            ? {
                                title: lesson.liveSession.title.trim(),
                                description: lesson.liveSession.description.trim() || null,
                                date: lesson.liveSession.date,
                                time: lesson.liveSession.time,
                                duration: lesson.liveSession.duration,
                                meetingLink: lesson.liveSession.meetingLink.trim() || null,
                                calendarProvider: lesson.liveSession.calendarProvider,
                            }
                            : null,
                };
            }),
        }));
    };

    const saveCourse = async (status: 'DRAFT' | 'UNDER_REVIEW') => {
        if (!validateCourseData()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...courseData,
                    modules: serializeModules(),
                    status,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(status === 'DRAFT' ? 'Course saved as draft successfully!' : 'Course submitted for review successfully!');
                router.push('/instructor/courses');
            } else {
                alert(`Failed to save course: ${data.error || 'Unknown error'}`);
                console.error('Error:', data);
            }
        } catch (error) {
            console.error('Failed to save course:', error);
            alert('Failed to save course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: 'Basic Info', description: 'Course title, description, and basics' },
        { id: 2, title: 'Pricing & Details', description: 'Price, level, and requirements' },
        { id: 3, title: 'Course Content', description: 'Modules and lessons' },
        { id: 4, title: 'Review & Publish', description: 'Final review before publishing' },
    ];

    const selectedCategory = useMemo(
        () => categories.find((category) => category.id === courseData.categoryId),
        [categories, courseData.categoryId]
    );

    const renderQuestionOptions = (
        moduleIndex: number,
        lessonIndex: number,
        question: QuizQuestion | AssignmentQuestion,
        questionIndex: number,
        isQuiz: boolean
    ) => {
        const optionCount = question.options.length;

        return (
            <div className="space-y-2">
                <p className="text-sm font-medium">Options</p>
                {question.options.map((option, optionIndex) => (
                    <div key={option.id} className="flex items-center gap-2">
                        <input
                            type={question.type === 'MULTIPLE_CHOICE' ? 'radio' : 'checkbox'}
                            name={`${isQuiz ? 'quiz' : 'assignment'}-${moduleIndex}-${lessonIndex}-${questionIndex}`}
                            checked={option.isCorrect}
                            onChange={(e) => {
                                const nextOptions = question.options.map((opt, idx) => ({
                                    ...opt,
                                    isCorrect:
                                        question.type === 'MULTIPLE_CHOICE'
                                            ? idx === optionIndex
                                            : idx === optionIndex
                                                ? e.target.checked
                                                : opt.isCorrect,
                                }));

                                if (isQuiz) {
                                    updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'options', nextOptions);
                                } else {
                                    updateAssignmentQuestion(moduleIndex, lessonIndex, questionIndex, 'options', nextOptions);
                                }
                            }}
                        />
                        <Input
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option.text}
                            onChange={(e) => {
                                const nextOptions = question.options.map((opt, idx) =>
                                    idx === optionIndex ? { ...opt, text: e.target.value } : opt
                                );

                                if (isQuiz) {
                                    updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'options', nextOptions);
                                } else {
                                    updateAssignmentQuestion(moduleIndex, lessonIndex, questionIndex, 'options', nextOptions);
                                }
                            }}
                        />
                        {optionCount > 2 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const nextOptions = question.options.filter((_, idx) => idx !== optionIndex);
                                    if (isQuiz) {
                                        updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'options', nextOptions);
                                    } else {
                                        updateAssignmentQuestion(moduleIndex, lessonIndex, questionIndex, 'options', nextOptions);
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const nextOptions = [...question.options, { id: crypto.randomUUID(), text: '', isCorrect: false }];
                        if (isQuiz) {
                            updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'options', nextOptions);
                        } else {
                            updateAssignmentQuestion(moduleIndex, lessonIndex, questionIndex, 'options', nextOptions);
                        }
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                </Button>
            </div>
        );
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/instructor/courses')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Courses
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Create New Course</h1>
                        <p className="text-sm text-muted-foreground">Build and publish your course to start teaching</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => saveCourse('DRAFT')} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                    </Button>
                    <Button onClick={() => saveCourse('UNDER_REVIEW')} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Submit for Review
                    </Button>
                </div>
            </div>

            <Card className="border-border/60 shadow-sm">
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        {steps.map((step) => (
                            <button
                                key={step.id}
                                type="button"
                                onClick={() => setCurrentStep(step.id)}
                                className={cn(
                                    'rounded-2xl border p-4 text-left transition-all',
                                    currentStep === step.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:bg-muted/40'
                                )}
                            >
                                <div className="mb-2 flex items-center gap-3">
                                    <div
                                        className={cn(
                                            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                                            currentStep === step.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        )}
                                    >
                                        {step.id}
                                    </div>
                                    <div className="font-medium">{step.title}</div>
                                </div>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {currentStep === 1 && (
                <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle>Course Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Course Title *</label>
                                <Input placeholder="Enter course title" value={courseData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Short Description *</label>
                                <Input
                                    placeholder="Brief description for course cards"
                                    value={courseData.shortDescription}
                                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Description *</label>
                            <textarea
                                className="min-h-32 w-full resize-none rounded-md border border-input bg-background p-3"
                                placeholder="Detailed course description"
                                value={courseData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category *</label>
                                <select
                                    className="w-full rounded-md border border-input bg-background p-2"
                                    value={courseData.categoryId}
                                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {selectedCategory ? <p className="text-xs text-muted-foreground">Selected: {selectedCategory.name}</p> : null}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Language</label>
                                <select
                                    className="w-full rounded-md border border-input bg-background p-2"
                                    value={courseData.language}
                                    onChange={(e) => handleInputChange('language', e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="fr">French</option>
                                    <option value="rw">Kinyarwanda</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Course Thumbnail</label>
                            <div className="overflow-hidden rounded-lg border border-dashed border-border">
                                {thumbnailPreview ? (
                                    <div className="group relative">
                                        <img src={thumbnailPreview} alt="Course thumbnail" className="h-64 w-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button type="button" size="sm" variant="secondary" onClick={() => document.getElementById('thumbnail-upload')?.click()}>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Change
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    setThumbnailPreview('');
                                                    handleInputChange('thumbnail', '');
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-10 text-center">
                                        <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="mb-2 text-muted-foreground">Upload course thumbnail</p>
                                        <p className="mb-4 text-xs text-muted-foreground">Recommended: 1280x720px, Max 5MB</p>
                                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('thumbnail-upload')?.click()} disabled={uploading}>
                                            {uploading ? 'Uploading...' : 'Choose File'}
                                        </Button>
                                    </div>
                                )}

                                <input id="thumbnail-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {currentStep === 2 && (
                <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle>Pricing & Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price *</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        className="pl-9"
                                        placeholder="0.00"
                                        value={courseData.price}
                                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value || '0'))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Discount Price</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        className="pl-9"
                                        placeholder="0.00"
                                        value={courseData.discountPrice ?? ''}
                                        onChange={(e) =>
                                            handleInputChange('discountPrice', e.target.value ? parseFloat(e.target.value) : null)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Level *</label>
                                <select
                                    className="w-full rounded-md border border-input bg-background p-2"
                                    value={courseData.level}
                                    onChange={(e) => handleInputChange('level', e.target.value as CourseFormData['level'])}
                                >
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                    <option value="EXPERT">Expert</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Learning Objectives</label>
                                <p className="text-xs text-muted-foreground">What will students learn in this course?</p>
                                {courseData.objectives.map((objective, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            placeholder="Students will be able to..."
                                            value={objective}
                                            onChange={(e) => handleArrayFieldChange('objectives', index, e.target.value)}
                                        />
                                        {courseData.objectives.length > 1 && (
                                            <Button variant="ghost" size="sm" onClick={() => removeArrayField('objectives', index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addArrayField('objectives')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Objective
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Requirements</label>
                                <p className="text-xs text-muted-foreground">What do students need before taking this course?</p>
                                {courseData.requirements.map((requirement, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            placeholder="Basic knowledge of..."
                                            value={requirement}
                                            onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                                        />
                                        {courseData.requirements.length > 1 && (
                                            <Button variant="ghost" size="sm" onClick={() => removeArrayField('requirements', index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addArrayField('requirements')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Requirement
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Audience</label>
                                <p className="text-xs text-muted-foreground">Who is this course for?</p>
                                {courseData.targetAudience.map((audience, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            placeholder="Students who want to..."
                                            value={audience}
                                            onChange={(e) => handleArrayFieldChange('targetAudience', index, e.target.value)}
                                        />
                                        {courseData.targetAudience.length > 1 && (
                                            <Button variant="ghost" size="sm" onClick={() => removeArrayField('targetAudience', index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => addArrayField('targetAudience')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Target Audience
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags</label>
                            <p className="text-xs text-muted-foreground">Help students find your course</p>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant={courseData.tags.includes(tag.id) ? 'default' : 'secondary'}
                                        className="cursor-pointer"
                                        onClick={() => handleTagToggle(tag.id)}
                                    >
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {currentStep === 3 && (
                <Card className="border-border/60 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Course Content</CardTitle>
                        <Button onClick={addModule}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Module
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {modules.map((module, moduleIndex) => (
                            <Card key={moduleIndex} className="border-2">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex flex-1 items-center gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                            <span className="text-sm font-medium text-primary">{moduleIndex + 1}</span>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder="Module title"
                                                value={module.title}
                                                onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Module description"
                                                value={module.description}
                                                onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {modules.length > 1 && (
                                        <Button variant="ghost" size="sm" onClick={() => removeModule(moduleIndex)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {module.lessons.map((lesson, lessonIndex) => (
                                        <div key={lessonIndex} className="space-y-5 rounded-lg border bg-card/40 p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {lesson.type === 'VIDEO' ? (
                                                        <Video className="h-4 w-4" />
                                                    ) : lesson.type === 'TEXT' ? (
                                                        <FileText className="h-4 w-4" />
                                                    ) : lesson.type === 'QUIZ' ? (
                                                        <CircleHelp className="h-4 w-4" />
                                                    ) : lesson.type === 'ASSIGNMENT' ? (
                                                        <ClipboardList className="h-4 w-4" />
                                                    ) : (
                                                        <CalendarDays className="h-4 w-4" />
                                                    )}
                                                    <span className="text-sm font-medium">Lesson {lessonIndex + 1}</span>
                                                </div>
                                                {module.lessons.length > 1 && (
                                                    <Button variant="ghost" size="sm" onClick={() => removeLesson(moduleIndex, lessonIndex)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <Input
                                                    placeholder="Lesson title"
                                                    value={lesson.title}
                                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                                                />
                                                <select
                                                    className="rounded-md border border-input bg-background p-2"
                                                    value={lesson.type}
                                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'type', e.target.value as LessonType)}
                                                >
                                                    <option value="VIDEO">Video</option>
                                                    <option value="TEXT">Text</option>
                                                    <option value="QUIZ">Quiz</option>
                                                    <option value="ASSIGNMENT">Assignment</option>
                                                    <option value="LIVE_SESSION">Live Session</option>
                                                </select>
                                            </div>

                                            <Input
                                                placeholder="Lesson description"
                                                value={lesson.description}
                                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'description', e.target.value)}
                                            />

                                            {lesson.type === 'VIDEO' && (
                                                <div className="space-y-4 rounded-xl border p-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <Button
                                                            type="button"
                                                            variant={lesson.videoSourceType === 'URL' ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => updateLesson(moduleIndex, lessonIndex, 'videoSourceType', 'URL')}
                                                        >
                                                            <Link2 className="mr-2 h-4 w-4" />
                                                            Video URL
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant={lesson.videoSourceType === 'UPLOAD' ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => updateLesson(moduleIndex, lessonIndex, 'videoSourceType', 'UPLOAD')}
                                                        >
                                                            <CloudUpload className="mr-2 h-4 w-4" />
                                                            Upload Video
                                                        </Button>
                                                    </div>

                                                    {lesson.videoSourceType === 'URL' ? (
                                                        <Input
                                                            placeholder="Paste video URL"
                                                            value={lesson.videoUrl}
                                                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'videoUrl', e.target.value)}
                                                        />
                                                    ) : (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="file"
                                                                accept="video/*"
                                                                onChange={(e) => handleVideoUpload(e, moduleIndex, lessonIndex)}
                                                                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground hover:file:bg-primary/90"
                                                            />
                                                            {lesson.videoFileUrl && (
                                                                <p className="break-all text-xs text-muted-foreground">
                                                                    Uploaded: {lesson.videoFileUrl}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    <Input
                                                        type="number"
                                                        placeholder="Duration (minutes)"
                                                        value={lesson.videoDuration ?? ''}
                                                        onChange={(e) =>
                                                            updateLesson(
                                                                moduleIndex,
                                                                lessonIndex,
                                                                'videoDuration',
                                                                e.target.value ? parseInt(e.target.value) : null
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}

                                            {lesson.type === 'TEXT' && (
                                                <textarea
                                                    className="min-h-24 w-full resize-none rounded-md border border-input bg-background p-3"
                                                    placeholder="Lesson content"
                                                    value={lesson.content}
                                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)}
                                                />
                                            )}

                                            {lesson.type === 'QUIZ' && (
                                                <div className="space-y-4 rounded-xl border p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-semibold">Quiz Questions</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                Add multiple choice, true/false, short answer, essay, or checkbox questions.
                                                            </p>
                                                        </div>
                                                        <Button type="button" variant="outline" size="sm" onClick={() => addQuizQuestion(moduleIndex, lessonIndex)}>
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add Question
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {lesson.quizQuestions.map((question, questionIndex) => (
                                                            <div key={question.id} className="space-y-3 rounded-lg border bg-background p-4">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium">Question {questionIndex + 1}</span>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeQuizQuestion(moduleIndex, lessonIndex, questionIndex)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>

                                                                <Input
                                                                    placeholder="Enter quiz question"
                                                                    value={question.question}
                                                                    onChange={(e) =>
                                                                        updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'question', e.target.value)
                                                                    }
                                                                />

                                                                <div className="grid gap-3 md:grid-cols-3">
                                                                    <select
                                                                        className="rounded-md border border-input bg-background p-2"
                                                                        value={question.type}
                                                                        onChange={(e) =>
                                                                            updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'type', e.target.value as QuestionType)
                                                                        }
                                                                    >
                                                                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                                                        <option value="TRUE_FALSE">True / False</option>
                                                                        <option value="SHORT_ANSWER">Short Answer</option>
                                                                        <option value="ESSAY">Essay</option>
                                                                        <option value="CHECKBOX">Checkbox</option>
                                                                    </select>

                                                                    <Input
                                                                        type="number"
                                                                        min={1}
                                                                        placeholder="Points"
                                                                        value={question.points}
                                                                        onChange={(e) =>
                                                                            updateQuizQuestion(
                                                                                moduleIndex,
                                                                                lessonIndex,
                                                                                questionIndex,
                                                                                'points',
                                                                                parseInt(e.target.value || '1')
                                                                            )
                                                                        }
                                                                    />

                                                                    <Input
                                                                        placeholder="Answer hint or expected text"
                                                                        value={question.answerText}
                                                                        onChange={(e) =>
                                                                            updateQuizQuestion(moduleIndex, lessonIndex, questionIndex, 'answerText', e.target.value)
                                                                        }
                                                                    />
                                                                </div>

                                                                {(question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOX') &&
                                                                    renderQuestionOptions(moduleIndex, lessonIndex, question, questionIndex, true)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {lesson.type === 'ASSIGNMENT' && (
                                                <div className="space-y-4 rounded-xl border p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-semibold">Assignment Questions</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                Create assignment tasks based on question types.
                                                            </p>
                                                        </div>
                                                        <Button type="button" variant="outline" size="sm" onClick={() => addAssignmentQuestion(moduleIndex, lessonIndex)}>
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add Task
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {lesson.assignmentQuestions.map((question, questionIndex) => (
                                                            <div key={question.id} className="space-y-3 rounded-lg border bg-background p-4">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium">Task {questionIndex + 1}</span>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeAssignmentQuestion(moduleIndex, lessonIndex, questionIndex)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>

                                                                <Input
                                                                    placeholder="Assignment title"
                                                                    value={question.title}
                                                                    onChange={(e) =>
                                                                        updateAssignmentQuestion(
                                                                            moduleIndex,
                                                                            lessonIndex,
                                                                            questionIndex,
                                                                            'title',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />

                                                                <div className="grid gap-3 md:grid-cols-2">
                                                                    <select
                                                                        className="rounded-md border border-input bg-background p-2"
                                                                        value={question.type}
                                                                        onChange={(e) =>
                                                                            updateAssignmentQuestion(
                                                                                moduleIndex,
                                                                                lessonIndex,
                                                                                questionIndex,
                                                                                'type',
                                                                                e.target.value as QuestionType
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                                                        <option value="TRUE_FALSE">True / False</option>
                                                                        <option value="SHORT_ANSWER">Short Answer</option>
                                                                        <option value="ESSAY">Essay</option>
                                                                        <option value="CHECKBOX">Checkbox</option>
                                                                    </select>

                                                                    <Input
                                                                        type="number"
                                                                        min={1}
                                                                        placeholder="Points"
                                                                        value={question.points}
                                                                        onChange={(e) =>
                                                                            updateAssignmentQuestion(
                                                                                moduleIndex,
                                                                                lessonIndex,
                                                                                questionIndex,
                                                                                'points',
                                                                                parseInt(e.target.value || '1')
                                                                            )
                                                                        }
                                                                    />
                                                                </div>

                                                                <Input
                                                                    placeholder="Expected answer or grading note"
                                                                    value={question.answerText}
                                                                    onChange={(e) =>
                                                                        updateAssignmentQuestion(
                                                                            moduleIndex,
                                                                            lessonIndex,
                                                                            questionIndex,
                                                                            'answerText',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />

                                                                {(question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOX') &&
                                                                    renderQuestionOptions(moduleIndex, lessonIndex, question, questionIndex, false)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {lesson.type === 'LIVE_SESSION' && (
                                                <div className="space-y-4 rounded-xl border p-4">
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <Input
                                                            placeholder="Live session title"
                                                            value={lesson.liveSession.title}
                                                            onChange={(e) =>
                                                                updateLesson(moduleIndex, lessonIndex, 'liveSession', {
                                                                    ...lesson.liveSession,
                                                                    title: e.target.value,
                                                                })
                                                            }
                                                        />
                                                        <Input
                                                            placeholder="Meeting link"
                                                            value={lesson.liveSession.meetingLink}
                                                            onChange={(e) =>
                                                                updateLesson(moduleIndex, lessonIndex, 'liveSession', {
                                                                    ...lesson.liveSession,
                                                                    meetingLink: e.target.value,
                                                                })
                                                            }
                                                        />
                                                        <Input
                                                            type="date"
                                                            value={lesson.liveSession.date}
                                                            onChange={(e) =>
                                                                updateLesson(moduleIndex, lessonIndex, 'liveSession', {
                                                                    ...lesson.liveSession,
                                                                    date: e.target.value,
                                                                })
                                                            }
                                                        />
                                                        <Input
                                                            type="time"
                                                            value={lesson.liveSession.time}
                                                            onChange={(e) =>
                                                                updateLesson(moduleIndex, lessonIndex, 'liveSession', {
                                                                    ...lesson.liveSession,
                                                                    time: e.target.value,
                                                                })
                                                            }
                                                        />
                                                        <Input
                                                            type="number"
                                                            min={15}
                                                            placeholder="Duration in minutes"
                                                            value={lesson.liveSession.duration}
                                                            onChange={(e) =>
                                                                updateLesson(moduleIndex, lessonIndex, 'liveSession', {
                                                                    ...lesson.liveSession,
                                                                    duration: parseInt(e.target.value || '60'),
                                                                })
                                                            }
                                                        />
                                                        <select
                                                            className="rounded-md border border-input bg-background p-2"
                                                            value={lesson.liveSession.calendarProvider}
                                                            onChange={(e) =>
                                                                updateLesson(moduleIndex, lessonIndex, 'liveSession', {
                                                                    ...lesson.liveSession,
                                                                    calendarProvider: e.target.value as CalendarProvider,
                                                                })
                                                            }
                                                        >
                                                            <option value="NONE">No Calendar Sync</option>
                                                            <option value="GOOGLE">Google Calendar</option>
                                                            <option value="MICROSOFT">Microsoft Calendar</option>
                                                        </select>
                                                    </div>

                                                    <textarea
                                                        className="min-h-24 w-full resize-none rounded-md border border-input bg-background p-3"
                                                        placeholder="Live session description"
                                                        value={lesson.liveSession.description}
                                                        onChange={(e) =>
                                                            updateLesson(moduleIndex, lessonIndex, 'liveSession', {
                                                                ...lesson.liveSession,
                                                                description: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`free-${moduleIndex}-${lessonIndex}`}
                                                    checked={lesson.isFree}
                                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'isFree', e.target.checked)}
                                                />
                                                <label htmlFor={`free-${moduleIndex}-${lessonIndex}`} className="text-sm">
                                                    Free preview lesson
                                                </label>
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" size="sm" onClick={() => addLesson(moduleIndex)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Lesson
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}

            {currentStep === 4 && (
                <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle>Course Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                <div className="rounded-2xl border p-5">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium text-primary">Preview</span>
                                    </div>
                                    <h2 className="mt-3 text-2xl font-bold">{courseData.title || 'Untitled Course'}</h2>
                                    <p className="mt-2 text-muted-foreground">
                                        {courseData.shortDescription || 'Course short description will appear here.'}
                                    </p>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            New Course
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {courseData.duration ?? '—'} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Globe className="h-4 w-4" />
                                            {courseData.language}
                                        </span>
                                    </div>
                                </div>

                                <div className="rounded-2xl border p-5">
                                    <h3 className="mb-2 font-semibold">What you’ll learn</h3>
                                    <ul className="space-y-2">
                                        {courseData.objectives
                                            .filter((objective) => objective.trim())
                                            .map((objective, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                                                    <span>{objective}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>

                                <div className="rounded-2xl border p-5">
                                    <h3 className="mb-2 font-semibold">Course Content</h3>
                                    <div className="space-y-2">
                                        {modules.map((module, index) => (
                                            <div key={index} className="rounded-lg border p-3">
                                                <div className="font-medium">{module.title || `Module ${index + 1}`}</div>
                                                <div className="text-sm text-muted-foreground">{module.lessons.length} lessons</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="mb-3 text-2xl font-bold">
                                            {courseData.discountPrice ? (
                                                <>
                                                    <span>${courseData.discountPrice}</span>
                                                    <span className="ml-2 text-lg text-muted-foreground line-through">
                                                        ${courseData.price}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>${courseData.price}</span>
                                            )}
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Level:</span>
                                                <span className="capitalize">{courseData.level.toLowerCase()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Language:</span>
                                                <span>{courseData.language}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Modules:</span>
                                                <span>{modules.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Lessons:</span>
                                                <span>{modules.reduce((total, module) => total + module.lessons.length, 0)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {courseData.tags.length > 0 && (
                                    <div className="rounded-2xl border p-4">
                                        <h4 className="mb-2 font-medium">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {courseData.tags.map((tagId) => {
                                                const tag = availableTags.find((t) => t.id === tagId);
                                                return tag ? (
                                                    <Badge key={tagId} variant="secondary" className="text-xs">
                                                        {tag.name}
                                                    </Badge>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))} disabled={currentStep === 1}>
                    Previous
                </Button>
                <Button onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))} disabled={currentStep === 4}>
                    Next
                </Button>
            </div>
        </div>
    );
}