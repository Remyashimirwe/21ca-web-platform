'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const courseId = searchParams.get('courseId');
    const txRef = searchParams.get('tx_ref');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const transactionId = searchParams.get('transaction_id');

                if (!transactionId || !courseId || !txRef) {
                    setStatus('error');
                    return;
                }

                const res = await fetch('/api/payments/flutterwave/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        transactionId,
                        courseId,
                        txRef,
                    }),
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        };

        verifyPayment();
    }, [courseId, txRef, searchParams]);

    return (
        <div className="min-h-screen pt-24 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                {status === 'loading' && <p>Verifying payment...</p>}
                {status === 'success' && (
                    <>
                        <h1 className="text-3xl font-bold">Payment Successful</h1>
                        <p>You are now enrolled in the course.</p>
                        <Button onClick={() => router.push('/my-courses')}>
                            Go to My Courses
                        </Button>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h1 className="text-3xl font-bold text-red-500">Payment Verification Failed</h1>
                        <p>Please contact support or try again.</p>
                        <Button onClick={() => router.push('/courses')}>
                            Back to Courses
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}