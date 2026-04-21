"use client";

import React, { useEffect, useState } from "react";
import {
    ArrowRight,
    Award,
    BookOpen,
    CheckCircle,
    Clock,
    Crown,
    Globe,
    GraduationCap,
    Home,
    Sparkles,
    Star,
    User,
    UserPlus,
    Users,
    Zap,
    Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

type DbCourse = {
    id: string;
    slug: string;
    title: string;
    thumbnail?: string | null;
    price: number | string;
    currency?: string | null;
    averageRating?: number | string | null;
    totalRatings?: number;
    enrollmentCount?: number;
    duration?: number | null;
    instructor?: {
        id: string;
        firstName?: string | null;
        lastName?: string | null;
    } | null;
};

type DbInstructor = {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
    title?: string | null;
};

type DbCategory = {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
    image?: string | null;
    courseCount?: number;
};

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [dbCourses, setDbCourses] = useState<DbCourse[]>([]);
    const [dbInstructors, setDbInstructors] = useState<DbInstructor[]>([]);
    const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 2);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [coursesRes, instructorsRes, categoriesRes] = await Promise.all([
                    fetch("/api/programs"),
                    fetch("/api/instructors"),
                    fetch("/api/categories")
                ]);

                const results = await Promise.all([
                    coursesRes.ok ? coursesRes.json() : Promise.resolve([]),
                    instructorsRes.ok ? instructorsRes.json() : Promise.resolve([]),
                    categoriesRes.ok ? categoriesRes.json() : Promise.resolve([])
                ]);

                setDbCourses(Array.isArray(results[0]) ? results[0] : []);
                setDbInstructors(Array.isArray(results[1]) ? results[1] : []);
                setDbCategories(Array.isArray(results[2]) ? results[2] : []);

            } catch (error) {
                console.error("Failed to load homepage data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const carouselSlides = [
        {
            title: "The Best Online Learning Platform",
            subtitle: "Best Online Courses",
            description:
                "Empowering learners across Africa with cutting-edge STEM education, digital literacy, and entrepreneurship skills for the 21st century.",
            image:
                "https://images.unsplash.com/photo-1637148778990-621fbe8a8358?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQzfHxlbGVhcm5pbmd8ZW58MHx8MHx8fDA%3D",
        },
        {
            title: "Get Educated Online From Your Home",
            subtitle: "Best Online Courses",
            description:
                "Access world-class education anywhere, anytime. Our platform brings quality learning directly to your home with interactive courses and expert instructors.",
            image:
                "https://plus.unsplash.com/premium_photo-1681487729805-91f220c7da25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWxlYXJuaW5nfGVufDB8fDB8fHww",
        },
    ];

    const services = [
        {
            icon: GraduationCap,
            title: "Expert Instructors",
            description:
                "Learn from industry professionals and academic experts who bring real-world experience to every lesson.",
        },
        {
            icon: Globe,
            title: "Online Classes",
            description:
                "Access courses anytime, anywhere with our mobile-friendly platform designed for low-bandwidth environments.",
        },
        {
            icon: Home,
            title: "Practical Projects",
            description:
                "Apply your learning through hands-on projects that solve real community and business challenges.",
        },
        {
            icon: BookOpen,
            title: "Resource Library",
            description:
                "Extensive collection of PDFs, toolkits, case studies, and reference materials for continued learning.",
        },
    ];

    const courses = dbCourses.slice(0, 3).map((course) => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        price: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: course.currency || "USD",
        }).format(Number(course.price) || 0),
        rating: Number(course.averageRating) || 0,
        reviews: course.totalRatings || 0,
        instructor:
            `${course.instructor?.firstName || ""} ${course.instructor?.lastName || ""}`.trim() ||
            "Unknown Instructor",
        duration: course.duration ? `${course.duration}m` : "Flexible",
        students: course.enrollmentCount || 0,
        image:
            course.thumbnail ||
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=60",
    }));

    const instructors = dbInstructors.map((instructor) => ({
        id: instructor.id,
        name: `${instructor.firstName || ""} ${instructor.lastName || ""}`.trim() || "Unknown Instructor",
        designation: instructor.title || "Instructor",
        image:
            instructor.imageUrl ||
            "https://i.pinimg.com/1200x/2b/7a/01/2b7a01d9272a3f00a4b380110a87d3dd.jpg",
    }));

    const testimonials = [
        {
            name: "Aisha Mukamana",
            profession: "Student Teacher",
            image: "https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg",
            text: "The STEM program transformed how I teach science. My students are now building robots and conducting real experiments!",
        },
        {
            name: "Patrick Niyonzima",
            profession: "Young Entrepreneur",
            image: "https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg",
            text: "Thanks to the Green Entrepreneurship course, I started my solar panel business and now employ 12 people in my community.",
        },
        {
            name: "Marie Claire Ingabire",
            profession: "Financial Educator",
            image: "https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg",
            text: "The digital literacy program gave me tools to help rural communities access mobile banking and grow their savings.",
        },
    ];

    const categories = dbCategories.slice(0, 4).map((cat) => ({
        name: cat.name,
        courses: cat.courseCount || 0,
        image: cat.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=60",
    }));

    if (!mounted) {
        return <div className="min-h-screen bg-background" />;
    }

    return (
        <div className="min-h-screen bg-background">
            <section className="relative mt-16 h-[88vh] min-h-[720px] overflow-hidden">
                <div className="relative h-full w-full">
                    {carouselSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                index === currentSlide
                                    ? "opacity-100 translate-x-0"
                                    : index < currentSlide
                                        ? "opacity-0 -translate-x-full"
                                        : "opacity-0 translate-x-full"
                            }`}
                        >
                            <div
                                className="flex h-full w-full items-center bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-800/60"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(10, 15, 30, 0.78), rgba(10, 15, 30, 0.78)), url(${slide.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="container mx-auto px-6">
                                    <div className="max-w-4xl">
                                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                                            <Sparkles className="h-4 w-4 text-yellow-300" />
                                            {slide.subtitle}
                                        </div>

                                        <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl">
                                            {slide.title}
                                        </h1>

                                        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-200 md:text-2xl">
                                            {slide.description}
                                        </p>

                                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                            <Link href={"/programs"}>
                                                <Button
                                                    size="lg"
                                                    className="h-14 bg-white px-8 text-base font-semibold text-slate-950 shadow-xl hover:bg-slate-100"
                                                >
                                                    Explore Programs
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </Button>
                                            </Link>

                                            <Link href={"/premium"}>
                                                <Button
                                                    size="lg"
                                                    className="h-14 border border-yellow-300/30 bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 text-base font-semibold text-slate-950 shadow-xl hover:from-yellow-300 hover:to-yellow-500"
                                                >
                                                    <Crown className="mr-2 h-5 w-5" />
                                                    Get Premium
                                                </Button>
                                            </Link>

                                            <Link href={"/sign-up"}>
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="h-14 border-white/30 bg-white/10 px-8 text-base text-white backdrop-blur hover:bg-white hover:text-slate-950"
                                                >
                                                    <UserPlus className="mr-2 h-5 w-5" />
                                                    Join Us
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className="mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                                            {[
                                                { label: "Courses", value: "75+" },
                                                { label: "Students", value: "1,000+" },
                                                { label: "Instructors", value: "50+" },
                                                { label: "Success Rate", value: "95%" },
                                            ].map((stat) => (
                                                <div
                                                    key={stat.label}
                                                    className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-sm"
                                                >
                                                    <div className="text-2xl font-black text-white">{stat.value}</div>
                                                    <div className="mt-1 text-sm text-slate-200">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 space-x-3">
                    {carouselSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-3.5 w-3.5 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? "scale-125 bg-white shadow-lg"
                                    : "bg-white/40 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            </section>

            <section className="bg-background py-24">
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                            <Sparkles className="h-4 w-4" />
                            Why Choose Us
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                            Built for Modern Learning
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Practical, engaging and designed for learners who want real results.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`group rounded-3xl border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                                    index % 2 === 0 ? "hover:border-emerald-500/40" : "hover:border-blue-500/40"
                                }`}
                            >
                                <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4">
                                    <service.icon
                                        size={40}
                                        className={`transition-all duration-300 group-hover:scale-110 ${
                                            index % 2 === 0 ? "text-emerald-500" : "text-blue-500"
                                        }`}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">{service.title}</h3>
                                <p className="mt-4 leading-relaxed text-muted-foreground">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-muted/20 py-24">
                <div className="container mx-auto px-6">
                    <div className="grid items-center gap-16 lg:grid-cols-2">
                        <div className="relative">
                            <div className="overflow-hidden rounded-[2rem] shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1673515334462-8ec684bd664b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTV8fGVsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Students learning"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <div className="absolute -bottom-8 -right-8 rounded-3xl bg-primary p-6 text-primary-foreground shadow-2xl">
                                <div className="text-center">
                                    <div className="text-3xl font-black">1000+</div>
                                    <div className="text-sm opacity-90">Students Empowered</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                                About Us
                            </div>
                            <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                                Welcome to 21st Century Academy
                            </h2>
                            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                                We&#39;re building Africa&#39;s future through transformative education that bridges
                                traditional knowledge with cutting-edge skills for the digital age.
                            </p>
                            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                                Our comprehensive programs span STEM education, digital financial literacy, green
                                entrepreneurship, and faith-based coaching - all designed to empower learners across
                                Rwanda and beyond.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                {[
                                    "Expert Instructors",
                                    "Online Classes",
                                    "International Certificates",
                                    "Practical Projects",
                                    "Community Impact",
                                    "Career Support",
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 rounded-2xl border bg-card p-4">
                                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                                        <span className="font-medium text-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={"/about"}>
                                <Button
                                    size="lg"
                                    className="mt-8 h-14 px-8 text-base font-semibold shadow-lg"
                                >
                                    Learn More About Us
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-background py-24">
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                            <BookOpen className="h-4 w-4" />
                            Learning Pathways
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                            Our Programs
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Discover comprehensive programs designed to equip you with skills for tomorrow&#39;s challenges.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        {isLoading ? (
                            // Loading Skeletons
                            [...Array(3)].map((_, i) => (
                                <div key={i} className={`rounded-3xl bg-muted animate-pulse ${i === 0 ? "lg:col-span-2 lg:row-span-2 min-h-[460px]" : "lg:col-span-2 h-56"}`} />
                            ))
                        ) : categories.length > 0 ? (
                            <>
                                <div className="lg:col-span-2 lg:row-span-2">
                                    <div className="group relative min-h-[460px] overflow-hidden rounded-3xl shadow-2xl">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={categories[0].image}
                                            alt={categories[0].name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="rounded-2xl border border-white/15 bg-white/95 p-4 shadow-xl backdrop-blur-sm dark:bg-slate-900/95">
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {categories[0].name}
                                                </h3>
                                                <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {categories[0].courses} Courses Available
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {categories.slice(1).map((category, index) => (
                                    <div key={index} className="lg:col-span-2">
                                        <div className="group relative h-56 overflow-hidden rounded-3xl shadow-xl">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div
                                                    className={`rounded-2xl border bg-white/95 p-3 backdrop-blur-sm dark:bg-slate-900/95 ${
                                                        index % 2 === 0
                                                            ? "border-blue-500/20"
                                                            : "border-emerald-500/20"
                                                    }`}
                                                >
                                                    <h4 className="font-bold text-slate-900 dark:text-white">
                                                        {category.name}
                                                    </h4>
                                                    <p
                                                        className={`text-sm font-semibold ${
                                                            index % 2 === 0
                                                                ? "text-blue-600 dark:text-blue-400"
                                                                : "text-emerald-600 dark:text-emerald-400"
                                                        }`}
                                                    >
                                                        {category.courses} Courses
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="col-span-4 py-20 text-center">
                                <p className="text-muted-foreground text-lg italic">No categories available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-muted/20 py-24">
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                            <Sparkles className="h-4 w-4" />
                            Featured Courses
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                            Popular Courses
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Start your learning journey with our most popular and highly-rated courses.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
                            ))
                        ) : courses.length > 0 ? (
                            courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="group overflow-hidden rounded-3xl border bg-card shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                >
                                    <div className="relative overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <div className="absolute bottom-4 left-4 right-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-4">
                                            <div className="flex gap-2">
                                                <Link href={`/courses/${course.slug}`}>
                                                    <Button size="sm" className="rounded-full px-4">
                                                        Preview
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="rounded-full px-4"
                                                >
                                                    Enroll
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-4 flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Course Price</p>
                                                <div className="mt-1 flex items-baseline gap-2">
                                                    <h3 className="text-3xl font-black text-primary">
                                                        {course.price}
                                                    </h3>
                                                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                                        Premium
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300">
                                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                {course.rating.toFixed(1)}
                                            </div>
                                        </div>

                                        <h4 className="line-clamp-2 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                                            {course.title}
                                        </h4>

                                        <div className="mt-4 flex items-center justify-between rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} className="text-primary" />
                                                <span>{course.instructor}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-primary" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users size={14} className="text-primary" />
                                                <span>{course.students}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 py-20 text-center">
                                <p className="text-muted-foreground text-lg italic">No courses found.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href={"/programs"}>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 text-base font-semibold shadow-sm transition-all hover:-translate-y-0.5"
                            >
                                View All Courses
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-background py-24">
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                            <Users className="h-4 w-4" />
                            Our Team
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                            Expert Instructors
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Learn from passionate educators and industry leaders committed to your success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse" />
                            ))
                        ) : instructors.length > 0 ? (
                            instructors.map((instructor, index) => (
                                <div
                                    key={index}
                                    className="group overflow-hidden rounded-3xl border bg-card shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                >
                                    <div className="relative overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={instructor.image}
                                            alt={instructor.name}
                                            className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>

                                    <div className="relative -mt-8 mx-4">
                                        <div className="rounded-2xl border bg-card p-1 shadow-xl">
                                            <div className="flex justify-center gap-2 py-2">
                                                {[FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, socialIndex) => (
                                                    <Button
                                                        key={socialIndex}
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-9 w-9 rounded-full hover:bg-primary hover:text-white"
                                                    >
                                                        <Icon size={12} />
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-4 text-center">
                                        <h5 className="text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                                            {instructor.name}
                                        </h5>
                                        <p className="text-sm text-muted-foreground">{instructor.designation}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 py-10 text-center">
                                <p className="text-muted-foreground italic">Instructors information coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-primary/5 py-24">
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                            <Award className="h-4 w-4" />
                            Success Stories
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                            What Our Students Say
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Real stories from learners whose lives have been transformed through our programs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="group rounded-3xl border bg-card p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className="mb-6 text-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-primary/20 transition-colors duration-300 group-hover:border-primary/40"
                                    />
                                    <h5 className="text-lg font-bold text-foreground">{testimonial.name}</h5>
                                    <p className="text-sm text-muted-foreground">{testimonial.profession}</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -top-2 -left-2 text-6xl font-serif text-primary/20">
                                        &#34;
                                    </div>
                                    <p className="relative z-10 pl-6 italic leading-relaxed text-muted-foreground">
                                        {testimonial.text}
                                    </p>
                                    <div className="absolute -bottom-4 -right-2 text-6xl font-serif text-primary/20 rotate-180">
                                        &#34;
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className="fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-primary py-20 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                        {[
                            { number: "1,000+", label: "Students Enrolled", icon: Users },
                            { number: "50+", label: "Expert Instructors", icon: GraduationCap },
                            { number: "75+", label: "Courses Available", icon: BookOpen },
                            { number: "95%", label: "Success Rate", icon: Award },
                        ].map((stat, index) => (
                            <div key={index} className="group text-center">
                                <stat.icon className="mx-auto mb-4 h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
                                <div className="text-3xl font-black lg:text-4xl">{stat.number}</div>
                                <div className="mt-2 text-lg opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-r from-slate-950 to-slate-800 py-20 text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                            Ready to Transform Your Future?
                        </h2>
                        <p className="mt-6 text-xl leading-relaxed text-slate-200">
                            Join thousands of learners who are building skills for tomorrow. Start your journey
                            today with courses designed for the African context.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href={"/programs"}>
                                <Button size="lg" className="h-14 px-8 text-base font-semibold">
                                    Browse Courses
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href={"/about"}>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-14 border-white/30 bg-white/5 px-8 text-base text-white hover:bg-white hover:text-slate-950"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-muted/40 py-16">
                <div className="container mx-auto px-6">
                    <div className="rounded-3xl border bg-card p-8 shadow-xl">
                        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h3 className="text-3xl font-black text-foreground">
                                    Stay Updated with 21CA
                                </h3>
                                <p className="mt-4 max-w-xl text-muted-foreground">
                                    Get the latest updates on new courses, success stories, and educational
                                    insights delivered straight to your inbox.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="flex-1 rounded-xl border bg-background px-4 py-3 text-foreground outline-none ring-0 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <Button className="h-12 px-8 font-semibold">
                                        Subscribe
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;