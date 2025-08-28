"use client";
import React, {useEffect, useState} from "react";
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
    Star,
    User,
    UserPlus,
    Users,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Carousel autoplay
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 2);
        }, 7000);
        return () => clearInterval(timer);
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

    const courses = [
        {
            title: "STEM Foundations for Young Innovators",
            price: "$49.00",
            rating: 4.9,
            reviews: 234,
            instructor: "Dr. Sarah Uwimana",
            duration: "8 weeks",
            students: 156,
            image:
                "https://images.unsplash.com/photo-1634951401794-6c84f593db82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RGlnaXRhbCUyMEZpbmFuY2lhbCUyMExpdGVyYWN5JTIwRXNzZW50aWFsc2FTVEVNJTIwRm91bmRhdGlvbnMlMjBmb3IlMjBZb3VuZyUyMElubm92YXRvcnN8ZW58MHx8MHx8fDA%3D",
            level: "Beginner",
        },
        {
            title: "Digital Financial Literacy Essentials",
            price: "$39.00",
            rating: 4.8,
            reviews: 189,
            instructor: "Jean Claude Mugabo",
            duration: "6 weeks",
            students: 203,
            image:
                "https://images.unsplash.com/photo-1634586720560-d5c61d450133?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8RGlnaXRhbCUyMEZpbmFuY2lhbCUyMExpdGVyYWN5JTIwRXNzZW50aWFsc3xlbnwwfHwwfHx8MA%3D%3D",
            level: "Intermediate",
        },
        {
            title: "Green Entrepreneurship Bootcamp",
            price: "$89.00",
            rating: 4.9,
            reviews: 167,
            instructor: "Grace Nyirahabimana",
            duration: "12 weeks",
            students: 98,
            image:
                "https://plus.unsplash.com/premium_photo-1723672919439-c37b99155360?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFmcmljYSUyMEdyZWVuJTIwRW50cmVwcmVuZXVyc2hpcCUyMEJvb3RjYW1wfGVufDB8fDB8fHww",
            level: "Advanced",
        },
    ];

    const instructors = [
        {
            name: "Dr. Sarah Uwimana",
            designation: "STEM Education Lead",
            image: "https://i.pinimg.com/1200x/79/1b/72/791b7253ab26fe8bdcb9374082f593be.jpg",
        },
        {
            name: "Jean Claude Mugabo",
            designation: "Digital Finance Expert",
            image: "https://i.pinimg.com/1200x/2b/7a/01/2b7a01d9272a3f00a4b380110a87d3dd.jpg",
        },
        {
            name: "Grace Nyirahabimana",
            designation: "Sustainability Coach",
            image: "https://i.pinimg.com/736x/79/2d/39/792d390d73b7d3dc456b6f3d31c7dbed.jpg",
        },
        {
            name: "Emmanuel Nkurunziza",
            designation: "Faith-Based Mentor",
            image: "https://i.pinimg.com/1200x/2b/7a/01/2b7a01d9272a3f00a4b380110a87d3dd.jpg",
        },
    ];

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

    const categories = [
        {
            name: "STEM Education",
            courses: 24,
            image:
                "https://images.unsplash.com/photo-1631378297854-185cff6b0986?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3RlbSUyMGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
        },
        {
            name: "Digital & Financial Literacy",
            courses: 18,
            image:
                "https://plus.unsplash.com/premium_photo-1661371340750-f9b83c2e2c51?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRpZ2l0YWwlMjBhbmQlMjBmaW5hbmNpYWwlMjBsaXRlcmFjeXxlbnwwfHwwfHx8MA%3D%3D",
        },
        {
            name: "Green Entrepreneurship",
            courses: 15,
            image:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGVudHJlcHJlbmV1cnNoaXB8ZW58MHx8MHx8fDA%3D",
        },
        {
            name: "Faith-Based Coaching",
            courses: 12,
            image:
                "https://images.unsplash.com/photo-1594453843726-b465f1cac129?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFpdGglMjBiYXNlYiUyMGNvYWNoaW5nfGVufDB8fDB8fHww",
        },
    ];

    if (!mounted) {
        return <div className="min-h-screen bg-background"/>;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Enhanced Hero Carousel - Increased Size */}
            <section className="relative h-[80vh] min-h-[700px] overflow-hidden mt-16">
                <div className="relative w-full h-full">
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
                                className="w-full h-full bg-gradient-to-r from-slate-900/80 to-slate-800/60 flex items-center"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(24, 29, 56, 0.7), rgba(24, 29, 56, 0.7)), url(${slide.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="container mx-auto px-6">
                                    <div className="max-w-3xl">
                                        <h5 className="text-primary-gradient font-semibold text-xl mb-6 animate-fade-in-up">
                                            {slide.subtitle}
                                        </h5>
                                        <h1 className="text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in-up animation-delay-200">
                                            {slide.title}
                                        </h1>
                                        <p className="text-2xl text-gray-200 mb-12 leading-relaxed animate-fade-in-up animation-delay-400">
                                            {slide.description}
                                        </p>
                                        <div
                                            className="flex flex-col sm:flex-row gap-6 animate-fade-in-up animation-delay-600">
                                            <Button
                                                size="lg"
                                                className="bg-primary-gradient hover:opacity-90 hover:scale-105 transition-all duration-200 text-white border-0 px-8 py-4 text-lg"
                                            >
                                                Explore Programs
                                                <ArrowRight className="ml-2 h-6 w-6"/>
                                            </Button>
                                            <Button
                                                size="lg"
                                                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 transition-all duration-200 px-8 py-4 text-lg font-semibold"
                                            >
                                                <Crown className="mr-2 h-5 w-5"/>
                                                Get Premium
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="bg-white/10 border-white text-white hover:bg-white hover:text-slate-900 hover:scale-105 transition-all duration-200 px-8 py-4 text-lg"
                                            >
                                                <UserPlus className="mr-2 h-5 w-5"/>
                                                Join Us
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {carouselSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? "bg-gradient-to-r from-green-400 to-blue-500 scale-125 shadow-lg"
                                    : "bg-white/50 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* Enhanced Services Section with Green/Blue Hover Effects */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`group bg-card rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/50 ${
                                    index % 2 === 0 ? "hover-bg-green" : "hover-bg-blue"
                                }`}
                            >
                                <div className="mb-6">
                                    <service.icon
                                        size={48}
                                        className={`mx-auto transition-all duration-300 group-hover:scale-110 ${
                                            index % 2 === 0
                                                ? "text-green-500 group-hover:text-green-600"
                                                : "text-blue-500 group-hover:text-blue-600"
                                        }`}
                                    />
                                </div>
                                <h5
                                    className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                                        index % 2 === 0
                                            ? "text-foreground group-hover:text-green-600"
                                            : "text-foreground group-hover:text-blue-600"
                                    }`}
                                >
                                    {service.title}
                                </h5>
                                <p className="text-muted-foreground leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1673515334462-8ec684bd664b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTV8fGVsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D"
                                    alt="Students learning"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                            </div>

                            {/* Floating stats card */}
                            <div
                                className="absolute -bottom-8 -right-8 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">1000+</div>
                                    <div className="text-sm opacity-90">Students Empowered</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div
                                className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                About Us
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                                Welcome to 21st Century Academy
                            </h1>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                We&#39;re building Africa&#39;s future through transformative
                                education that bridges traditional knowledge with cutting-edge
                                skills for the digital age.
                            </p>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Our comprehensive programs span STEM education, digital
                                financial literacy, green entrepreneurship, and faith-based
                                coaching - all designed to empower learners across Rwanda and
                                beyond.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {[
                                    "Expert Instructors",
                                    "Online Classes",
                                    "International Certificates",
                                    "Practical Projects",
                                    "Community Impact",
                                    "Career Support",
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0"/>
                                        <span className="text-foreground font-medium">
                      {feature}
                    </span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                size="lg"
                                className="hover:scale-105 transition-transform duration-200"
                            >
                                Learn More About Us
                                <ArrowRight className="ml-2 h-5 w-5"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            {/* Categories Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div
                            className="inline-block bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-primary-gradient px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Programs
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Our{" "}
                            <span className="text-primary-gradient">Learning Pathways</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Discover comprehensive programs designed to equip you with skills
                            for tomorrow&#39;s challenges
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main featured category */}
                        <div className="lg:col-span-2 lg:row-span-2">
                            <div
                                className="relative h-full min-h-[450px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={categories[0].image}
                                    alt={categories[0].name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"/>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div
                                        className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 border border-green-500/20 group-hover:border-green-500/50">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                            {categories[0].name}
                                        </h3>
                                        <p className="text-green-600 dark:text-green-400 font-semibold">
                                            {categories[0].courses} Courses Available
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary categories */}
                        {categories.slice(1).map((category, index) => (
                            <div key={index} className="lg:col-span-2">
                                <div
                                    className="relative h-52 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"/>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div
                                            className={`bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 border ${
                                                index % 2 === 0
                                                    ? "border-blue-500/20 group-hover:border-blue-500/50"
                                                    : "border-green-500/20 group-hover:border-green-500/50"
                                            }`}
                                        >
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                                                {category.name}
                                            </h4>
                                            <p
                                                className={`text-sm font-semibold ${
                                                    index % 2 === 0
                                                        ? "text-blue-600 dark:text-blue-400"
                                                        : "text-green-600 dark:text-green-400"
                                                }`}
                                            >
                                                {category.courses} Courses
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Popular Courses */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div
                            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Featured Courses
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Popular Courses
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Start your learning journey with our most popular and highly-rated
                            courses
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                            >
                                <div className="relative overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                    <div
                                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                        <div className="flex space-x-2">
                                            <Button size="sm" className="rounded-full px-4">
                                                Preview
                                            </Button>
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
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-2xl font-bold text-primary">
                                            {course.price}
                                        </h3>
                                        <div className="flex items-center space-x-1">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={
                                                            i < Math.floor(course.rating)
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                        ({course.reviews})
                      </span>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                        {course.title}
                                    </h4>

                                    <div
                                        className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                                        <div className="flex items-center space-x-1">
                                            <User size={14} className="text-primary"/>
                                            <span>{course.instructor}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock size={14} className="text-primary"/>
                                            <span>{course.duration}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users size={14} className="text-primary"/>
                                            <span>{course.students}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button
                            variant="outline"
                            size="lg"
                            className="hover:scale-105 transition-transform duration-200"
                        >
                            View All Courses
                            <ArrowRight className="ml-2 h-5 w-5"/>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Expert Instructors */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div
                            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Our Team
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Expert Instructors
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Learn from passionate educators and industry leaders committed to
                            your success
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {instructors.map((instructor, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                            >
                                <div className="relative overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={instructor.image}
                                        alt={instructor.name}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                </div>

                                <div className="relative -mt-6 mx-4">
                                    <div className="bg-card border border-border rounded-xl p-1 shadow-lg">
                                        <div className="flex justify-center space-x-2 py-2">
                                            {[FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, socialIndex) => (
                                                <Button
                                                    key={socialIndex}
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-full hover:bg-primary hover:text-white transition-all duration-200 hover:scale-110"
                                                >
                                                    <Icon size={12} />
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-4 text-center">
                                    <h5 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                                        {instructor.name}
                                    </h5>
                                    <p className="text-muted-foreground">
                                        {instructor.designation}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-primary/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div
                            className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            Success Stories
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            What Our Students Say
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Real stories from learners whose lives have been transformed
                            through our programs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className="text-center mb-6">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-primary/20 group-hover:border-primary/40 transition-colors duration-300"
                                    />
                                    <h5 className="font-bold text-foreground text-lg mb-1">
                                        {testimonial.name}
                                    </h5>
                                    <p className="text-muted-foreground">
                                        {testimonial.profession}
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -top-2 -left-2 text-6xl text-primary/20 font-serif">
                                        &#34;
                                    </div>
                                    <p className="text-muted-foreground italic leading-relaxed relative z-10 pl-6">
                                        {testimonial.text}
                                    </p>
                                    <div
                                        className="absolute -bottom-4 -right-2 text-6xl text-primary/20 font-serif rotate-180">
                                        &#34;
                                    </div>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <div className="flex space-x-1">
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

            {/* Stats Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {number: "1,000+", label: "Students Enrolled", icon: Users},
                            {
                                number: "50+",
                                label: "Expert Instructors",
                                icon: GraduationCap,
                            },
                            {number: "75+", label: "Courses Available", icon: BookOpen},
                            {
                                number: "95%",
                                label: "Success Rate",
                                icon: Award,
                            },
                        ].map((stat, index) => (
                            <div key={index} className="text-center group">
                                <stat.icon
                                    className="h-12 w-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"/>
                                <div className="text-3xl lg:text-4xl font-bold mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-lg opacity-90">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Transform Your Future?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                            Join thousands of learners who are building skills for tomorrow.
                            Start your journey today with courses designed for the African
                            context.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200"
                            >
                                Browse Courses
                                <ArrowRight className="ml-2 h-5 w-5"/>
                            </Button>
                            <Button
                                variant="default"
                                size="lg"
                                className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-lg shadow-md transform hover:scale-105 transition-all duration-200"
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-muted/50">
                <div className="container mx-auto px-6">
                    <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-lg">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                                    Stay Updated with 21CA
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Get the latest updates on new courses, success stories, and
                                    educational insights delivered straight to your inbox.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    <Button className="px-8 hover:scale-105 transition-transform duration-200">
                                        Subscribe
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    By subscribing, you agree to our Privacy Policy. Unsubscribe
                                    anytime.
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
