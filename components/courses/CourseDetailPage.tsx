'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

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
        <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>

                <div className="mt-4 flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                        {isPaidCourse ? `${course.currency || 'USD'} ${course.price}` : 'Free'}
                    </span>
                </div>

                <p className="mt-4 text-muted-foreground">
                    Enroll now to start learning this course.
                </p>

                <div className="mt-6">
                    <Button onClick={handleEnroll} disabled={enrolling}>
                        {enrolling ? 'Processing...' : isPaidCourse ? 'Pay & Enroll' : 'Enroll for Free'}
                    </Button>
                </div>
            </div>
        </div>
    );
}