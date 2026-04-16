'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BadgeDollarSign, CheckCircle2, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';

type Course = {
    id: string;
    title: string;
    price: number | string | null;
    currency?: string | null;
};

type Props = {
    course: Course;
};

export default function CourseDetailPage({ course }: Props) {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [enrolling, setEnrolling] = useState(false);

    const handleEnroll = async () => {
        try {
            setEnrolling(true);

            if (Number(course.price) > 0) {
                const paymentUrl = `/payment?courseId=${course.id}`;

                if (!isSignedIn) {
                    router.push(`/sign-up?redirect_url=${encodeURIComponent(paymentUrl)}`);
                    return;
                }

                router.push(paymentUrl);
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

    const isPaidCourse = Number(course.price) > 0;

    return (
        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
            <div className="overflow-hidden rounded-3xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
                <div className="p-8 md:p-10">
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
                    </div>

                    <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                        {course.title}
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                        <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                            <p className="text-xs uppercase tracking-wider text-white/70">Price</p>
                            <div className="mt-1 flex items-center gap-2">
                                <BadgeDollarSign className="h-5 w-5 text-yellow-300" />
                                <span className="text-3xl font-black">
                                    {isPaidCourse
                                        ? `${course.currency || 'USD'} ${Number(course.price).toLocaleString()}`
                                        : 'Free'}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
                            <p className="text-xs uppercase tracking-wider text-white/70">Access</p>
                            <div className="mt-1 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                                <span className="font-semibold">Secure enrollment</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/80">
                        Enroll now to start learning this course and unlock your learning journey.
                    </p>

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
                        <CheckCircle2 className="h-5 w-5" />
                        <h3 className="font-semibold">Instant Start</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Begin learning immediately after successful payment.
                    </p>
                </div>
            </div>
        </div>
    );
}