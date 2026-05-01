import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true
            },
            include: {
                _count: {
                    select: { courses: true }
                }
            },
            orderBy: {
                sortOrder: 'asc'
            }
        });

        const formattedCategories = categories.map(cat => ({
            ...cat,
            courseCount: cat._count.courses
        }));

        return NextResponse.json(formattedCategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}