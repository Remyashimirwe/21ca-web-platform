'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrencyByCountry } from '@/lib/flutterwave';
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Globe,
    ShieldCheck,
    Sparkles,
    Star,
    Wallet,
} from 'lucide-react';

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

const premiumPlanPricesUSD: Record<PremiumPlanId, number> = {
    MONTHLY: 25,
    ANNUAL: 200,
    LIFETIME: 500,
};

const supportedCurrencies = new Set([
    'USD',
    'RWF',
    'KES',
    'UGX',
    'TZS',
    'GHS',
    'NGN',
    'ZAR',
    'EUR',
    'GBP',
]);

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
    const [usdRate, setUsdRate] = useState<number>(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const geoRes = await fetch('https://ipapi.co/json/');
                const geo = await geoRes.json();
                const country = geo?.country_code || 'US';

                setCountryCode(country);

                const detectedCurrency = getCurrencyByCountry(country);
                setCurrency(detectedCurrency || 'USD');

                const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
                const rateData = await rateRes.json();

                const rate =
                    rateData?.result === 'success' && rateData?.rates?.[detectedCurrency]
                        ? Number(rateData.rates[detectedCurrency])
                        : 1;

                setUsdRate(Number.isFinite(rate) && rate > 0 ? rate : 1);

                if (isPremium) {
                    setLoading(false);
                    return;
                }

                if (!courseId) {
                    setLoading(false);
                    return;
                }

                const courseRes = await fetch(`/api/courses/${courseId}`);
                const courseData = await courseRes.json();

                if (courseRes.ok) {
                    setCourse(courseData);
                    const courseCurrency = courseData.currency || detectedCurrency || 'USD';
                    setCurrency(courseCurrency);
                }
            } catch (error) {
                console.error('Failed to load payment data:', error);
                setCurrency('USD');
                setUsdRate(1);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, isPremium]);

    const premiumAmount = useMemo(() => {
        const usdAmount = premiumPlanPricesUSD[planId];
        if (!usdRate || currency === 'USD') return usdAmount;
        return Math.round(usdAmount * usdRate);
    }, [currency, planId, usdRate]);

    const convertCourseAmount = (amount: number) => {
        if (!usdRate || currency === 'USD') return amount;
        return Math.round(amount * usdRate);
    };

    const handlePay = async () => {
        setProcessing(true);
        try {
            const url = isPremium
                ? '/api/payments/flutterwave/premium/initialize'
                : '/api/payments/flutterwave/initialize';

            const body = isPremium
                ? {
                      planId,
                      countryCode,
                      currency,
                      amount: premiumAmount,
                      usdAmount: premiumPlanPricesUSD[planId],
                      usdRate,
                  }
                : {
                      courseId,
                      countryCode,
                      currency,
                      amount: course?.price ? convertCourseAmount(course.price) : 0,
                      usdRate,
                  };

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

    const amountToShow = isPremium
        ? premiumAmount
        : course?.price
            ? convertCourseAmount(course.price)
            : 0;

    const amountLabel = isPremium
        ? premiumPlanLabels[planId]
        : course?.title || 'Selected Course';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-blue-50/40 dark:from-slate-950 dark:via-background dark:to-slate-900 pt-24 px-4 pb-12">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="gap-2"
                        onClick={() => router.push('/')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
                    <Card className="overflow-hidden border-border/60 shadow-2xl">
                        <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8 text-white">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                                <div>
                                    <Badge className="mb-2 bg-white/15 text-white hover:bg-white/20">
                                        Secure Checkout
                                    </Badge>
                                    <h1 className="text-3xl font-bold">
                                        {isPremium ? 'Complete Premium Subscription' : 'Complete Your Enrollment'}
                                    </h1>
                                    <p className="mt-2 text-white/85">
                                        Fast, secure and location-based pricing.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <CardContent className="space-y-6 p-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Item
                                    </div>
                                    <p className="font-semibold">{amountLabel}</p>
                                </div>

                                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Globe className="h-4 w-4 text-primary" />
                                        Location
                                    </div>
                                    <p className="font-semibold">{countryCode}</p>
                                </div>

                                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Wallet className="h-4 w-4 text-primary" />
                                        Currency
                                    </div>
                                    <p className="font-semibold">
                                        {supportedCurrencies.has(currency) ? currency : 'USD'}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-3xl border bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-sm text-white/70">Total Amount</span>
                                    <Badge className="bg-white/10 text-white hover:bg-white/15">
                                        Live exchange
                                    </Badge>
                                </div>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-black tracking-tight">
                                        {currency} {amountToShow.toLocaleString()}
                                    </span>
                                </div>
                                {isPremium && (
                                    <p className="mt-3 text-sm text-white/70">
                                        Original price: USD {premiumPlanPricesUSD[planId]}
                                    </p>
                                )}
                                {!isPremium && course && (
                                    <p className="mt-3 text-sm text-white/70">
                                        Original price: USD {course.price}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border p-5">
                                    <div className="mb-2 flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                        <h3 className="font-semibold">Payment Method</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Pay securely with Flutterwave.
                                    </p>
                                </div>

                                <div className="rounded-2xl border p-5">
                                    <div className="mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <h3 className="font-semibold">Instant Access</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Get access immediately after successful payment.
                                    </p>
                                </div>
                            </div>

                            <Button
                                className="h-14 w-full text-base font-semibold shadow-lg"
                                onClick={handlePay}
                                disabled={processing}
                            >
                                {processing ? 'Redirecting to payment...' : 'Pay with Flutterwave'}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-border/60 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isPremium ? (
                                    <>
                                        <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
                                            <span className="text-sm text-muted-foreground">Plan</span>
                                            <span className="font-semibold">{premiumPlanLabels[planId]}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
                                            <span className="text-sm text-muted-foreground">Original</span>
                                            <span className="font-semibold">USD {premiumPlanPricesUSD[planId]}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl bg-primary/10 p-4">
                                            <span className="text-sm font-medium">Payable now</span>
                                            <span className="text-xl font-black text-primary">
                                                {currency} {premiumAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
                                            <span className="text-sm text-muted-foreground">Course</span>
                                            <span className="font-semibold text-right max-w-[180px]">{course?.title || 'Selected Course'}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
                                            <span className="text-sm text-muted-foreground">Original</span>
                                            <span className="font-semibold">USD {course?.price ?? 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl bg-primary/10 p-4">
                                            <span className="text-sm font-medium">Payable now</span>
                                            <span className="text-xl font-black text-primary">
                                                {currency} {amountToShow.toLocaleString()}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border/60 shadow-lg">
                            <CardHeader>
                                <CardTitle>Why this pricing?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                                    <p>Prices change based on your location and live exchange rate.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                                    <p>We show the local currency before payment.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                                    <p>Amounts are rounded for a smoother checkout experience.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}