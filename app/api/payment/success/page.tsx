'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const courseId = searchParams.get('courseId');
    const txRef = searchParams.get('tx_ref');

    return (
        <div className="min-h-screen pt-24 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <h1 className="text-3xl font-bold">Payment Successful</h1>
                <p>Your payment has been completed successfully.</p>
                {courseId && txRef ? (
                    <p className="text-sm text-gray-600">
                        Course ID: <strong>{courseId}</strong> · Reference: <strong>{txRef}</strong>
                    </p>
                ) : null}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button onClick={() => router.push('/my-courses')}>
                        Go to My Courses
                    </Button>
                    <Button variant="secondary" onClick={() => router.push('/courses')}>
                        Browse Courses
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-24 flex items-center justify-center px-4">
                <p>Loading...</p>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
