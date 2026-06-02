'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    BadgeCheck,
    Crown,
    Sparkles,
    Shield,
    Zap,
    Loader2,
    Check,
    Star,
    Rocket,
    Trophy,
    ChevronRight,
    Heart
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    color: string;
    gradient: string;
    light: string;
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

const planConfigs: Record<string, { color: string; gradient: string; light: string; icon: LucideIcon }> = {
    MONTHLY: { 
        color: 'text-blue-500', 
        gradient: 'from-blue-500 to-indigo-600', 
        light: 'bg-blue-500/10 text-blue-500',
        icon: Zap 
    },
    ANNUAL: { 
        color: 'text-purple-500', 
        gradient: 'from-violet-500 to-purple-600', 
        light: 'bg-purple-500/10 text-purple-500',
        icon: Crown 
    },
    LIFETIME: { 
        color: 'text-amber-500', 
        gradient: 'from-amber-400 to-orange-600', 
        light: 'bg-amber-500/10 text-amber-500',
        icon: Shield 
    },
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
                    const mappedPlans: PremiumPlan[] = data.map(p => {
                        const config = planConfigs[p.plan] || planConfigs.MONTHLY;
                        return {
                            id: p.plan,
                            name: p.name,
                            price: Number(p.price),
                            currency: p.currency,
                            color: config.color,
                            gradient: config.gradient,
                            light: config.light,
                            icon: config.icon,
                            popular: p.plan === 'ANNUAL', // Annual is usually the most popular
                            description: p.description || '',
                            features: p.features,
                        };
                    });
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
            router.push(`/sign-in?redirect_url=${encodeURIComponent('/premium')}`);
            return;
        }

        setInitializingPayment(planId);
        try {
            const res = await fetch('/api/payments/afripay/premium/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                alert(data?.error || 'Failed to initialize payment');
                return;
            }
            
            if (data.ok && data.formData && data.checkoutUrl) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = data.checkoutUrl;

                Object.entries(data.formData).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = String(value);
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            } else {
                alert(data?.error || 'Invalid payment response format');
            }
        } catch (error) {
            console.error('Payment initialization error:', error);
            alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        } finally {
            setInitializingPayment(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="relative">
                    <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse" />
                    <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                </div>
                <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Loading Excellence...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                        <Sparkles className="h-3 w-3" />
                        Exclusive Access
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight mb-6">
                        Elevate Your <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600 animate-gradient-x">Learning Journey</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium">
                        Join thousands of students who have already upgraded. Unlock every course, mentorship, and professional certificate today.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={cn(
                                "relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden group",
                                plan.popular 
                                    ? "bg-muted/40 border-primary/40 shadow-2xl shadow-primary/10 ring-1 ring-primary/20" 
                                    : "bg-muted/20 border-border/40 hover:border-primary/20"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-6 right-6">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                        <Trophy className="h-3 w-3" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Decorative Glow */}
                            <div className={cn(
                                "absolute -bottom-24 -right-24 w-48 h-48 blur-[80px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br",
                                plan.gradient
                            )} />

                            <div className="mb-8 relative z-10">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-500 group-hover:scale-110", plan.light)}>
                                    <plan.icon className="h-7 w-7" />
                                </div>
                                <h2 className="text-2xl font-black text-foreground tracking-tight uppercase mb-2">{plan.name}</h2>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-8 relative z-10">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-foreground tracking-tighter">
                                        {plan.currency === 'USD' ? '$' : plan.currency}{plan.price}
                                    </span>
                                    {plan.id !== 'LIFETIME' && (
                                        <span className="text-muted-foreground font-black text-sm uppercase tracking-widest">
                                            / {plan.id === 'MONTHLY' ? 'Month' : 'Year'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-grow space-y-4 mb-10 relative z-10">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 group/item">
                                        <div className="mt-1 p-0.5 rounded-full bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors duration-300">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="text-[13px] text-foreground font-bold tracking-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button 
                                onClick={() => handleChoosePlan(plan.id)}
                                disabled={initializingPayment === plan.id}
                                className={cn(
                                    "w-full h-14 rounded-2xl font-black uppercase tracking-[0.15em] transition-all duration-300 relative z-10 group/btn",
                                    plan.popular 
                                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20" 
                                        : "bg-background border border-border/60 hover:border-primary/40 hover:bg-muted"
                                )}
                            >
                                {initializingPayment === plan.id ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Get Started
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 pt-12 border-t border-border/40"
                >
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                            <Shield className="h-5 w-5 text-primary" /> Secure Payments
                        </div>
                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                            <Heart className="h-5 w-5 text-red-500" /> Community Driven
                        </div>
                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                            <Rocket className="h-5 w-5 text-purple-500" /> Fast Onboarding
                        </div>
                        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                            <Star className="h-5 w-5 text-amber-500" /> Premium Content
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}