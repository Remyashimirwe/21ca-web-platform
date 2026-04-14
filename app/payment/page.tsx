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

type PremiumPlanId = 'MONTHLY' | 'ANNUAL' | 'LIFETIME';

const premiumPlanLabels: Record<PremiumPlanId, string> = {
    MONTHLY: 'Monthly Premium',
    ANNUAL: 'Annual Premium',
    LIFETIME: 'Lifetime Premium',
};

const premiumPlanPrices: Record<PremiumPlanId, number> = {
    MONTHLY: 25,
    ANNUAL: 200,
    LIFETIME: 500,
};

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const courseId = searchParams.get('courseId');
    const type = searchParams.get('type');
    const planId = (searchParams.get('planId') || 'ANNUAL') as PremiumPlanId;

    const isPremium = type === 'premium';

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

                if (isPremium) {
                    setLoading(false);
                    return;
                }

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
    }, [courseId, isPremium]);

    const handlePay = async () => {
        setProcessing(true);
        try {
            const url = isPremium
                ? '/api/payments/flutterwave/premium/initialize'
                : '/api/payments/flutterwave/initialize';

            const body = isPremium
                ? { planId }
                : { courseId, countryCode };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
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

    return (
        <div className="min-h-screen pt-24 px-4">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{isPremium ? 'Complete Premium Subscription' : 'Complete Your Enrollment'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isPremium ? (
                            <>
                                <div className="rounded-xl border p-4">
                                    <p className="text-sm text-muted-foreground">Plan</p>
                                    <p className="font-semibold">{premiumPlanLabels[planId]}</p>
                                </div>

                                <div className="rounded-xl border p-4">
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="text-2xl font-bold">
                                        {currency} {premiumPlanPrices[planId]}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="rounded-xl border p-4">
                                    <p className="text-sm text-muted-foreground">Course</p>
                                    <p className="font-semibold">{course?.title || 'Selected Course'}</p>
                                </div>

                                <div className="rounded-xl border p-4">
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="text-2xl font-bold">
                                        {currency} {course?.price ?? 0}
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Detected Location</p>
                            <p className="font-semibold">{countryCode}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <p className="text-sm text-muted-foreground">Currency</p>
                            <p className="font-semibold">{currency}</p>
                        </div>

                        <Button className="w-full" onClick={handlePay} disabled={processing}>
                            {processing ? 'Redirecting to payment...' : 'Pay with Flutterwave'}
                        </Button>

                        <Button variant="ghost" className="w-full" onClick={() => router.push('/courses')}>
                            Back to Courses
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}