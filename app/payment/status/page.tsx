'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type PaymentStatus = 'pending' | 'success' | 'failed' | 'checking';

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const refId = searchParams.get('refid');
    const [status, setStatus] = useState<PaymentStatus>('checking');
    const [message, setMessage] = useState('Confirming payment...');

    useEffect(() => {
        if (!refId) {
            setStatus('failed');
            setMessage('Invalid payment reference');
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                const res = await fetch(`/api/payment/status?refid=${refId}`);
                const data = await res.json();

                if (data.status === 'success') {
                    setStatus('success');
                    setMessage('Payment successful! Your access has been granted.');
                } else if (data.status === 'failed') {
                    setStatus('failed');
                    setMessage('Payment failed. Please try again.');
                } else {
                    // Still pending, poll again
                    setTimeout(checkPaymentStatus, 3000);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                // Retry on error
                setTimeout(checkPaymentStatus, 3000);
            }
        };

        checkPaymentStatus();
    }, [refId]);

    const handleReturnHome = () => {
        router.push('/');
    };

    const handleRetry = () => {
        setStatus('checking');
        setMessage('Confirming payment...');
        window.location.reload();
    };

    return (
        <div className="min-h-screen pt-24 px-4">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            {status === 'checking' && (
                                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                            )}
                            {status === 'success' && (
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            )}
                            {status === 'failed' && (
                                <AlertCircle className="h-12 w-12 text-red-500" />
                            )}
                        </div>

                        <div className="text-center space-y-2">
                            <p className="font-semibold">
                                {status === 'success' && 'Payment Confirmed'}
                                {status === 'failed' && 'Payment Failed'}
                                {status === 'checking' && 'Processing Payment'}
                            </p>
                            <p className="text-sm text-muted-foreground">{message}</p>
                        </div>

                        {status === 'success' && (
                            <Button className="w-full" onClick={handleReturnHome}>
                                Go to Dashboard
                            </Button>
                        )}

                        {status === 'failed' && (
                            <div className="space-y-2">
                                <Button className="w-full" onClick={handleRetry} variant="outline">
                                    Check Again
                                </Button>
                                <Button className="w-full" onClick={handleReturnHome} variant="ghost">
                                    Return Home
                                </Button>
                            </div>
                        )}

                        {status === 'checking' && (
                            <p className="text-center text-xs text-muted-foreground">
                                This page will automatically check your payment status
                            </p>
                        )}

                        <p className="text-center text-xs text-muted-foreground">
                            Reference ID: {refId}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-24 px-4">
                <div className="max-w-md mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Status</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center py-12">
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        }>
            <PaymentStatusContent />
        </Suspense>
    );
}
