import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const plans = await prisma.premiumPlanSettings.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
        });

        if (!plans || plans.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Convert Decimal to number for JSON serialization
        const formattedPlans = plans.map((plan) => ({
            ...plan,
            price: Number(plan.price),
        }));

        return NextResponse.json(formattedPlans, { status: 200 });
    } catch (error) {
        console.error('Error fetching premium plans:', error);
        return NextResponse.json(
            { error: 'Failed to fetch premium plans' },
            { status: 500 }
        );
    }
}
