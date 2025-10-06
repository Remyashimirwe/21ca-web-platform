// scripts/seed-categories.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding categories...');

    const categories = [
        {
            name: 'STEM',
            slug: 'stem',
            description: 'Science, Technology, Engineering, and Mathematics',
            icon: '🔬',
            color: '#3B82F6',
            sortOrder: 1,
        },
        {
            name: 'Business & Entrepreneurship',
            slug: 'business',
            description: 'Business skills and entrepreneurship',
            icon: '💼',
            color: '#10B981',
            sortOrder: 2,
        },
        {
            name: 'Financial Literacy',
            slug: 'financial-literacy',
            description: 'Personal finance and money management',
            icon: '💰',
            color: '#F59E0B',
            sortOrder: 3,
        },
        {
            name: 'Green Technology',
            slug: 'green-technology',
            description: 'Sustainable and environmental technology',
            icon: '🌱',
            color: '#22C55E',
            sortOrder: 4,
        },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: category,
            create: category,
        });
        console.log(`✅ Created/Updated category: ${category.name}`);
    }

    console.log('Seeding tags...');

    const tags = [
        { name: 'Beginner Friendly', slug: 'beginner-friendly', color: '#22C55E' },
        { name: 'Programming', slug: 'programming', color: '#3B82F6' },
        { name: 'Design', slug: 'design', color: '#8B5CF6' },
        { name: 'Marketing', slug: 'marketing', color: '#F59E0B' },
        { name: 'Data Science', slug: 'data-science', color: '#EF4444' },
    ];

    for (const tag of tags) {
        await prisma.tag.upsert({
            where: { slug: tag.slug },
            update: tag,
            create: tag,
        });
        console.log(`✅ Created/Updated tag: ${tag.name}`);
    }

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });