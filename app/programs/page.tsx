'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { BookOpen, Users, Star, Clock, ArrowRight, Loader2, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type Course = {
    id: string;
    title: string;
    slug: string;
    shortDescription?: string | null;
    description?: string | null;
    thumbnail?: string | null;
    price: number | string;
    currency?: string | null;
    level?: string | null;
    duration?: number | null;
    averageRating?: number | string | null;
    enrollmentCount?: number;
    isEnrolled?: boolean;
    category: {
        id: string;
        name: string;
        slug: string;
        color?: string | null;
    };
    instructor: {
        firstName?: string | null;
        lastName?: string | null;
    };
};

type CategoryGroup = {
    categoryId: string;
    categoryName: string;
    categorySlug: string;
    categoryColor?: string | null;
    courses: Course[];
};

export default function ProgramsPage() {
    const router = useRouter();
    const { isSignedIn } = useUser();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/programs');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.error || 'Failed to load programs');
                }

                setCourses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load programs:', error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    const categories = useMemo(() => {
        const map = new Map<string, { id: string; name: string }>();

        for (const course of courses) {
            const id = course.category?.id || 'uncategorized';
            const name = course.category?.name || 'Uncategorized';
            if (!map.has(id)) {
                map.set(id, { id, name });
            }
        }

        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [courses]);

    const filteredCourses = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return courses.filter((course) => {
            const matchesCategory =
                selectedCategoryId === 'all' ||
                (course.category?.id || 'uncategorized') === selectedCategoryId;

            if (!matchesCategory) return false;

            if (!normalizedSearch) return true;

            const instructorName = `${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.toLowerCase();

            return (
                course.title?.toLowerCase().includes(normalizedSearch) ||
                course.shortDescription?.toLowerCase().includes(normalizedSearch) ||
                course.description?.toLowerCase().includes(normalizedSearch) ||
                course.category?.name?.toLowerCase().includes(normalizedSearch) ||
                instructorName.includes(normalizedSearch)
            );
        });
    }, [courses, searchTerm, selectedCategoryId]);

    const groupedPrograms: CategoryGroup[] = useMemo(() => {
        const map = new Map<string, CategoryGroup>();

        for (const course of filteredCourses) {
            const categoryId = course.category?.id || 'uncategorized';
            const existing = map.get(categoryId);

            if (existing) {
                existing.courses.push(course);
            } else {
                map.set(categoryId, {
                    categoryId,
                    categoryName: course.category?.name || 'Uncategorized',
                    categorySlug: course.category?.slug || 'uncategorized',
                    categoryColor: course.category?.color || null,
                    courses: [course],
                });
            }
        }

        return Array.from(map.values());
    }, [filteredCourses]);

    const handleEnroll = async (courseId: string) => {
        try {
            if (!isSignedIn) {
                router.push('/sign-up');
                return;
            }

            setEnrollingId(courseId);

            const response = await fetch(`/api/courses/${courseId}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                router.push('/sign-up');
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to enroll');
            }

            setCourses((prev) =>
                prev.map((course) =>
                    course.id === courseId
                        ? { ...course, isEnrolled: true }
                        : course
                )
            );
        } catch (error: any) {
            alert(error?.message || 'Enrollment failed');
        } finally {
            setEnrollingId(null);
        }
    };

    const formatCurrency = (amount: number | string, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(Number(amount) || 0);
    };

    const getInstructorName = (instructor?: Course['instructor']) => {
        if (!instructor) return 'Unknown Instructor';
        return `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || 'Unknown Instructor';
    };

    return (
        <div className="min-h-screen bg-background/50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-primary/5 py-16 md:py-24">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
                <div className="container relative max-w-6xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-bottom-3">
                            Explore Your Future
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Discover Expert-Led <span className="text-primary">Programs</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Unlock your potential with our curated selection of high-quality courses designed to take your skills to the next level.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 pb-20">
                {/* Search and Filter Bar */}
                <Card className="shadow-xl border-primary/10 overflow-hidden mb-12">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by course, instructor, or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-12 bg-muted/30 border-none ring-offset-background focus-visible:ring-2"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Tabs value={selectedCategoryId} onValueChange={setSelectedCategoryId} className="hidden lg:block">
                                    <TabsList className="h-12 bg-muted/30 p-1">
                                        <TabsTrigger value="all" className="px-6">All</TabsTrigger>
                                        {categories.slice(0, 5).map((category) => (
                                            <TabsTrigger key={category.id} value={category.id} className="px-6">
                                                {category.name}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>

                                <div className="flex items-center gap-2 border-l pl-4 border-muted ml-2">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="icon"
                                        onClick={() => setViewMode('grid')}
                                        className="h-10 w-10"
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="icon"
                                        onClick={() => setViewMode('list')}
                                        className="h-10 w-10"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile & Overflow Categories */}
                        <ScrollArea className="w-full whitespace-nowrap mt-4 lg:hidden">
                            <div className="flex w-max space-x-2 pb-2">
                                <Button
                                    variant={selectedCategoryId === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedCategoryId('all')}
                                    className="rounded-full"
                                >
                                    All Categories
                                </Button>
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategoryId(category.id)}
                                        className="rounded-full"
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </CardContent>
                </Card>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[450px] rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : groupedPrograms.length === 0 ? (
                    <div className="py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                            <Search className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3">No programs found</h2>
                        <p className="text-xl text-muted-foreground max-w-md mx-auto">
                            We couldn't find any courses matching your current search or filters.
                        </p>
                        <Button
                            variant="link"
                            className="mt-4 text-primary text-lg"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategoryId('all');
                            }}
                        >
                            Clear all filters
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {groupedPrograms.map((group) => (
                            <section key={group.categoryId} className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-primary/5">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-bold tracking-tight">{group.categoryName}</h2>
                                            {group.categoryColor && (
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: group.categoryColor }}
                                                />
                                            )}
                                        </div>
                                        <p className="text-lg text-muted-foreground">
                                            Explore {group.courses.length} specialized program{group.courses.length > 1 ? 's' : ''} in this field
                                        </p>
                                    </div>
                                    <Button variant="ghost" className="hidden md:flex items-center gap-2 group">
                                        View all
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>

                                <div className={cn(
                                    "grid gap-8",
                                    viewMode === 'grid'
                                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                        : "grid-cols-1"
                                )}>
                                    {group.courses.map((course) => {
                                        const rating = Number(course.averageRating) || 0;
                                        const price = Number(course.price) || 0;

                                        return (
                                            <Card
                                                key={course.id}
                                                className={cn(
                                                    "group overflow-hidden border-primary/5 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 flex flex-col",
                                                    viewMode === 'list' && "md:flex-row"
                                                )}
                                            >
                                                <div className={cn(
                                                    "relative overflow-hidden",
                                                    viewMode === 'grid' ? "aspect-video" : "md:w-72 lg:w-96 shrink-0"
                                                )}>
                                                    {course.thumbnail ? (
                                                        <img
                                                            src={course.thumbnail}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                                            <BookOpen className="h-16 w-16 text-primary/40" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 left-4 flex gap-2">
                                                        <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-none shadow-sm">
                                                            {course.level || 'Beginner'}
                                                        </Badge>
                                                        {course.isEnrolled && (
                                                            <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-none shadow-sm">
                                                                Enrolled
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col flex-1">
                                                    <CardContent className="p-6 flex-1 space-y-4">
                                                        <div className="space-y-2">
                                                            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                                                {course.title}
                                                            </h3>
                                                            <p className="text-muted-foreground line-clamp-2">
                                                                {course.shortDescription || course.description || 'Elevate your skills with this professionally designed course.'}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-1.5">
                                                                <Users className="h-4 w-4" />
                                                                <span>{course.enrollmentCount || 0}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                                <span className="font-medium text-foreground">{rating ? rating.toFixed(1) : 'New'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{course.duration ? `${course.duration}m` : 'Flexible'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                                    {course.instructor?.firstName?.[0] || 'I'}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Instructor</p>
                                                                    <p className="text-sm font-semibold">{getInstructorName(course.instructor)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-muted-foreground">Investment</p>
                                                                <p className="text-lg font-bold text-primary">
                                                                    {formatCurrency(course.price, course.currency || 'USD')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>

                                                    <CardFooter className="p-6 pt-0 flex gap-3">
                                                        {course.isEnrolled ? (
                                                            <Button
                                                                className="flex-1 h-11"
                                                                onClick={() => router.push(`/my-courses`)}
                                                            >
                                                                Go to Learning
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                className="flex-1 h-11 relative overflow-hidden group/btn"
                                                                onClick={() => handleEnroll(course.id)}
                                                                disabled={enrollingId === course.id}
                                                            >
                                                                <span className="relative z-10 flex items-center justify-center">
                                                                    {enrollingId === course.id ? (
                                                                        <>
                                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                            Enrolling...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            Enroll Now
                                                                            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            className="h-11 border-primary/10 hover:bg-primary/5"
                                                            onClick={() => router.push(`/courses/${course.slug}`)}
                                                        >
                                                            Details
                                                        </Button>
                                                    </CardFooter>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}