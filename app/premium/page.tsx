'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap, Shield, ArrowRight, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PremiumPlanId = 'MONTHLY' | 'ANNUAL' | 'LIFETIME';

type PremiumPlan = {
    id: PremiumPlanId;
    name: string;
    monthlyPrice: number | string;
    annualPrice: number | string;
    color: 'green' | 'blue' | 'purple' | 'gold';
    icon: LucideIcon;
    popular: boolean;
    description: string;
    features: string[];
    notIncluded: string[];
};

const pricingPlans: PremiumPlan[] = [
    {
        id: 'MONTHLY',
        name: 'Monthly',
        monthlyPrice: 25,
        annualPrice: 25,
        color: 'blue',
        icon: Zap,
        popular: true,
        description: 'Flexible monthly premium access.',
        features: ['Premium course access', 'Priority support', 'All premium lessons'],
        notIncluded: [],
    },
    {
        id: 'ANNUAL',
        name: 'Annual',
        monthlyPrice: 200,
        annualPrice: 200,
        color: 'purple',
        icon: Crown,
        popular: false,
        description: 'Best value for yearly access.',
        features: ['Premium course access', 'Priority support', 'All premium lessons'],
        notIncluded: [],
    },
    {
        id: 'LIFETIME',
        name: 'Lifetime',
        monthlyPrice: 500,
        annualPrice: 500,
        color: 'gold',
        icon: Shield,
        popular: false,
        description: 'Permanent access with one payment.',
        features: ['Premium course access', 'Priority support', 'All premium lessons'],
        notIncluded: [],
    },
];

export default function PremiumPage() {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<PremiumPlanId>('ANNUAL');

    const startTrial = () => {
        const paymentUrl = `/payment?type=premium&planId=${selectedPlan}`;

        if (!isSignedIn) {
            router.push(`/sign-up?redirect_url=${encodeURIComponent(paymentUrl)}`);
            return;
        }

        router.push(paymentUrl);
    };

    return (
        <div className="min-h-screen bg-background pt-20 px-4">
            <div className="mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="mt-2 text-4xl font-bold text-foreground">
                        Unlock All Premium Courses
                    </h1>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {pricingPlans.map((plan) => {
                        const Icon = plan.icon;
                        const isSelected = selectedPlan === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className={`cursor-pointer rounded-2xl border bg-card p-6 transition-all ${
                                    isSelected ? 'border-primary shadow-lg scale-[1.02]' : 'hover:border-primary/60'
                                }`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="h-6 w-6 text-primary" />
                                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                                </div>

                                <p className="mt-3 text-muted-foreground">{plan.description}</p>

                                <Button className="mt-6 w-full" onClick={startTrial}>
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}