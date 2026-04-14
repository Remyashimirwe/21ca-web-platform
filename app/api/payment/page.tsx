'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrencyByCountry } from '@/lib/flutterwave';

type CourseData = {
    id: string;
    title: string;
    price: number;
    currency?: string;
};

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const courseId = searchParams.get('courseId');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [course, setCourse] = useState<CourseData | null>(null);
    const [countryCode, setCountryCode] = useState('US');
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const geoRes = await fetch('https://ipapi.co/json/');
                const geo = await geoRes.json();
                const country = geo?.country_code || 'US';
                setCountryCode(country);
                setCurrency(getCurrencyByCountry(country));

                if (!courseId) return;

                const courseRes = await fetch(`/api/courses/${courseId}`);
                const courseData = await courseRes.json();

                if (courseRes.ok) {
                    setCourse(courseData);
                    setCurrency(courseData.currency || getCurrencyByCountry(country));
                }
            } catch (error) {
                console.error('Failed to load payment data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const handlePay = async () => {
        if (!courseId) return;

        setProcessing(true);
        try {
            const res = await fetch('/api/payments/flutterwave/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId,
                    countryCode,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || 'Failed to initialize payment');
            }

            if (data.paymentLink) {
                window.location.href = data.paymentLink;
            }
        } catch (error) {
            console.error(error);
            alert('Payment initialization failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <p className="text-muted-foreground">Loading payment page...</p>
            </div>
        );
    }

    if (!courseId) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Card className="max-w-md w-full">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-500">No course selected.</p>
                        <Button className="mt-4" onClick={() => router.push('/courses')}>
                            Go to Courses
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Complete Your Enrollment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Course</p>
                            <p className="font-semibold">{course?.title || 'Selected Course'}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Detected Location</p>
                            <p className="font-semibold">{countryCode}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Currency</p>
                            <p className="font-semibold">{currency}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="text-2xl font-bold">
                                {currency} {course?.price ?? 0}
                            </p>
                        </div>

                        <Button className="w-full" onClick={handlePay} disabled={processing}>
                            {processing ? 'Redirecting to payment...' : 'Pay with Flutterwave'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}