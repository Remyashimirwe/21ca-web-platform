'use client'
import React, { useState } from 'react';
import {
    Search,
    Clock,
    Users,
    Star,
    ArrowRight,
    Play,
    Download,
    Award,
    Globe,
    Cpu,
    DollarSign,
    Leaf,
    Heart,
    User,
    Target
} from 'lucide-react';

// Program data with comprehensive course listings
const programData = {
    'stem-education': {
        title: 'STEM Education',
        description: 'Innovative Science, Technology, Engineering, and Mathematics programs designed to build critical thinking and problem-solving skills.',
        icon: Cpu,
        color: 'green',
        heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
        totalCourses: 24,
        totalStudents: 2840,
        averageRating: 4.8,
        courses: [
            {
                id: 1,
                title: 'Introduction to Programming with Python',
                instructor: 'Dr. Sarah Uwimana',
                duration: '8 weeks',
                level: 'Beginner',
                price: 49,
                rating: 4.9,
                students: 156,
                description: 'Learn programming fundamentals with Python, focusing on practical applications for African contexts.',
                image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&auto=format&fit=crop&q=80',
                tags: ['Python', 'Programming', 'Beginner']
            },
            {
                id: 2,
                title: 'Mathematics for Real World Problem Solving',
                instructor: 'Prof. James Nyandwi',
                duration: '10 weeks',
                level: 'Intermediate',
                price: 59,
                rating: 4.7,
                students: 203,
                description: 'Applied mathematics concepts for solving community and business challenges.',
                image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=80',
                tags: ['Mathematics', 'Problem Solving', 'Applied Math']
            },
            {
                id: 3,
                title: 'Robotics and Arduino Programming',
                instructor: 'Engineer Alice Mutesi',
                duration: '12 weeks',
                level: 'Advanced',
                price: 89,
                rating: 4.9,
                students: 87,
                description: 'Build and program robots using Arduino microcontrollers for automation solutions.',
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&auto=format&fit=crop&q=80',
                tags: ['Robotics', 'Arduino', 'Engineering']
            },
            {
                id: 4,
                title: 'Data Science for Beginners',
                instructor: 'Dr. Michael Nzeyimana',
                duration: '6 weeks',
                level: 'Beginner',
                price: 45,
                rating: 4.6,
                students: 145,
                description: 'Introduction to data analysis and visualization using modern tools.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
                tags: ['Data Science', 'Analytics', 'Visualization']
            },
            {
                id: 5,
                title: 'Chemistry in Daily Life',
                instructor: 'Dr. Grace Uwimana',
                duration: '8 weeks',
                level: 'Beginner',
                price: 39,
                rating: 4.5,
                students: 178,
                description: 'Explore chemistry concepts through everyday examples and local applications.',
                image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400&auto=format&fit=crop&q=80',
                tags: ['Chemistry', 'Science', 'Practical']
            },
            {
                id: 6,
                title: 'Physics and Energy Solutions',
                instructor: 'Prof. Emmanuel Habimana',
                duration: '10 weeks',
                level: 'Intermediate',
                price: 65,
                rating: 4.8,
                students: 112,
                description: 'Understanding physics principles for renewable energy and sustainable technology.',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&auto=format&fit=crop&q=80',
                tags: ['Physics', 'Energy', 'Sustainability']
            }
        ]
    },
    'digital-financial-literacy': {
        title: 'Digital & Financial Literacy',
        description: 'Essential digital skills and financial knowledge for the modern economy, with focus on mobile banking and digital payments.',
        icon: DollarSign,
        color: 'blue',
        heroImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&auto=format&fit=crop&q=80',
        totalCourses: 18,
        totalStudents: 1960,
        averageRating: 4.7,
        courses: [
            {
                id: 1,
                title: 'Mobile Banking Fundamentals',
                instructor: 'Jean Claude Mugabo',
                duration: '4 weeks',
                level: 'Beginner',
                price: 29,
                rating: 4.8,
                students: 298,
                description: 'Master mobile money, digital payments, and online banking safely and effectively.',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&auto=format&fit=crop&q=80',
                tags: ['Mobile Banking', 'Digital Payments', 'Finance']
            },
            {
                id: 2,
                title: 'Personal Financial Planning',
                instructor: 'Marie Uwizeye',
                duration: '6 weeks',
                level: 'Beginner',
                price: 39,
                rating: 4.6,
                students: 234,
                description: 'Create budgets, build savings, and plan for financial goals using digital tools.',
                image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=80',
                tags: ['Budgeting', 'Savings', 'Financial Planning']
            },
            {
                id: 3,
                title: 'Cryptocurrency and Digital Assets',
                instructor: 'David Nkurunziza',
                duration: '8 weeks',
                level: 'Advanced',
                price: 79,
                rating: 4.9,
                students: 156,
                description: 'Understanding blockchain technology and digital currencies in the African context.',
                image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&auto=format&fit=crop&q=80',
                tags: ['Cryptocurrency', 'Blockchain', 'Digital Assets']
            },
            {
                id: 4,
                title: 'Digital Marketing for Small Business',
                instructor: 'Peace Mukamana',
                duration: '10 weeks',
                level: 'Intermediate',
                price: 69,
                rating: 4.7,
                students: 189,
                description: 'Build an online presence and grow your business using digital marketing strategies.',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80',
                tags: ['Digital Marketing', 'Social Media', 'Business']
            }
        ]
    },
    'green-entrepreneurship': {
        title: 'Green Entrepreneurship',
        description: 'Sustainable business development focusing on environmental solutions and circular economy principles.',
        icon: Leaf,
        color: 'emerald',
        heroImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80',
        totalCourses: 15,
        totalStudents: 1240,
        averageRating: 4.9,
        courses: [
            {
                id: 1,
                title: 'Solar Energy Business Bootcamp',
                instructor: 'Grace Nyirahabimana',
                duration: '12 weeks',
                level: 'Advanced',
                price: 99,
                rating: 4.9,
                students: 98,
                description: 'Complete guide to starting and scaling a solar energy business in Rwanda.',
                image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&auto=format&fit=crop&q=80',
                tags: ['Solar Energy', 'Business', 'Renewable Energy']
            },
            {
                id: 2,
                title: 'Sustainable Agriculture Innovations',
                instructor: 'Dr. Patrick Hakizimana',
                duration: '8 weeks',
                level: 'Intermediate',
                price: 55,
                rating: 4.8,
                students: 167,
                description: 'Modern farming techniques that protect the environment while increasing yields.',
                image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
                tags: ['Agriculture', 'Sustainability', 'Innovation']
            },
            {
                id: 3,
                title: 'Waste Management Solutions',
                instructor: 'Claudine Murekatete',
                duration: '6 weeks',
                level: 'Beginner',
                price: 35,
                rating: 4.7,
                students: 134,
                description: 'Turn waste into business opportunities through recycling and upcycling.',
                image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=80',
                tags: ['Waste Management', 'Recycling', 'Circular Economy']
            },
            {
                id: 4,
                title: 'Eco-Tourism Development',
                instructor: 'Joseph Uwimana',
                duration: '10 weeks',
                level: 'Intermediate',
                price: 75,
                rating: 4.6,
                students: 89,
                description: 'Develop sustainable tourism businesses that preserve natural resources.',
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&auto=format&fit=crop&q=80',
                tags: ['Tourism', 'Sustainability', 'Conservation']
            }
        ]
    },
    'faith-based-coaching': {
        title: 'Faith-Based Coaching',
        description: 'Integrating spiritual wisdom with personal development and community leadership principles.',
        icon: Heart,
        color: 'purple',
        heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80',
        totalCourses: 12,
        totalStudents: 890,
        averageRating: 4.9,
        courses: [
            {
                id: 1,
                title: 'Leadership Through Service',
                instructor: 'Emmanuel Nkurunziza',
                duration: '8 weeks',
                level: 'Beginner',
                price: 45,
                rating: 4.9,
                students: 145,
                description: 'Develop leadership skills rooted in service and community empowerment.',
                image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&auto=format&fit=crop&q=80',
                tags: ['Leadership', 'Service', 'Community']
            },
            {
                id: 2,
                title: 'Ethics in Business and Life',
                instructor: 'Pastor Ruth Mukamana',
                duration: '6 weeks',
                level: 'Intermediate',
                price: 35,
                rating: 4.8,
                students: 178,
                description: 'Build a foundation of ethical decision-making in business and personal relationships.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
                tags: ['Ethics', 'Values', 'Character']
            },
            {
                id: 3,
                title: 'Youth Mentorship Program',
                instructor: 'Reverend Samuel Habimana',
                duration: '10 weeks',
                level: 'Intermediate',
                price: 55,
                rating: 4.9,
                students: 123,
                description: 'Learn to mentor young people through faith-based principles and practical guidance.',
                image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&auto=format&fit=crop&q=80',
                tags: ['Mentorship', 'Youth Development', 'Guidance']
            },
            {
                id: 4,
                title: 'Spiritual Wellness and Balance',
                instructor: 'Sister Mary Uwamahoro',
                duration: '4 weeks',
                level: 'Beginner',
                price: 25,
                rating: 4.7,
                students: 203,
                description: 'Find balance between spiritual growth and practical life management.',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=80',
                tags: ['Wellness', 'Balance', 'Spiritual Growth']
            }
        ]
    }
};

const ProgramPages = () => {
    const [currentProgram, setCurrentProgram] = useState('stem-education');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [selectedPriceRange, setSelectedPriceRange] = useState('All');
    const [sortBy, setSortBy] = useState('popular');

    const program = programData[currentProgram];
    const Icon = program.icon;

    // Filter and search functionality
    const filteredCourses = program.courses.filter((course: { title: string; instructor: string; description: string; tags: any[]; level: string; price: number; }) => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;

        const matchesPrice = selectedPriceRange === 'All' ||
            (selectedPriceRange === 'Free' && course.price === 0) ||
            (selectedPriceRange === 'Under $50' && course.price < 50) ||
            (selectedPriceRange === '$50-$75' && course.price >= 50 && course.price <= 75) ||
            (selectedPriceRange === 'Over $75' && course.price > 75);

        return matchesSearch && matchesLevel && matchesPrice;
    });

    // Sort courses
    const sortedCourses = [...filteredCourses].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'price':
                return a.price - b.price;
            case 'students':
                return b.students - a.students;
            default:
                return b.rating * b.students - a.rating * a.students;
        }
    });

    const getColorClasses = (color: string) => {
        const colors = {
            green: {
                primary: 'text-green-600',
                bg: 'bg-green-50 dark:bg-green-900/20',
                border: 'border-green-200 dark:border-green-800',
                hover: 'hover:bg-green-100 dark:hover:bg-green-900/30',
                gradient: 'from-green-500 to-emerald-600'
            },
            blue: {
                primary: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                border: 'border-blue-200 dark:border-blue-800',
                hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
                gradient: 'from-blue-500 to-cyan-600'
            },
            emerald: {
                primary: 'text-emerald-600',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                border: 'border-emerald-200 dark:border-emerald-800',
                hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
                gradient: 'from-emerald-500 to-green-600'
            },
            purple: {
                primary: 'text-purple-600',
                bg: 'bg-purple-50 dark:bg-purple-900/20',
                border: 'border-purple-200 dark:border-purple-800',
                hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
                gradient: 'from-purple-500 to-indigo-600'
            }
        };
        return colors[color];
    };

    const colorClasses = getColorClasses(program.color);

    return (
        <div className="min-h-screen bg-background pt-16">

            {/* Program Selector Tabs */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    {/* Mobile Dropdown (hidden on md and up) */}
                    <div className="block md:hidden">
                        <select
                            value={currentProgram}
                            onChange={(e) => setCurrentProgram(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            {Object.entries(programData).map(([key, prog]) => (
                                <option key={key} value={key}>{prog.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Desktop Scrollable Tabs (hidden on small screens) */}
                    <div className="hidden md:flex overflow-x-auto space-x-2 scrollbar-hide">
                        {Object.entries(programData).map(([key, prog]) => {
                            const ProgramIcon = prog.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setCurrentProgram(key)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 hover:scale-105 ${
                                        currentProgram === key
                                            ? `bg-gradient-to-r ${getColorClasses(prog.color).gradient} text-white shadow-lg`
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                                >
                                    <ProgramIcon size={16} />
                                    <span className="font-medium">{prog.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Program Hero Section */}
            <section className="relative h-96 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${program.heroImage})`
                    }}
                />
                <div className="relative container mx-auto px-6 h-full flex items-center">
                    <div className="max-w-2xl text-white">
                        <div className="flex items-center space-x-3 mb-4">
                            <Icon size={32} className="text-white" />
                            <h1 className="text-4xl lg:text-5xl font-bold">{program.title}</h1>
                        </div>
                        <p className="text-xl text-gray-200 mb-6">{program.description}</p>

                        {/* Stats */}
                        <div className="flex space-x-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{program.totalCourses}</div>
                                <div className="text-sm opacity-90">Courses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{program.totalStudents.toLocaleString()}+</div>
                                <div className="text-sm opacity-90">Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{program.averageRating}</div>
                                <div className="text-sm opacity-90">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-8 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="bg-card rounded-xl p-6 shadow-lg">
                        <div className="grid lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search courses, instructors, or topics..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Level Filter */}
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="All">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>

                            {/* Sort By */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="rating">Highest Rated</option>
                                <option value="price">Lowest Price</option>
                                <option value="students">Most Students</option>
                            </select>
                        </div>

                        {/* Additional Filters */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-sm text-muted-foreground">Price Range:</span>
                            {['All', 'Free', 'Under $50', '$50-$75', 'Over $75'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setSelectedPriceRange(range)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                        selectedPriceRange === range
                                            ? `bg-gradient-to-r ${colorClasses.gradient} text-white`
                                            : 'bg-accent text-accent-foreground hover:bg-accent/80'
                                    }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 text-sm text-muted-foreground">
                            Showing {sortedCourses.length} of {program.courses.length} courses
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Grid */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    {sortedCourses.length === 0 ? (
                        <div className="text-center py-16">
                            <Search size={64} className="mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-2xl font-bold text-foreground mb-2">No courses found</h3>
                            <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                                >
                                    {/* Course Image */}
                                    <div className="relative overflow-hidden h-48">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Level Badge */}
                                        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${colorClasses.bg} ${colorClasses.primary}`}>
                                            {course.level}
                                        </div>

                                        {/* Price Badge */}
                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="font-bold text-foreground">${course.price}</span>
                                        </div>

                                        {/* Play Button on Hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors duration-200">
                                                <Play size={24} className="text-white ml-1" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Course Content */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                            {course.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {course.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {course.tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className={`px-2 py-1 rounded text-xs font-medium ${colorClasses.bg} ${colorClasses.primary}`}
                                                >
                          {tag}
                        </span>
                                            ))}
                                        </div>

                                        {/* Course Meta */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                            <div className="flex items-center space-x-1">
                                                <User size={12} className={colorClasses.primary} />
                                                <span>{course.instructor}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock size={12} className={colorClasses.primary} />
                                                <span>{course.duration}</span>
                                            </div>
                                        </div>

                                        {/* Rating and Students */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            className={
                                                                i < Math.floor(course.rating)
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-300'
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-medium text-foreground">{course.rating}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                                <Users size={12} />
                                                <span>{course.students}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-2">
                                            <button className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-gradient-to-r ${colorClasses.gradient} text-white hover:shadow-lg`}>
                                                Enroll Now
                                            </button>
                                            <button className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                                                Preview
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Program Features */}
            <section className={`py-16 ${colorClasses.bg}`}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our {program.title} Program?</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Award, title: 'Certified Learning', description: 'Get industry-recognized certificates' },
                            { icon: Users, title: 'Expert Mentorship', description: 'Learn from experienced professionals' },
                            { icon: Globe, title: 'Global Standards', description: 'World-class curriculum standards' },
                            { icon: Target, title: 'Practical Focus', description: 'Real-world application emphasis' }
                        ].map((feature, index) => (
                            <div key={index} className="text-center p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <feature.icon size={32} className={`mx-auto mb-3 ${colorClasses.primary}`} />
                                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your {program.title} Journey?</h2>
                    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Join thousands of learners who are transforming their careers and communities through our {program.title.toLowerCase()} programs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 bg-gradient-to-r ${colorClasses.gradient} text-white shadow-lg hover:shadow-xl`}>
                            View All Courses
                            <ArrowRight className="ml-2 inline" size={16} />
                        </button>
                        <button className="px-8 py-3 rounded-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-all duration-200 hover:scale-105">
                            Download Brochure
                            <Download className="ml-2 inline" size={16} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Individual Program Components for more detailed views
const STEMEducation = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const stemCourses = [
        {
            title: 'AI and Machine Learning Basics',
            instructor: 'Dr. Sarah Uwimana',
            duration: '10 weeks',
            level: 'Intermediate',
            price: 85,
            rating: 4.8,
            students: 134,
            category: 'Technology',
            tags: ['AI', 'Machine Learning', 'Python']
        },
        {
            title: 'Environmental Science Lab',
            instructor: 'Prof. Green Habimana',
            duration: '6 weeks',
            level: 'Beginner',
            price: 35,
            rating: 4.6,
            students: 187,
            category: 'Science',
            tags: ['Environment', 'Laboratory', 'Research']
        },
        {
            title: 'Engineering Design Thinking',
            instructor: 'Eng. Marie Uwizera',
            duration: '8 weeks',
            level: 'Intermediate',
            price: 65,
            rating: 4.7,
            students: 156,
            category: 'Engineering',
            tags: ['Design', 'Innovation', 'Problem Solving']
        }
    ];

    return (
        <div className="py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">STEM Education Courses</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Build the foundation for tomorrow&#39;s innovations with our comprehensive STEM curriculum
                    </p>
                </div>

                {/* Search and Categories */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="text"
                                placeholder="Search STEM courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="All">All Categories</option>
                            <option value="Technology">Technology</option>
                            <option value="Science">Science</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Mathematics">Mathematics</option>
                        </select>
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Technology', 'Science', 'Engineering', 'Mathematics'].map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                    selectedCategory === category
                                        ? 'bg-green-500 text-white'
                                        : 'bg-accent text-accent-foreground hover:bg-accent/80'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stemCourses
                        .filter(course =>
                            selectedCategory === 'All' || course.category === selectedCategory
                        )
                        .filter(course =>
                            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((course, index) => (
                            <div key={index} className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
                                <h4 className="font-bold text-lg mb-2">{course.title}</h4>
                                <p className="text-muted-foreground text-sm mb-4">By {course.instructor}</p>

                                <div className="flex items-center justify-between text-sm mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1">
                                            <Clock size={12} className="text-green-500" />
                                            <span>{course.duration}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Users size={12} className="text-green-500" />
                                            <span>{course.students}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">{course.rating}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-green-600">${course.price}</span>
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
                                        Enroll
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ProgramPages;