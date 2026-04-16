'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PremiumPlanId = 'MONTHLY' | 'ANNUAL' | 'LIFETIME';

type PremiumPlan = {
    id: PremiumPlanId;
    name: string;
    price: number;
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
        price: 25,
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
        price: 200,
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
        price: 500,
        color: 'gold',
        icon: Shield,
        popular: false,
        description: 'Permanent access with one payment.',
        features: ['Premium course access', 'Priority support', 'All premium lessons'],
        notIncluded: [],
    },
];