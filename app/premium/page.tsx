'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    BadgeCheck,
    Crown,
    Sparkles,
    Shield,
    Zap,
    Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PremiumPlanId = 'MONTHLY' | 'ANNUAL' | 'LIFETIME';

interface PlanFromDB {
    id: string;
    plan: PremiumPlanId;
    price: string | number;
    currency: string;
    name: string;
    description: string | null;
    features: string[];
}

type PremiumPlan = {
    id: PremiumPlanId;
    name: string;
    price: number;
    currency: string;
    color: 'green' | 'blue' | 'purple' | 'gold';
    icon: LucideIcon;
    popular: boolean;
    description: string;
    features: string[];
};

const iconMap: Record<string, LucideIcon> = {
    MONTHLY: Zap,
    ANNUAL: Crown,
    LIFETIME: Shield,
};

const colorMap: Record<string, 'green' | 'blue' | 'purple' | 'gold'> = {
    MONTHLY: 'blue',
    ANNUAL: 'purple',
    LIFETIME: 'gold',
};

export default function PremiumPage() {
    const router = useRouter();
    const { userId } = useAuth();
    const [plans, setPlans] = useState<PremiumPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [initializingPayment, setInitializingPayment] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch('/api/premium/plans');
                if (res.ok) {
                    const data: PlanFromDB[] = await res.json();
                    const mappedPlans: PremiumPlan[] = data.map(p => ({
                        id: p.plan,
                        name: p.name,
                        price: Number(p.price),
                        currency: p.currency,
                        color: colorMap[p.plan] || 'blue',
                        icon: iconMap[p.plan] || Zap,
                        popular: p.plan === 'MONTHLY',
                        description: p.description || '',
                        features: p.features,
                    }));
                    setPlans(mappedPlans);
                }
            } catch (error) {
                console.error('Failed to fetch plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleChoosePlan = async (planId: string) => {
        if (!userId) {
            router.push('/sign-in?redirect_url=/premium');
            return;
        }

        setInitializingPayment(planId);
        try {
            const res = await fetch('/api/payments/flutterwave/premium/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            });

            const data = await res.json();
            if (res.ok && data.paymentLink) {
                window.location.href = data.paymentLink;
            } else {
                alert(data.error || 'Failed to initialize payment');
            }
        } catch (error) {
            console.error('Payment initialization error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setInitializingPayment(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Upgrade to Premium
                    </h1>
                    <p className="mt-5 text-xl text-gray-500">
                        Get unlimited access to all courses and features.
                    </p>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div key={plan.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                            <div className="p-8 flex-grow">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                                    <plan.icon className={`h-8 w-8 text-${plan.color}-600`} />
                                </div>
                                <p className="mt-4 text-gray-500">{plan.description}</p>
                                <p className="mt-8 flex items-baseline">
                                    <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                                        {plan.currency === 'USD' ? '$' : plan.currency}{plan.price}
                                    </span>
                                    {plan.id !== 'LIFETIME' && <span className="ml-1 text-xl font-semibold text-gray-500">/ {plan.id === 'MONTHLY' ? 'mo' : 'yr'}</span>}
                                </p>
                                <ul className="mt-8 space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <BadgeCheck className="flex-shrink-0 h-6 w-6 text-green-500" />
                                            <span className="ml-3 text-base text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-8 bg-gray-50 mt-auto">
                                <Button 
                                    className="w-full" 
                                    variant={plan.popular ? 'default' : 'outline'}
                                    onClick={() => handleChoosePlan(plan.id)}
                                    disabled={initializingPayment === plan.id}
                                >
                                    {initializingPayment === plan.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        `Choose ${plan.name}`
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}