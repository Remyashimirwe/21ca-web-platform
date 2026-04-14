"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import {
    Check,
    X,
    Star,
    Crown,
    Zap,
    Shield,
    Users,
    BookOpen,
    Award,
    Globe,
    ArrowRight,
    Phone,
    MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type PlanId = 'MONTHLY' | 'ANNUAL' | 'LIFETIME' | 'FREE' | 'ENTERPRISE';

type PricingPlan = {
    id: PlanId;
    name: string;
    subtitle: string;
    monthlyPrice: number | string;
    annualPrice: number | string;
    color: 'green' | 'blue' | 'purple' | 'gold';
    icon: React.ComponentType<{ className?: string }>;
    popular: boolean;
    description: string;
    features: string[];
    notIncluded: string[];
};

const pricingPlans: PricingPlan[] = [
    {
        id: 'FREE',
        name: 'Explorer',
        subtitle: 'Perfect for beginners',
        monthlyPrice: 0,
        annualPrice: 0,
        color: 'green',
        icon: BookOpen,
        popular: false,
        description: 'Start your learning journey with essential courses and basic support',
        features: [
            'Access to 5 foundational courses',
            'Basic video lessons',
            'Community forum access',
            'Mobile app access',
            'Course completion certificates',
            'Email support',
        ],
        notIncluded: [
            'Live sessions',
            'Personalized mentoring',
            'Advanced projects',
            'Career guidance',
            'Priority support',
        ],
    },
    {
        id: 'MONTHLY',
        name: 'Innovator',
        subtitle: 'Most popular choice',
        monthlyPrice: 49,
        annualPrice: 39,
        color: 'blue',
        icon: Zap,
        popular: true,
        description: 'Comprehensive learning experience with live sessions and project-based learning',
        features: [
            'Access to premium courses',
            'Live interactive sessions',
            'Hands-on projects and labs',
            'Downloadable resources',
            'Progress tracking dashboard',
            'Community networking',
            'Email & chat support',
            'Industry-recognized certificates',
        ],
        notIncluded: ['1-on-1 mentoring', 'Career placement assistance', 'Priority support'],
    },
    {
        id: 'ANNUAL',
        name: 'Visionary',
        subtitle: 'For serious learners',
        monthlyPrice: 99,
        annualPrice: 79,
        color: 'purple',
        icon: Crown,
        popular: false,
        description: 'Premium experience with personalized mentoring and career support',
        features: [
            'Access to all courses',
            'Live sessions & workshops',
            '1-on-1 mentoring sessions',
            'Personalized learning paths',
            'Career guidance & placement',
            'Priority support (24/7)',
            'Alumni community access',
        ],
        notIncluded: [],
    },
    {
        id: 'ENTERPRISE',
        name: 'Enterprise',
        subtitle: 'For organizations',
        monthlyPrice: 'Custom',
        annualPrice: 'Custom',
        color: 'gold',
        icon: Shield,
        popular: false,
        description: 'Tailored solutions for schools, NGOs, and corporate training programs',
        features: [
            'Unlimited course access',
            'Custom course development',
            'Dedicated account manager',
            'Bulk user management',
            'Advanced analytics & reporting',
            'White-label solutions',
        ],
        notIncluded: [],
    },
];

export default function PricingPage() {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    const goToCheckout = (planId: PlanId) => {
        if (planId === 'FREE') {
            if (!isSignedIn) {
                router.push(`/sign-up?redirect_url=${encodeURIComponent('/courses')}`);
                return;
            }
            router.push('/courses');
            return;
        }

        const paymentUrl = `/payment?type=premium&planId=${planId}`;

        if (!isSignedIn) {
            router.push(`/sign-up?redirect_url=${encodeURIComponent(paymentUrl)}`);
            return;
        }

        router.push(paymentUrl);
    };

    return (
        <div className="min-h-screen bg-background pt-20">
            <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            Flexible Pricing Plans
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Invest in Your <span className="text-primary-gradient">Future</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            Choose the perfect plan to accelerate your learning journey.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {pricingPlans.map((plan, index) => {
                            const planPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
                            const isPaidPlan = typeof planPrice === 'number' && planPrice > 0;

                            return (
                                <div
                                    key={index}
                                    className={`relative bg-card rounded-2xl shadow-lg transition-all duration-300 ${
                                        plan.popular ? 'border-2 border-blue-500 scale-105' : 'border border-border'
                                    }`}
                                >
                                    <div className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="mb-4 flex justify-center">
                                                <plan.icon className="w-8 h-8 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                                            <p className="text-muted-foreground text-sm mb-4">{plan.subtitle}</p>
                                            <div className="flex items-baseline justify-center">
                                                <span className="text-4xl font-bold text-foreground">
                                                    {typeof planPrice === 'string' ? planPrice : planPrice === 0 ? 'Free' : `$${planPrice}`}
                                                </span>
                                                {isPaidPlan && (
                                                    <span className="text-muted-foreground ml-2">
                                                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-8">
                                            {plan.features.map((feature) => (
                                                <div key={feature} className="flex items-start space-x-3">
                                                    <Check className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                                                    <span className="text-foreground text-sm">{feature}</span>
                                                </div>
                                            ))}
                                            {plan.notIncluded.map((feature) => (
                                                <div key={feature} className="flex items-start space-x-3 opacity-50">
                                                    <X className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                                                    <span className="text-muted-foreground text-sm line-through">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button className="w-full" onClick={() => goToCheckout(plan.id)}>
                                            {plan.id === 'FREE'
                                                ? 'Get Started Free'
                                                : plan.id === 'ENTERPRISE'
                                                    ? 'Contact Sales'
                                                    : 'Start Free Trial'}
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                            Join thousands of learners who are already transforming their careers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => goToCheckout('MONTHLY')}
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white hover:text-slate-900"
                                onClick={() => router.push('/courses')}
                            >
                                Back to Courses
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}