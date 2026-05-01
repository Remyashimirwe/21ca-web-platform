'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Eye,
    FileText,
    Globe,
    Layers3,
    Loader2,
    Plus,
    Settings2,
    Sparkles,
    Target,
    Trash2,
    Upload,
    Users,
    Video,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';

type Category = {
    id: string;
    name: string;
};

type Tag = {
    id: string;
    name: string;
};

interface Lesson {
    title: string;
    description: string;
    content: string;
    videoUrl: string;
    videoDuration: number | null;
    type: LessonType;
    isFree: boolean;
}

interface ModuleData {
    title: string;
    description: string;
    lessons: Lesson[];
}

const emptyLesson: Lesson = {
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    videoDuration: null,
    type: 'VIDEO',
    isFree: false
};

const emptyModule: ModuleData = {
    title: '',
    description: '',
    lessons: [{ ...emptyLesson }]
};

export default function CreateCourseWizard() {
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);

    const [course, setCourse] = useState({
        title: '',
        shortDescription: '',
        description: '',
        thumbnail: '',
        price: 0,
        discountPrice: null as number | null,
        currency: 'USD',
        language: 'en',
        level: 'BEGINNER' as Level,
        duration: null as number | null,
        categoryId: '',
        objectives: [''],
        requirements: [''],
        targetAudience: [''],
        tags: [] as string[],
        metaTitle: '',
        metaDescription: ''
    });

    const [modules, setModules] = useState<ModuleData[]>([{ ...emptyModule }]);

    const steps = [
        { id: 1, label: 'Basics', icon: BookOpen },
        { id: 2, label: 'Details', icon: FileText },
        { id: 3, label: 'Curriculum', icon: Layers3 },
        { id: 4, label: 'Review', icon: Eye }
    ];

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                setLoadingMeta(true);
                const [catRes, tagRes] = await Promise.all([
                    fetch('/api/categories', { cache: 'no-store' }),
                    fetch('/api/tags', { cache: 'no-store' })
                ]);

                const cats = await catRes.json();
                const tgs = await tagRes.json();

                setCategories(Array.isArray(cats) ? cats : []);
                setTags(Array.isArray(tgs) ? tgs : []);
            } catch (error) {
                console.error('Failed to load categories/tags:', error);
            } finally {
                setLoadingMeta(false);
            }
        };

        fetchMeta();
    }, []);

    const completion = useMemo(() => {
        const checks = [
            course.title.trim(),
            course.shortDescription.trim(),
            course.description.trim(),
            course.categoryId.trim(),
            modules.some((m) => m.title.trim()),
            course.objectives.some((o) => o.trim())
        ];
        return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    }, [course, modules]);

    const updateCourse = <K extends keyof typeof course>(field: K, value: (typeof course)[K]) => {
        setCourse((prev) => ({ ...prev, [field]: value }));
    };

    const updateArrayField = (
        field: 'objectives' | 'requirements' | 'targetAudience',
        index: number,
        value: string
    ) => {
        setCourse((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) => (i === index ? value : item))
        }));
    };

    const addArrayItem = (field: 'objectives' | 'requirements' | 'targetAudience') => {
        setCourse((prev) => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field: 'objectives' | 'requirements' | 'targetAudience', index: number) => {
        setCourse((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const addModule = () => setModules((prev) => [...prev, { ...emptyModule }]);

    const removeModule = (moduleIndex: number) => {
        setModules((prev) => prev.filter((_, i) => i !== moduleIndex));
    };

    const updateModule = <K extends keyof ModuleData>(moduleIndex: number, field: K, value: ModuleData[K]) => {
        setModules((prev) =>
            prev.map((module, i) => (i === moduleIndex ? { ...module, [field]: value } : module))
        );
    };

    const addLesson = (moduleIndex: number) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                          ...module,
                          lessons: [...module.lessons, { ...emptyLesson }]
                      }
                    : module
            )
        );
    };

    const updateLesson = <K extends keyof Lesson>(
        moduleIndex: number,
        lessonIndex: number,
        field: K,
        value: Lesson[K]
    ) => {
        setModules((prev) =>
            prev.map((module, i) =>
                i === moduleIndex
                    ? {
                          ...module,
                          lessons: module.lessons.map((lesson, j) =>
                              j === lessonIndex ? { ...lesson, [field]: value } : lesson
                          )
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
                          lessons: module.lessons.filter((_, j) => j !== lessonIndex)
                      }
                    : module
            )
        );
    };

    const toggleTag = (tagId: string) => {
        setCourse((prev) => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter((id) => id !== tagId)
                : [...prev.tags, tagId]
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreviewImage(result);
            updateCourse('thumbnail', result);
        };
        reader.readAsDataURL(file);
    };

    const validateCourse = () => {
        const nextErrors: string[] = [];

        if (!course.title.trim()) nextErrors.push('Course title is required.');
        if (!course.shortDescription.trim()) nextErrors.push('Short description is required.');
        if (!course.description.trim()) nextErrors.push('Full description is required.');
        if (!course.categoryId.trim()) nextErrors.push('Please select a category.');
        if (!course.objectives.some((item) => item.trim())) nextErrors.push('Add at least one objective.');
        if (!modules.some((m) => m.title.trim())) nextErrors.push('Add at least one module title.');
        if (!course.thumbnail.trim()) nextErrors.push('Course thumbnail is required to publish.');

        setErrors(nextErrors);
        return nextErrors.length === 0;
    };

    const saveDraft = async () => {
        setSaving(true);
        setErrors([]);

        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...course,
                    modules,
                    status: 'DRAFT'
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || 'Failed to save draft');
            }

            alert('Draft saved successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to save draft');
        } finally {
            setSaving(false);
        }
    };

    const publishCourse = async () => {
        if (!validateCourse()) return;

        setSaving(true);
        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...course,
                    modules,
                    status: 'PUBLISHED'
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || 'Failed to publish course');
            }

            alert('Course published successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to publish course');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Interactive Course Builder
                            </div>
                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Create a course that feels premium
                            </h1>
                            <p className="mt-3 text-muted-foreground">
                                Build your course step by step with a cleaner workflow, better structure, and stronger preview.
                            </p>
                        </div>

                        <div className="min-w-[280px] rounded-2xl border border-border bg-muted/20 p-4">
                            <div className="mb-3 flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Completion</span>
                                <span className="font-medium">{completion}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-background">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${completion}%` }} />
                            </div>

                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {steps.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            'flex flex-col items-center gap-2 rounded-xl border p-3 text-center text-xs',
                                            step === item.id ? 'border-primary bg-primary/5' : 'border-border bg-background'
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {errors.length > 0 && (
                    <Card className="border-destructive/30 bg-destructive/5">
                        <CardContent className="p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                Please fix the following
                            </div>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-destructive/90">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_1fr]">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl">
                                {step === 1 && 'Course Basics'}
                                {step === 2 && 'Course Details'}
                                {step === 3 && 'Curriculum Builder'}
                                {step === 4 && 'Review & Publish'}
                            </CardTitle>
                            <Badge variant="outline">Step {step} of 4</Badge>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {step === 1 && (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Input
                                        placeholder="Course title"
                                        value={course.title}
                                        onChange={(e) => updateCourse('title', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Short description"
                                        value={course.shortDescription}
                                        onChange={(e) => updateCourse('shortDescription', e.target.value)}
                                    />
                                    <div className="md:col-span-2">
                                        <Input
                                            placeholder="Full description"
                                            value={course.description}
                                            onChange={(e) => updateCourse('description', e.target.value)}
                                        />
                                    </div>
                                    <select
                                        value={course.categoryId}
                                        onChange={(e) => updateCourse('categoryId', e.target.value)}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none"
                                    >
                                        <option value="">Select category</option>
                                        {loadingMeta ? (
                                            <option>Loading categories...</option>
                                        ) : (
                                            categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <Input
                                        placeholder="Duration in minutes"
                                        type="number"
                                        value={course.duration ?? ''}
                                        onChange={(e) =>
                                            updateCourse('duration', e.target.value ? Number(e.target.value) : null)
                                        }
                                    />
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Input
                                            placeholder="Meta title"
                                            value={course.metaTitle}
                                            onChange={(e) => updateCourse('metaTitle', e.target.value)}
                                        />
                                        <Input
                                            placeholder="Meta description"
                                            value={course.metaDescription}
                                            onChange={(e) => updateCourse('metaDescription', e.target.value)}
                                        />
                                        <Input
                                            placeholder="Price"
                                            type="number"
                                            value={course.price}
                                            onChange={(e) => updateCourse('price', Number(e.target.value))}
                                        />
                                        <Input
                                            placeholder="Discount price"
                                            type="number"
                                            value={course.discountPrice ?? ''}
                                            onChange={(e) =>
                                                updateCourse(
                                                    'discountPrice',
                                                    e.target.value ? Number(e.target.value) : null
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Language"
                                            value={course.language}
                                            onChange={(e) => updateCourse('language', e.target.value)}
                                        />
                                        <Input
                                            placeholder="Currency"
                                            value={course.currency}
                                            onChange={(e) => updateCourse('currency', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="rounded-2xl border border-border p-4">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                                                <Target className="h-4 w-4 text-primary" />
                                                Objectives
                                            </div>
                                            <div className="space-y-2">
                                                {course.objectives.map((item, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            value={item}
                                                            onChange={(e) =>
                                                                updateArrayField('objectives', index, e.target.value)
                                                            }
                                                            placeholder={`Objective ${index + 1}`}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeArrayItem('objectives', index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addArrayItem('objectives')}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" /> Add objective
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-border p-4">
                                            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                                                <Users className="h-4 w-4 text-primary" />
                                                Target audience
                                            </div>
                                            <div className="space-y-2">
                                                {course.targetAudience.map((item, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            value={item}
                                                            onChange={(e) =>
                                                                updateArrayField('targetAudience', index, e.target.value)
                                                            }
                                                            placeholder={`Audience ${index + 1}`}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeArrayItem('targetAudience', index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addArrayItem('targetAudience')}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" /> Add audience
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-border p-4">
                                        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                                            <Globe className="h-4 w-4 text-primary" />
                                            Tags
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {loadingMeta ? (
                                                <span className="text-sm text-muted-foreground">Loading tags...</span>
                                            ) : tags.length === 0 ? (
                                                <span className="text-sm text-muted-foreground">No tags available</span>
                                            ) : (
                                                tags.map((tag) => (
                                                    <Button
                                                        key={tag.id}
                                                        type="button"
                                                        variant={course.tags.includes(tag.id) ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => toggleTag(tag.id)}
                                                    >
                                                        {tag.name}
                                                    </Button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    {modules.map((module, moduleIndex) => (
                                        <div key={moduleIndex} className="rounded-2xl border border-border bg-muted/20 p-4">
                                            <div className="mb-4 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Layers3 className="h-4 w-4 text-primary" />
                                                    <span className="font-semibold">Module {moduleIndex + 1}</span>
                                                </div>

                                                {modules.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeModule(moduleIndex)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
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

                                            <div className="mt-4 space-y-4">
                                                {module.lessons.map((lesson, lessonIndex) => (
                                                    <div key={lessonIndex} className="rounded-xl border border-border bg-background p-4">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                                <Video className="h-4 w-4 text-primary" />
                                                                Lesson {lessonIndex + 1}
                                                            </div>

                                                            {module.lessons.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                            <Input
                                                                placeholder="Lesson title"
                                                                value={lesson.title}
                                                                onChange={(e) =>
                                                                    updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)
                                                                }
                                                            />
                                                            <select
                                                                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none"
                                                                value={lesson.type}
                                                                onChange={(e) =>
                                                                    updateLesson(
                                                                        moduleIndex,
                                                                        lessonIndex,
                                                                        'type',
                                                                        e.target.value as LessonType
                                                                    )
                                                                }
                                                            >
                                                                <option value="VIDEO">Video</option>
                                                                <option value="TEXT">Text</option>
                                                                <option value="QUIZ">Quiz</option>
                                                                <option value="ASSIGNMENT">Assignment</option>
                                                                <option value="LIVE_SESSION">Live Session</option>
                                                            </select>
                                                        </div>

                                                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                                            <Input
                                                                placeholder="Lesson description"
                                                                value={lesson.description}
                                                                onChange={(e) =>
                                                                    updateLesson(moduleIndex, lessonIndex, 'description', e.target.value)
                                                                }
                                                            />
                                                            <Input
                                                                type="number"
                                                                placeholder="Duration (minutes)"
                                                                value={lesson.videoDuration ?? ''}
                                                                onChange={(e) =>
                                                                    updateLesson(
                                                                        moduleIndex,
                                                                        lessonIndex,
                                                                        'videoDuration',
                                                                        e.target.value ? Number(e.target.value) : null
                                                                    )
                                                                }
                                                            />
                                                        </div>

                                                        <textarea
                                                            className="mt-3 min-h-28 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none"
                                                            placeholder="Lesson content"
                                                            value={lesson.content}
                                                            onChange={(e) =>
                                                                updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)
                                                            }
                                                        />

                                                        <div className="mt-3 flex items-center gap-2">
                                                            <input
                                                                id={`free-${moduleIndex}-${lessonIndex}`}
                                                                type="checkbox"
                                                                checked={lesson.isFree}
                                                                onChange={(e) =>
                                                                    updateLesson(moduleIndex, lessonIndex, 'isFree', e.target.checked)
                                                                }
                                                            />
                                                            <label htmlFor={`free-${moduleIndex}-${lessonIndex}`} className="text-sm">
                                                                Free preview lesson
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button
                                                type="button"
                                                className="mt-4"
                                                variant="outline"
                                                onClick={() => addLesson(moduleIndex)}
                                            >
                                                <Plus className="mr-2 h-4 w-4" /> Add lesson
                                            </Button>
                                        </div>
                                    ))}

                                    <Button type="button" variant="outline" onClick={addModule}>
                                        <Plus className="mr-2 h-4 w-4" /> Add module
                                    </Button>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-border bg-muted/20 p-5">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold">
                                                    {course.title || 'Course title'}
                                                </h3>
                                                <p className="mt-2 text-muted-foreground">
                                                    {course.shortDescription || 'Short description preview'}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-border bg-background p-4">
                                                <p className="text-sm text-muted-foreground">Price</p>
                                                <p className="text-2xl font-bold">
                                                    ${course.discountPrice ?? course.price}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                                            <div className="rounded-xl bg-background p-4">
                                                <p className="text-xs text-muted-foreground">Level</p>
                                                <p className="mt-1 font-medium">{course.level}</p>
                                            </div>
                                            <div className="rounded-xl bg-background p-4">
                                                <p className="text-xs text-muted-foreground">Modules</p>
                                                <p className="mt-1 font-medium">{modules.length}</p>
                                            </div>
                                            <div className="rounded-xl bg-background p-4">
                                                <p className="text-xs text-muted-foreground">Lessons</p>
                                                <p className="mt-1 font-medium">
                                                    {modules.reduce((acc, module) => acc + module.lessons.length, 0)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button onClick={saveDraft} variant="outline" disabled={saving}>
                                            {saving ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Settings2 className="mr-2 h-4 w-4" />
                                            )}
                                            Save Draft
                                        </Button>

                                        <Button onClick={publishCourse} disabled={saving}>
                                            {saving ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                            )}
                                            Publish Course
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Course Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="overflow-hidden rounded-2xl border border-border bg-muted/20">
                                <div className="flex aspect-video items-center justify-center bg-background">
                                    {previewImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <Upload className="mx-auto mb-2 h-8 w-8" />
                                            Thumbnail preview
                                        </div>
                                    )}
                                </div>
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-sm font-medium">Course thumbnail</span>
                                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                            </label>

                            <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Globe className="h-4 w-4 text-primary" />
                                    Visibility summary
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-xl bg-background p-3">
                                        <p className="text-muted-foreground">Language</p>
                                        <p className="font-medium">{course.language}</p>
                                    </div>
                                    <div className="rounded-xl bg-background p-3">
                                        <p className="text-muted-foreground">Currency</p>
                                        <p className="font-medium">{course.currency}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep((s) => Math.max(1, s - 1))}
                        disabled={step === 1}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>

                    {step < 4 ? (
                        <Button type="button" onClick={() => setStep((s) => Math.min(4, s + 1))}>
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            Review everything before publishing
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}