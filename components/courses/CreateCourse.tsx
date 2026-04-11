'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
    BookOpen,
    Upload,
    Plus,
    Trash2,
    Eye,
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Video,
    FileText,
    DollarSign,
    Globe,
    Target,
    Users,
    Clock,
    Star
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

interface Module {
    id?: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

interface Lesson {
    id?: string;
    title: string;
    description: string;
    content: string;
    videoUrl: string;
    videoDuration: number | null;
    type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE_SESSION';
    isFree: boolean;
}

const CreateCourse = () => {
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
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
        metaDescription: ''
    });

    const [modules, setModules] = useState<Module[]>([{
        title: '',
        description: '',
        lessons: [{
            title: '',
            description: '',
            content: '',
            videoUrl: '',
            videoDuration: null,
            type: 'VIDEO',
            isFree: false
        }]
    }]);

    // Fetch categories and tags
    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await fetch('/api/tags');
            const data = await response.json();
            setAvailableTags(data);
        } catch (error) {
            console.error('Failed to fetch tags:', error);
        }
    };

    const handleInputChange = (field: keyof CourseFormData, value: any) => {
        setCourseData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayFieldChange = (field: keyof Pick<CourseFormData, 'objectives' | 'requirements' | 'targetAudience'>, index: number, value: string) => {
        setCourseData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayField = (field: keyof Pick<CourseFormData, 'objectives' | 'requirements' | 'targetAudience'>) => {
        setCourseData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (field: keyof Pick<CourseFormData, 'objectives' | 'requirements' | 'targetAudience'>, index: number) => {
        setCourseData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const addModule = () => {
        setModules(prev => [...prev, {
            title: '',
            description: '',
            lessons: [{
                title: '',
                description: '',
                content: '',
                videoUrl: '',
                videoDuration: null,
                type: 'VIDEO',
                isFree: false
            }]
        }]);
    };

    const removeModule = (index: number) => {
        setModules(prev => prev.filter((_, i) => i !== index));
    };

    const updateModule = (index: number, field: keyof Module, value: any) => {
        setModules(prev => prev.map((module, i) =>
            i === index ? { ...module, [field]: value } : module
        ));
    };

    const addLesson = (moduleIndex: number) => {
        setModules(prev => prev.map((module, i) =>
            i === moduleIndex ? {
                ...module,
                lessons: [...module.lessons, {
                    title: '',
                    description: '',
                    content: '',
                    videoUrl: '',
                    videoDuration: null,
                    type: 'VIDEO',
                    isFree: false
                }]
            } : module
        ));
    };

    const removeLesson = (moduleIndex: number, lessonIndex: number) => {
        setModules(prev => prev.map((module, i) =>
            i === moduleIndex ? {
                ...module,
                lessons: module.lessons.filter((_, j) => j !== lessonIndex)
            } : module
        ));
    };

    const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, value: any) => {
        setModules(prev => prev.map((module, i) =>
            i === moduleIndex ? {
                ...module,
                lessons: module.lessons.map((lesson, j) =>
                    j === lessonIndex ? { ...lesson, [field]: value } : lesson
                )
            } : module
        ));
    };

    const handleTagToggle = (tagId: string) => {
        setCourseData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(id => id !== tagId)
                : [...prev.tags, tagId]
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        try {
            setUploading(true);

            // Create a preview URL
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

    const validateCourseData = () => {
        // Basic validation
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
        if (modules.length === 0 || !modules[0].title.trim()) {
            alert('Please add at least one module');
            return false;
        }
        return true;
    };

    const saveDraft = async () => {
        if (!validateCourseData()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...courseData,
                    modules,
                    status: 'DRAFT'
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Course saved as draft successfully!');
                router.push(`/instructor/courses`);
            } else {
                alert(`Failed to save draft: ${data.error || 'Unknown error'}`);
                console.error('Error:', data);
            }
        } catch (error) {
            console.error('Failed to save draft:', error);
            alert('Failed to save draft. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const publishCourse = async () => {
        if (!validateCourseData()) return;

        // Additional validation for publishing
        if (!courseData.description.trim()) {
            alert('Please enter a full description before publishing');
            return;
        }
        if (!courseData.thumbnail) {
            alert('Please upload a course thumbnail before publishing');
            return;
        }
        if (courseData.objectives.filter(obj => obj.trim()).length === 0) {
            alert('Please add at least one learning objective');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...courseData,
                    modules,
                    status: 'UNDER_REVIEW'
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Course submitted for review successfully!');
                router.push(`/instructor/courses`);
            } else {
                alert(`Failed to submit course: ${data.error || 'Unknown error'}`);
                console.error('Error:', data);
            }
        } catch (error) {
            console.error('Failed to publish course:', error);
            alert('Failed to submit course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return Video;
            case 'TEXT': return FileText;
            case 'QUIZ': return Target;
            case 'ASSIGNMENT': return BookOpen;
            case 'LIVE_SESSION': return Users;
            default: return Video;
        }
    };

    const steps = [
        { id: 1, title: 'Basic Info', description: 'Course title, description, and basics' },
        { id: 2, title: 'Pricing & Details', description: 'Price, level, and requirements' },
        { id: 3, title: 'Course Content', description: 'Modules and lessons' },
        { id: 4, title: 'Review & Publish', description: 'Final review before publishing' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/instructor/courses')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Courses
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Create New Course</h1>
                        <p className="text-muted-foreground">Build and publish your course to start teaching</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={saveDraft}
                        disabled={loading}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                    </Button>
                    <Button onClick={publishCourse} disabled={loading}>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit for Review
                    </Button>
                </div>
            </div>

            {/* Progress Steps */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={cn(
                                    "flex items-center gap-3 cursor-pointer",
                                    currentStep === step.id && "text-primary"
                                )} onClick={() => setCurrentStep(step.id)}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                        currentStep === step.id
                                            ? "bg-primary text-primary-foreground"
                                            : currentStep > step.id
                                            ? "bg-primary/20 text-primary"
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {step.id}
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="font-medium">{step.title}</p>
                                        <p className="text-xs text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="w-8 md:w-16 h-px bg-border mx-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Course Title *</label>
                                <Input
                                    placeholder="Enter course title"
                                    value={courseData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Short Description *</label>
                                <Input
                                    placeholder="Brief description for course cards"
                                    value={courseData.shortDescription}
                                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Description *</label>
                                <textarea
                                    className="w-full min-h-32 p-3 border border-input rounded-md resize-none"
                                    placeholder="Detailed course description"
                                    value={courseData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category *</label>
                                    <select
                                        className="w-full p-2 border border-input rounded-md"
                                        value={courseData.categoryId}
                                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Language</label>
                                    <select
                                        className="w-full p-2 border border-input rounded-md"
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
                                <div className="border-2 border-dashed border-border rounded-lg overflow-hidden">
                                    {thumbnailPreview ? (
                                        <div className="relative group">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Course thumbnail"
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
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
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground mb-2">Upload course thumbnail</p>
                                            <p className="text-xs text-muted-foreground mb-4">
                                                Recommended: 1280x720px, Max 5MB
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById('thumbnail-upload')?.click()}
                                                disabled={uploading}
                                            >
                                                {uploading ? 'Uploading...' : 'Choose File'}
                                            </Button>
                                        </div>
                                    )}
                                    <input
                                        id="thumbnail-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Step 2: Pricing & Details */}
            {currentStep === 2 && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Course Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price *</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="number"
                                            className="pl-9"
                                            placeholder="0.00"
                                            value={courseData.price}
                                            onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
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
                                            value={courseData.discountPrice || ''}
                                            onChange={(e) => handleInputChange('discountPrice', e.target.value ? parseFloat(e.target.value) : null)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Level *</label>
                                    <select
                                        className="w-full p-2 border border-input rounded-md"
                                        value={courseData.level}
                                        onChange={(e) => handleInputChange('level', e.target.value)}
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
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeArrayField('objectives', index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addArrayField('objectives')}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
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
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeArrayField('requirements', index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addArrayField('requirements')}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
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
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeArrayField('targetAudience', index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addArrayField('targetAudience')}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Target Audience
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tags</label>
                                <p className="text-xs text-muted-foreground">Help students find your course</p>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map(tag => (
                                        <Badge
                                            key={tag.id}
                                            variant={courseData.tags.includes(tag.id) ? "default" : "secondary"}
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
                </div>
            )}

            {/* Step 3: Course Content */}
            {currentStep === 3 && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Course Content</CardTitle>
                            <Button onClick={addModule}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Module
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {modules.map((module, moduleIndex) => (
                                <Card key={moduleIndex} className="border-2">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary">
                                                    {moduleIndex + 1}
                                                </span>
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
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeModule(moduleIndex)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {module.lessons.map((lesson, lessonIndex) => {
                                            const LessonIcon = getLessonIcon(lesson.type);
                                            return (
                                                <div key={lessonIndex} className="border rounded-lg p-4 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <LessonIcon className="h-4 w-4" />
                                                            <span className="text-sm font-medium">
                                                                Lesson {lessonIndex + 1}
                                                            </span>
                                                        </div>
                                                        {module.lessons.length > 1 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Input
                                                            placeholder="Lesson title"
                                                            value={lesson.title}
                                                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                                                        />
                                                        <select
                                                            className="p-2 border border-input rounded-md"
                                                            value={lesson.type}
                                                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'type', e.target.value)}
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
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <Input
                                                                placeholder="Video URL"
                                                                value={lesson.videoUrl}
                                                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'videoUrl', e.target.value)}
                                                            />
                                                            <Input
                                                                type="number"
                                                                placeholder="Duration (minutes)"
                                                                value={lesson.videoDuration || ''}
                                                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'videoDuration', e.target.value ? parseInt(e.target.value) : null)}
                                                            />
                                                        </div>
                                                    )}

                                                    <textarea
                                                        className="w-full min-h-24 p-3 border border-input rounded-md resize-none"
                                                        placeholder="Lesson content"
                                                        value={lesson.content}
                                                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)}
                                                    />

                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`free-${moduleIndex}-${lessonIndex}`}
                                                            checked={lesson.isFree}
                                                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'isFree', e.target.checked)}
                                                        />
                                                        <label
                                                            htmlFor={`free-${moduleIndex}-${lessonIndex}`}
                                                            className="text-sm"
                                                        >
                                                            Free preview lesson
                                                        </label>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addLesson(moduleIndex)}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Lesson
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Step 4: Review & Publish */}
            {currentStep === 4 && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">{courseData.title}</h2>
                                        <p className="text-muted-foreground mb-4">{courseData.shortDescription}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Star className="h-4 w-4" />
                                                New Course
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                0 students
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {courseData.duration} min
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">What you'll learn</h3>
                                        <ul className="space-y-1">
                                            {courseData.objectives.filter(obj => obj.trim()).map((objective, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <span className="text-green-500 mt-1">✓</span>
                                                    {objective}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Course Content</h3>
                                        <div className="space-y-2">
                                            {modules.map((module, index) => (
                                                <div key={index} className="border rounded-lg p-3">
                                                    <div className="font-medium">{module.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {module.lessons.length} lessons
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="text-2xl font-bold mb-2">
                                                {courseData.discountPrice ? (
                                                    <>
                                                        <span>${courseData.discountPrice}</span>
                                                        <span className="text-lg text-muted-foreground line-through ml-2">
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
                                        <div>
                                            <h4 className="font-medium mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {courseData.tags.map(tagId => {
                                                    const tag = availableTags.find(t => t.id === tagId);
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
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                >
                    Previous
                </Button>
                <Button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    disabled={currentStep === 4}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default CreateCourse;