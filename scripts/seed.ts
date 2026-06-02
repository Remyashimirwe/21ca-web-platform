import { prisma } from '@/lib/prisma';

async function main() {
    console.log('🌱 Starting database seed...');

    // Seed Premium Plans
    const premiumPlans = [
        {
            plan: 'MONTHLY' as const,
            price: 5000,
            currency: 'RWF',
            name: 'Monthly Pass',
            description: 'Perfect for getting started. Full access for 30 days.',
            features: [
                'Access to all courses',
                'Monthly content updates',
                'Community support',
                'Progress tracking',
                'Certificate of completion',
            ],
            isActive: true,
        },
        {
            plan: 'ANNUAL' as const,
            price: 50000,
            currency: 'RWF',
            name: 'Annual Membership',
            description: 'Best value. Full access for an entire year.',
            features: [
                'Unlimited course access',
                'Priority support',
                'Monthly webinars & mentoring',
                'Advanced analytics',
                'Premium certificate',
                'Exclusive community access',
                'Lifetime course materials',
            ],
            isActive: true,
        },
        {
            plan: 'LIFETIME' as const,
            price: 150000,
            currency: 'RWF',
            name: 'Lifetime Access',
            description: 'Ultimate investment. Forever access to all content.',
            features: [
                'Lifetime access to all courses',
                '24/7 premium support',
                'Unlimited mentoring sessions',
                'Professional portfolio building',
                'Job placement assistance',
                'Exclusive career events',
                'Partner network access',
                'Free future course updates',
            ],
            isActive: true,
        },
    ];

    for (const plan of premiumPlans) {
        const existing = await prisma.premiumPlanSettings.findUnique({
            where: { plan: plan.plan },
        });

        if (existing) {
            console.log(`✓ Premium plan "${plan.name}" already exists, skipping...`);
            continue;
        }

        await prisma.premiumPlanSettings.create({
            data: plan,
        });
        console.log(`✓ Created premium plan: "${plan.name}"`);
    }

    console.log('✅ Database seed completed successfully!');
}

main()
    .catch((error) => {
        console.error('❌ Seed script failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
