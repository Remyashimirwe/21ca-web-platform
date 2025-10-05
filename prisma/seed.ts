import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const stemCategory = await prisma.category.create({
    data: {
      name: 'STEM',
      slug: 'stem',
      description: 'Science, Technology, Engineering, and Mathematics',
      icon: '🔬',
      color: '#3B82F6',
      sortOrder: 1,
    },
  });

  const businessCategory = await prisma.category.create({
    data: {
      name: 'Business & Entrepreneurship',
      slug: 'business',
      description: 'Business skills and entrepreneurship',
      icon: '💼',
      color: '#10B981',
      sortOrder: 2,
    },
  });

  // Create tags
  await prisma.tag.createMany({
    data: [
      { name: 'Beginner Friendly', slug: 'beginner-friendly', color: '#22C55E' },
      { name: 'Programming', slug: 'programming', color: '#3B82F6' },
      { name: 'Design', slug: 'design', color: '#8B5CF6' },
      { name: 'Marketing', slug: 'marketing', color: '#F59E0B' },
      { name: 'Data Science', slug: 'data-science', color: '#EF4444' },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });