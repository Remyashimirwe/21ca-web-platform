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
            <section className="relative mt-16 h-[88vh] min-h-[720px] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-background">
                <div className="absolute inset-0 overflow-hidden">
                    {/* Animated background gradient orbs */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
                </div>
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
                                className="flex h-full w-full items-center bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-800/75"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, rgba(10, 15, 30, 0.85) 0%, rgba(10, 15, 30, 0.75) 50%, rgba(10, 15, 30, 0.85) 100%), url(${slide.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="container mx-auto px-6 sm:px-8 lg:px-10">
                                    <div className="max-w-5xl">
                                        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white/10">
                                            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                                            <span>{slide.subtitle}</span>
                                        </div>

                                        <h1 className="max-w-4xl text-6xl lg:text-8xl font-black tracking-tighter text-white leading-tight mb-2">
                                            {slide.title.split(" ").map((word, i) => (
                                                <span
                                                    key={i}
                                                    className={i % 2 === 0 ? "" : "bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"}
                                                >
                                                    {word}{" "}
                                                </span>
                                            ))}
                                        </h1>

                                        <p className="mt-8 max-w-3xl text-xl lg:text-2xl leading-relaxed text-slate-200">
                                            {slide.description}
                                        </p>

                                        <div className="mt-12 flex flex-col gap-4 sm:flex-row flex-wrap">
                                            <Link href={"/programs"}>
                                                <Button
                                                    size="lg"
                                                    className="h-14 bg-white px-10 text-base font-semibold text-slate-950 shadow-2xl hover:shadow-2xl hover:shadow-white/40 hover:scale-105 transition-all duration-300 relative group overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white via-slate-100 to-white translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        Explore Programs
                                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </Button>
                                            </Link>

                                            <Link href={"/premium"}>
                                                <Button
                                                    size="lg"
                                                    className="h-14 border border-yellow-300/50 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-10 text-base font-semibold text-slate-950 shadow-2xl hover:shadow-2xl hover:shadow-yellow-500/40 hover:scale-105 transition-all duration-300 relative group overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        <Crown className="h-5 w-5" />
                                                        Get Premium
                                                    </span>
                                                </Button>
                                            </Link>

                                            <Link href={"/sign-up"}>
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="h-14 border-white/40 bg-white/10 px-10 text-base text-white backdrop-blur-xl hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:scale-105 relative group"
                                                >
                                                    <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                                    Join Us
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className="mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
                                            {[
                                                { label: "Courses", value: "75+" },
                                                { label: "Students", value: "1,000+" },
                                                { label: "Instructors", value: "50+" },
                                                { label: "Success Rate", value: "95%" },
                                            ].map((stat) => (
                                                <div
                                                    key={stat.label}
                                                    className="group rounded-2xl border border-white/20 bg-white/5 p-6 text-center backdrop-blur-lg transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:-translate-y-1"
                                                >
                                                    <div className="text-3xl lg:text-4xl font-black text-white group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                                                    <div className="mt-2 text-sm lg:text-base text-slate-300 font-medium">{stat.label}</div>
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

            <section className="relative bg-gradient-to-b from-background via-background to-muted/20 py-24 lg:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
                </div>
                <div className="container mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                    <div className="mb-20 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary border border-primary/20">
                            <Sparkles className="h-4 w-4" />
                            Why Choose Us
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
                            Built for <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Modern Learning</span>
                        </h2>
                        <p className="mx-auto mt-6 max-w-3xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
                            Practical, engaging and designed for learners who want real results.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`group rounded-3xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden relative ${
                                    index % 2 === 0
                                        ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 hover:border-emerald-500/40"
                                        : "border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/0 hover:border-blue-500/40"
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative p-8 lg:p-10">
                                    <div className={`mb-6 inline-flex rounded-2xl p-4 transition-all duration-300 group-hover:scale-110 ${
                                        index % 2 === 0
                                            ? "bg-emerald-500/15 text-emerald-500"
                                            : "bg-blue-500/15 text-blue-500"
                                    }`}>
                                        <service.icon size={40} className="transition-transform duration-300 group-hover:rotate-12" />
                                    </div>
                                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                                    <p className="mt-4 leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 text-base lg:text-lg">
                                        {service.description}
                                    </p>
                                    <div className={`mt-6 h-1 w-0 group-hover:w-12 transition-all duration-500 rounded-full ${
                                        index % 2 === 0 ? "bg-emerald-500" : "bg-blue-500"
                                    }`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative bg-gradient-to-b from-muted/20 via-background to-background py-24 lg:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
                </div>
                <div className="container mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                    <div className="grid items-center gap-16 lg:gap-20 lg:grid-cols-2">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1673515334462-8ec684bd664b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTV8fGVsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Students learning"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <div className="absolute -bottom-8 -right-8 rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-8 text-primary-foreground shadow-2xl border border-white/20 backdrop-blur-sm">
                                <div className="text-center">
                                    <div className="text-4xl lg:text-5xl font-black">1000+</div>
                                    <div className="text-base opacity-90 font-semibold">Students Empowered</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary border border-primary/20">
                                <Sparkles className="h-4 w-4" />
                                About Us
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
                                Welcome to <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">21st Century Academy</span>
                            </h2>
                            <p className="mt-8 text-lg lg:text-xl leading-relaxed text-muted-foreground">
                                We&#39;re building Africa&#39;s future through transformative education that bridges
                                traditional knowledge with cutting-edge skills for the digital age.
                            </p>
                            <p className="mt-6 text-lg lg:text-xl leading-relaxed text-muted-foreground">
                                Our comprehensive programs span STEM education, digital financial literacy, green
                                entrepreneurship, and faith-based coaching - all designed to empower learners across Rwanda and beyond.
                            </p>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                {[
                                    "Expert Instructors",
                                    "Online Classes",
                                    "International Certificates",
                                    "Practical Projects",
                                    "Community Impact",
                                    "Career Support",
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-5 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 cursor-default"
                                    >
                                        <CheckCircle className="h-6 w-6 flex-shrink-0 text-primary group-hover:scale-110 transition-transform duration-300" />
                                        <span className="font-semibold text-foreground text-base lg:text-lg">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={"/about"}>
                                <Button
                                    size="lg"
                                    className="mt-10 h-14 px-10 text-base font-semibold shadow-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 relative group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <span className="relative z-10 flex items-center gap-2">
                                        Learn More About Us
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative bg-gradient-to-b from-background via-muted/20 to-background py-24 lg:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
                </div>
                <div className="container mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                    <div className="mb-20 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary border border-primary/20">
                            <BookOpen className="h-4 w-4" />
                            Learning Pathways
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
                            Explore Our <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Programs</span>
                        </h2>
                        <p className="mx-auto mt-6 max-w-3xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
                            Discover comprehensive programs designed to equip you with skills for tomorrow&#39;s challenges.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {isLoading ? (
                            // Loading Skeletons
                            [...Array(3)].map((_, i) => (
                                <div key={i} className={`rounded-3xl bg-muted animate-pulse ${i === 0 ? "lg:col-span-2 lg:row-span-2 min-h-[460px]" : "lg:col-span-2 h-56"}`} />
                            ))
                        ) : categories.length > 0 ? (
                            <>
                                <div className="lg:col-span-2 lg:row-span-2">
                                    <div className="group relative min-h-[460px] overflow-hidden rounded-3xl shadow-2xl border border-white/10 hover:border-white/30 transition-all duration-300">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={categories[0].image}
                                            alt={categories[0].name}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent group-hover:via-slate-950/40 transition-all duration-300" />
                                        <div className="absolute bottom-8 left-8 right-8">
                                            <div className="rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl p-6 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:border-white/40">
                                                <h3 className="text-3xl lg:text-4xl font-black text-slate-900">
                                                    {categories[0].name}
                                                </h3>
                                                <p className="mt-2 font-semibold text-lg bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                                                    {categories[0].courses} Courses Available
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {categories.slice(1).map((category, index) => (
                                    <div key={index} className="lg:col-span-2">
                                        <div className="group relative h-56 overflow-hidden rounded-3xl shadow-xl border border-white/10 hover:border-white/30 transition-all duration-300">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent group-hover:via-slate-950/25 transition-all duration-300" />
                                            <div className="absolute bottom-6 left-6 right-6">
                                                <div
                                                    className={`rounded-2xl border bg-white/95 backdrop-blur-xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                                                        index % 2 === 0
                                                            ? "border-blue-500/20 hover:border-blue-500/40"
                                                            : "border-emerald-500/20 hover:border-emerald-500/40"
                                                    }`}
                                                >
                                                    <h4 className="font-bold text-slate-900 text-lg">
                                                        {category.name}
                                                    </h4>
                                                    <p
                                                        className={`text-base font-semibold mt-1 ${
                                                            index % 2 === 0
                                                                ? "text-blue-600"
                                                                : "text-emerald-600"
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

            <section className="relative bg-gradient-to-b from-muted/20 via-background to-background py-24 lg:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
                </div>
                <div className="container mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                    <div className="mb-20 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary border border-primary/20">
                            <Sparkles className="h-4 w-4" />
                            Featured Courses
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
                            Popular <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Courses</span>
                        </h2>
                        <p className="mx-auto mt-6 max-w-3xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
                            Start your learning journey with our most popular and highly-rated courses.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
                            ))
                        ) : courses.length > 0 ? (
                            courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="group overflow-hidden rounded-3xl border border-white/10 bg-card shadow-lg transition-all duration-500 hover:border-white/30 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/30"
                                >
                                    <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <div className="absolute bottom-4 left-4 right-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-4 flex gap-3">
                                            <Link href={`/courses/${course.slug}`} className="flex-1">
                                                <Button size="sm" className="w-full rounded-xl px-4 font-semibold hover:scale-105 transition-transform">
                                                    Preview
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="flex-1 rounded-xl px-4 font-semibold hover:scale-105 transition-transform"
                                            >
                                                Enroll
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="mb-6 flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">Course Price</p>
                                                <div className="mt-2 flex items-baseline gap-3">
                                                    <h3 className="text-4xl lg:text-5xl font-black text-primary">
                                                        {course.price}
                                                    </h3>
                                                    <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary border border-primary/20">
                                                        Premium
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300 shadow-sm">
                                                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                                {course.rating.toFixed(1)}
                                            </div>
                                        </div>

                                        <h4 className="line-clamp-2 text-2xl lg:text-3xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary mb-4">
                                            {course.title}
                                        </h4>

                                        <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-muted/30 p-4 text-sm font-semibold text-muted-foreground hover:border-white/20 transition-all duration-300">
                                            <div className="flex items-center gap-2 justify-center">
                                                <User size={16} className="text-primary" />
                                                <span className="truncate">{course.instructor}</span>
                                            </div>
                                            <div className="border-l border-r border-white/10 flex items-center gap-2 justify-center">
                                                <Clock size={16} className="text-primary" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-center">
                                                <Users size={16} className="text-primary" />
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

                    <div className="mt-16 text-center">
                        <Link href={"/programs"}>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-10 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:bg-primary/5 hover:text-primary border-primary/30 hover:border-primary/60"
                            >
                                View All Courses
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="relative bg-gradient-to-b from-background via-muted/20 to-background py-24 lg:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
                </div>
                <div className="container mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                    <div className="mb-20 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary border border-primary/20">
                            <Users className="h-4 w-4" />
                            Our Team
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
                            Expert <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Instructors</span>
                        </h2>
                        <p className="mx-auto mt-6 max-w-3xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
                            Learn from passionate educators and industry leaders committed to your success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse" />
                            ))
                        ) : instructors.length > 0 ? (
                            instructors.map((instructor, index) => (
                                <div
                                    key={index}
                                    className="group overflow-hidden rounded-3xl border border-white/10 bg-card shadow-lg transition-all duration-500 hover:border-white/30 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/30"
                                >
                                    <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={instructor.image}
                                            alt={instructor.name}
                                            className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>

                                    <div className="relative -mt-10 mx-5 mb-4">
                                        <div className="rounded-2xl border border-white/20 bg-card backdrop-blur-xl p-3 shadow-2xl hover:border-white/40 transition-all duration-300">
                                            <div className="flex justify-center gap-3">
                                                {[FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, socialIndex) => (
                                                    <Button
                                                        key={socialIndex}
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-10 w-10 rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300"
                                                    >
                                                        <Icon size={14} />
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-0 text-center">
                                        <h5 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                                            {instructor.name}
                                        </h5>
                                        <p className="text-base text-muted-foreground mt-1 font-semibold">{instructor.designation}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 py-10 text-center">
                                <p className="text-muted-foreground italic text-lg">Instructors information coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="relative bg-gradient-to-b from-background via-primary/5 to-background py-24 lg:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
                </div>
                <div className="container mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                    <div className="mb-20 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary border border-primary/20">
                            <Award className="h-4 w-4" />
                            Success Stories
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-foreground">
                            What Our <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Students Say</span>
                        </h2>
                        <p className="mx-auto mt-6 max-w-3xl text-lg lg:text-xl text-muted-foreground leading-relaxed">
                            Real stories from learners whose lives have been transformed through our programs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="group rounded-3xl border border-white/10 bg-card p-10 shadow-lg transition-all duration-500 hover:border-white/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="mb-8 text-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="mx-auto mb-4 h-20 w-20 rounded-full border-4 border-primary/30 transition-all duration-300 group-hover:border-primary/60 group-hover:scale-110 shadow-lg"
                                        />
                                        <h5 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{testimonial.name}</h5>
                                        <p className="text-sm text-muted-foreground font-semibold mt-1">{testimonial.profession}</p>
                                    </div>

                                    <div className="relative mb-8">
                                        <div className="absolute -top-3 -left-2 text-7xl font-serif text-primary/15 group-hover:text-primary/25 transition-colors duration-300">
                                            &#34;
                                        </div>
                                        <p className="relative z-10 pl-8 text-lg lg:text-xl italic leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                                            {testimonial.text}
                                        </p>
                                    </div>

                                    <div className="flex justify-center gap-1.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className="fill-yellow-400 text-yellow-400 transition-transform duration-300 group-hover:scale-110"
                                                style={{ transitionDelay: `${i * 50}ms` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative bg-gradient-to-r from-primary via-primary/90 to-primary py-24 lg:py-32 text-white overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-20"></div>
                </div>
                <div className="container mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                        {[
                            { number: "1,000+", label: "Students Enrolled", icon: Users },
                            { number: "50+", label: "Expert Instructors", icon: GraduationCap },
                            { number: "75+", label: "Courses Available", icon: BookOpen },
                            { number: "95%", label: "Success Rate", icon: Award },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="group rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 text-center shadow-xl transition-all duration-500 hover:border-white/40 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 rounded-2xl bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                                        <stat.icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                                    </div>
                                </div>
                                <div className="text-4xl lg:text-5xl font-black mb-2">{stat.number}</div>
                                <div className="text-base lg:text-lg font-semibold opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 py-24 lg:py-32 text-white overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-40"></div>
                </div>
                <div className="container mx-auto px-6 sm:px-8 lg:px-10 relative z-10 text-center">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="text-6xl lg:text-7xl font-black tracking-tighter">
                            Ready to Transform Your <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">Future?</span>
                        </h2>
                        <p className="mt-8 text-xl lg:text-2xl leading-relaxed text-slate-200">
                            Join thousands of learners who are building skills for tomorrow. Start your journey
                            today with courses designed for the African context.
                        </p>
                        <div className="mt-12 flex flex-col justify-center gap-6 sm:flex-row flex-wrap">
                            <Link href={"/programs"}>
                                <Button
                                    size="lg"
                                    className="h-14 px-10 text-base font-semibold bg-white text-slate-950 hover:bg-slate-100 shadow-xl hover:shadow-2xl hover:shadow-white/40 hover:scale-105 transition-all duration-300 relative group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white via-slate-100 to-white translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <span className="relative z-10 flex items-center gap-2">
                                        Browse Courses
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>
                            </Link>
                            <Link href={"/about"}>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-14 border-white/50 bg-white/10 px-10 text-base text-white backdrop-blur-xl hover:bg-white/20 hover:border-white/80 transition-all duration-300 hover:scale-105 font-semibold"
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