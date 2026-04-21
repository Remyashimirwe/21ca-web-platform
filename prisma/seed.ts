import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categoriesData = [
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
      description: 'Business skills, leadership, and entrepreneurship',
      icon: '💼',
      color: '#10B981',
      sortOrder: 2,
    },
    {
      name: 'Arts & Humanities',
      slug: 'arts-humanities',
      description: 'Creative arts, literature, philosophy, and history',
      icon: '🎨',
      color: '#EC4899',
      sortOrder: 3,
    },
    {
      name: 'Social Sciences',
      slug: 'social-sciences',
      description: 'Psychology, sociology, and political science',
      icon: '🌍',
      color: '#8B5CF6',
      sortOrder: 4,
    },
    {
      name: 'Health & Wellness',
      slug: 'health-wellness',
      description: 'Physical health, mental wellness, and nutrition',
      icon: '🏥',
      color: '#EF4444',
      sortOrder: 5,
    },
    {
      name: 'Personal Development',
      slug: 'personal-development',
      description: 'Soft skills, productivity, and life coaching',
      icon: '🌱',
      color: '#F59E0B',
      sortOrder: 6,
    },
    {
      name: 'Language Learning',
      slug: 'languages',
      description: 'Learn new languages and master communication',
      icon: '🗣️',
      color: '#06B6D4',
      sortOrder: 7,
    },
    {
      name: 'Data & Computer Science',
      slug: 'data-cs',
      description: 'Coding, AI, and data analysis',
      icon: '💻',
      color: '#6366F1',
      sortOrder: 8,
    },
  ];

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  // Create tags
  const tagsData = [
    { name: 'Beginner Friendly', slug: 'beginner-friendly', color: '#22C55E' },
    { name: 'Programming', slug: 'programming', color: '#3B82F6' },
    { name: 'Design', slug: 'design', color: '#8B5CF6' },
    { name: 'Marketing', slug: 'marketing', color: '#F59E0B' },
    { name: 'Data Science', slug: 'data-science', color: '#EF4444' },
    { name: 'AI & Machine Learning', slug: 'ai-ml', color: '#6366F1' },
    { name: 'Career Growth', slug: 'career-growth', color: '#EC4899' },
    { name: 'Productivity', slug: 'productivity', color: '#10B981' },
  ];

  for (const tag of tagsData) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }

  // Create a sample instructor (needs a clerkId to be functional)
  // For seeding purposes, we use a placeholder or assume the first user is an admin/instructor
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      clerkId: 'user_2nUuV8r6T1P7Q4S9X2Z4W6K8', // Placeholder clerkId
      email: 'instructor@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'INSTRUCTOR',
      title: 'Senior Software Architect',
      bio: 'Expert in full-stack development and cloud computing with over 15 years of experience.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
    },
  });

  // Fetch created categories to link courses
  const stem = await prisma.category.findUnique({ where: { slug: 'stem' } });
  const business = await prisma.category.findUnique({ where: { slug: 'business' } });
  const arts = await prisma.category.findUnique({ where: { slug: 'arts-humanities' } });

  if (stem && business && arts) {
    // Create sample courses
    const sampleCourses = [
      {
        title: 'Introduction to React.js',
        slug: 'intro-to-react',
        description: 'Learn the fundamentals of React.js including components, hooks, and state management.',
        shortDescription: 'Master modern frontend development with React.',
        price: 49.99,
        level: 'BEGINNER',
        categoryId: stem.id,
        instructorId: instructor.id,
        isPublished: true,
        isFeatured: true,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&h=800&auto=format&fit=crop',
      },
      {
        title: 'Advanced Business Strategy',
        slug: 'adv-business-strategy',
        description: 'Master the art of business scaling, market analysis, and competitive positioning.',
        shortDescription: 'Level up your business acumen and strategic thinking.',
        price: 129.99,
        level: 'ADVANCED',
        categoryId: business.id,
        instructorId: instructor.id,
        isPublished: true,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&h=800&auto=format&fit=crop',
      },
      {
        title: 'Modern Abstract Painting',
        slug: 'modern-abstract-painting',
        description: 'Express yourself through colors and textures in this hands-on abstract painting course.',
        shortDescription: 'Unleash your creativity with abstract art techniques.',
        price: 29.99,
        level: 'INTERMEDIATE',
        categoryId: arts.id,
        instructorId: instructor.id,
        isPublished: true,
        thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&h=800&auto=format&fit=crop',
      },
    ];

    for (const course of sampleCourses) {
      await prisma.course.upsert({
        where: { slug: course.slug },
        update: course,
        create: course,
      });
    }
  }

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