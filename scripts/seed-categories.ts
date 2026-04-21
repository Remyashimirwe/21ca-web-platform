// scripts/seed-categories.ts
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
});

async function main() {
    console.log('Seeding categories...');

    const categories = [
        {
            name: 'STEM Education',
            slug: 'stem',
            description: 'Science, Technology, Engineering, and Mathematics',
            icon: '🔬',
            color: '#3B82F6',
            image: 'https://images.unsplash.com/photo-1631378297854-185cff6b0986?w=800&auto=format&fit=crop&q=60',
            sortOrder: 1,
            isActive: true,
        },
        {
            name: 'Digital & Financial Literacy',
            slug: 'business',
            description: 'Business skills, leadership, and entrepreneurship',
            icon: '💼',
            color: '#10B981',
            image: 'https://plus.unsplash.com/premium_photo-1661371340750-f9b83c2e2c51?w=800&auto=format&fit=crop&q=60',
            sortOrder: 2,
            isActive: true,
        },
        {
            name: 'Green Entrepreneurship',
            slug: 'arts-humanities',
            description: 'Creative arts, literature, philosophy, and history',
            icon: '🎨',
            color: '#EC4899',
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60',
            sortOrder: 3,
            isActive: true,
        },
        {
            name: 'Faith-Based Coaching',
            slug: 'social-sciences',
            description: 'Psychology, sociology, and political science',
            icon: '🌍',
            color: '#8B5CF6',
            image: 'https://images.unsplash.com/photo-1594453843726-b465f1cac129?w=800&auto=format&fit=crop&q=60',
            sortOrder: 4,
            isActive: true,
        },
        {
            name: 'Health & Wellness',
            slug: 'health-wellness',
            description: 'Physical health, mental wellness, and nutrition',
            icon: '🏥',
            color: '#EF4444',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60',
            sortOrder: 5,
            isActive: true,
        },
        {
            name: 'Personal Development',
            slug: 'personal-development',
            description: 'Soft skills, productivity, and life coaching',
            icon: '🌱',
            color: '#F59E0B',
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60',
            sortOrder: 6,
            isActive: true,
        },
        {
            name: 'Language Learning',
            slug: 'languages',
            description: 'Learn new languages and master communication',
            icon: '🗣️',
            color: '#06B6D4',
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=60',
            sortOrder: 7,
            isActive: true,
        },
        {
            name: 'Data & Computer Science',
            slug: 'data-cs',
            description: 'Coding, AI, and data analysis',
            icon: '💻',
            color: '#6366F1',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
            sortOrder: 8,
            isActive: true,
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
        await pool.end();
    });