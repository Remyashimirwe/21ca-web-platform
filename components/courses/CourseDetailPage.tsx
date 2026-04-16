'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowRight,
    BadgeDollarSign,
    BookOpen,
    CheckCircle2,
    Clock3,
    CreditCard,
    GraduationCap,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
} from 'lucide-react';

type Course = {
    id: string;
    title: string;
    slug: string;
    price: number | string | null;
    currency?: string | null;
    shortDescription: string | null;
    description: string | null;
    thumbnail: string | null;
    level: string | null;
    duration: number | null;
    enrollmentCount: number;
    averageRating: number | null;
    category: {
        name: string;
        slug: string;
    } | null;
    instructor: {
        firstName: string | null;
        lastName: string | null;
        imageUrl: string | null;
        bio: string | null;
    } | null;
    modules: Array<{
        id: string;
        title: string;
        description: string | null;
        sortOrder: number | null;
        lessons: Array<{
            id: string;
            title: string;
            description: string | null;
            content: string | null;
            videoUrl: string | null;
            type: string;
            sortOrder: number | null;
        }>;
    }>;
    counts: {
        enrollments: number;
        reviews: number;
    };
};

type Props = {
    course: Course;
};

export default function CourseDetailPage({ course }: Props) {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [enrolling, setEnrolling] = useState(false);

    const isPaidCourse = Number(course.price) > 0;

    const priceLabel = useMemo(() => {
        if (!isPaidCourse) return 'Free';
        const amount = Number(course.price || 0);
        return `${course.currency || 'USD'} ${amount.toLocaleString()}`;
    }, [course.currency, course.price, isPaidCourse]);

    const handleEnroll = async () => {
        try {
            setEnrolling(true);

            if (isPaidCourse) {
                const paymentUrl = `/payment?courseId=${course.id}`;

                if (!isSignedIn) {
                    router.push(`/sign-up?redirect_url=${encodeURIComponent(paymentUrl)}`);
                    return;
                }

                router.push(paymentUrl);
                return;
            }

            if (!isSignedIn) {
                router.push(`/sign-up?redirect_url=${encodeURIComponent(`/courses/${course.slug}`)}`);
                return;
            }

            const res = await fetch('/api/enroll/free', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: course.id }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || 'Failed to enroll');
            }

            router.push('/my-courses');
        } catch (error) {
            console.error('Enroll error:', error);
            alert('Failed to enroll');
        } finally {
            setEnrolling(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
            <div className="overflow-hidden rounded-3xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
                <div className="grid gap-8 p-8 md:grid-cols-[1.15fr_0.85fr] md:p-10">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-white/10 text-white hover:bg-white/15">Course Details</Badge>
                            {isPaidCourse ? (
                                <Badge className="bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20">
                                    Premium
                                </Badge>
                            ) : (
                                <Badge className="bg-blue-500/15 text-blue-300 hover:bg-blue-500/20">
                                    Free
                                </Badge>
                            )}
                            {course.category?.name ? (
                                <Badge className="bg-white/10 text-white hover:bg-white/15">
                                    {course.category.name}
                                </Badge>
                            ) : null}
                        </div>

                        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                            {course.title}
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
                            {course.shortDescription || course.description || 'Start learning with this course.'}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                                <p className="text-xs uppercase tracking-wider text-white/70">Price</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <BadgeDollarSign className="h-5 w-5 text-yellow-300" />
                                    <span className="text-3xl font-black">{priceLabel}</span>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                                <p className="text-xs uppercase tracking-wider text-white/70">Access</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                                    <span className="font-semibold">Secure enrollment</span>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                                <p className="text-xs uppercase tracking-wider text-white/70">Students</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-sky-300" />
                                    <span className="font-semibold">{course.counts.enrollments} enrolled</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/75">
                            {course.level ? <span className="rounded-full bg-white/10 px-3 py-1">{course.level}</span> : null}
                            {course.duration ? (
                                <span className="rounded-full bg-white/10 px-3 py-1">{course.duration} hours</span>
                            ) : null}
                            {typeof course.averageRating === 'number' ? (
                                <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                                    <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                                    {course.averageRating.toFixed(1)}
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="h-12 px-6 text-base font-semibold"
                            >
                                {enrolling ? 'Processing...' : isPaidCourse ? 'Pay & Enroll' : 'Enroll for Free'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                className="h-12 border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white"
                                onClick={() => router.push('/courses')}
                            >
                                Back to Courses
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur">
                            <div className="aspect-video bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
                            <div className="space-y-4 p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-white/10 p-3">
                                        <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/65">Course outline</p>
                                        <p className="font-semibold">{course.modules.length} modules</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-2xl bg-black/20 p-4">
                                        <p className="text-white/60">Lessons</p>
                                        <p className="mt-1 text-lg font-bold">
                                            {course.modules.reduce((count, module) => count + module.lessons.length, 0)}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-black/20 p-4">
                                        <p className="text-white/60">Reviews</p>
                                        <p className="mt-1 text-lg font-bold">{course.counts.reviews}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                        <CreditCard className="h-5 w-5" />
                        <h3 className="font-semibold">Flexible Payment</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Pay using your local currency when available.
                    </p>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                        <Sparkles className="h-5 w-5" />
                        <h3 className="font-semibold">Premium Access</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Get full access to lessons, resources and course content.
                    </p>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-primary">
                        <GraduationCap className="h-5 w-5" />
                        <h3 className="font-semibold">Instant Start</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Begin learning immediately after successful payment or free enrollment.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <div className="rounded-3xl border bg-card p-6 shadow-sm">
                    <h2 className="text-2xl font-bold">About this course</h2>
                    <p className="mt-4 leading-7 text-muted-foreground">
                        {course.description || course.shortDescription || 'No course description available yet.'}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {course.instructor ? (
                            <div className="rounded-2xl bg-muted/40 p-4">
                                <p className="text-sm text-muted-foreground">Instructor</p>
                                <p className="font-semibold">
                                    {[course.instructor.firstName, course.instructor.lastName].filter(Boolean).join(' ') ||
                                        'Instructor'}
                                </p>
                                {course.instructor.bio ? (
                                    <p className="mt-2 text-sm text-muted-foreground">{course.instructor.bio}</p>
                                ) : null}
                            </div>
                        ) : null}

                        {course.category ? (
                            <div className="rounded-2xl bg-muted/40 p-4">
                                <p className="text-sm text-muted-foreground">Category</p>
                                <p className="font-semibold">{course.category.name}</p>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="rounded-3xl border bg-card p-6 shadow-sm">
                    <h2 className="text-2xl font-bold">Course contents</h2>
                    <div className="mt-4 space-y-4">
                        {course.modules.length > 0 ? (
                            course.modules.map((module) => (
                                <div key={module.id} className="rounded-2xl border p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold">{module.title}</p>
                                            {module.description ? (
                                                <p className="text-sm text-muted-foreground">{module.description}</p>
                                            ) : null}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{module.lessons.length} lessons</span>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        {module.lessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm"
                                            >
                                                <span>{lesson.title}</span>
                                                <span className="text-muted-foreground">{lesson.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No modules added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}