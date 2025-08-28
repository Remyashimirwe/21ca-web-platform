import React, { useState, useEffect } from 'react';
import {
    Heart,
    Target,
    Eye,
    Users,
    Award,
    Globe,
    BookOpen,
    Lightbulb,
    Shield,
    Leaf,
    Star,
    ArrowRight,
    CheckCircle,
    Calendar,
    MapPin,
    Linkedin,
    Twitter,
    Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeValue, setActiveValue] = useState(0);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Auto-rotate values
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveValue((prev) => (prev + 1) % coreValues.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const stats = [
        { number: '2019', label: 'Founded', icon: Calendar },
        { number: '5,000+', label: 'Students Trained', icon: Users },
        { number: '50+', label: 'Courses Created', icon: BookOpen },
        { number: '15+', label: 'Countries', icon: Globe },
        { number: '98%', label: 'Success Rate', icon: Award },
        { number: '24/7', label: 'Support', icon: Shield }
    ];

    const coreValues = [
        {
            icon: Lightbulb,
            title: 'Innovation',
            description: 'We embrace cutting-edge technologies and innovative teaching methods to deliver world-class education.',
            color: 'from-yellow-400 to-orange-500'
        },
        {
            icon: Heart,
            title: 'Compassion',
            description: 'We believe in nurturing every learner with empathy, understanding, and personalized support.',
            color: 'from-red-400 to-pink-500'
        },
        {
            icon: Target,
            title: 'Excellence',
            description: 'We strive for the highest standards in everything we do, from course content to student experience.',
            color: 'from-blue-400 to-cyan-500'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'We foster a collaborative learning environment where students, instructors, and partners thrive together.',
            color: 'from-green-400 to-emerald-500'
        },
        {
            icon: Leaf,
            title: 'Sustainability',
            description: 'We promote environmentally conscious practices and sustainable development in all our programs.',
            color: 'from-emerald-400 to-green-500'
        }
    ];

    const teamMembers = [
        {
            name: 'Dr. Aline Uwimana',
            role: 'Founder & CEO',
            bio: 'Visionary leader with 15+ years in educational technology and sustainable development.',
            image: '/api/placeholder/300/300',
            linkedin: '#',
            twitter: '#',
            email: 'aline@21ca.edu'
        },
        {
            name: 'Prof. Jean-Baptiste Nzeyimana',
            role: 'Academic Director',
            bio: 'Former MIT researcher specializing in STEM education and curriculum development.',
            image: '/api/placeholder/300/300',
            linkedin: '#',
            twitter: '#',
            email: 'jean@21ca.edu'
        },
        {
            name: 'Sarah Mukamana',
            role: 'Head of Digital Innovation',
            bio: 'Tech entrepreneur passionate about making quality education accessible to all.',
            image: '/api/placeholder/300/300',
            linkedin: '#',
            twitter: '#',
            email: 'sarah@21ca.edu'
        },
        {
            name: 'Dr. Emmanuel Habimana',
            role: 'Director of Programs',
            bio: 'Education specialist with expertise in entrepreneurship and faith-based development.',
            image: '/api/placeholder/300/300',
            linkedin: '#',
            twitter: '#',
            email: 'emmanuel@21ca.edu'
        },
        {
            name: 'Grace Uwase',
            role: 'Community Outreach Manager',
            bio: 'Community development expert focused on bridging education gaps in rural areas.',
            image: '/api/placeholder/300/300',
            linkedin: '#',
            twitter: '#',
            email: 'grace@21ca.edu'
        },
        {
            name: 'David Mugisha',
            role: 'Technology Lead',
            bio: 'Full-stack developer and educational technology innovator.',
            image: '/api/placeholder/300/300',
            linkedin: '#',
            twitter: '#',
            email: 'david@21ca.edu'
        }
    ];

    const milestones = [
        {
            year: '2019',
            title: 'Foundation',
            description: '21st Century Academy was founded with a mission to democratize quality education.',
            achievements: ['Established legal entity', 'Secured initial funding', 'Developed first curriculum']
        },
        {
            year: '2020',
            title: 'Digital Transformation',
            description: 'Launched our first online learning platform during the global pandemic.',
            achievements: ['Built LMS platform', 'Enrolled first 500 students', 'Launched STEM program']
        },
        {
            year: '2021',
            title: 'Program Expansion',
            description: 'Introduced Digital & Financial Literacy and Green Entrepreneurship programs.',
            achievements: ['2,000+ active students', 'Partnership with local banks', 'Mobile learning app']
        },
        {
            year: '2022',
            title: 'Regional Growth',
            description: 'Expanded operations across East Africa and introduced faith-based coaching.',
            achievements: ['Operations in 8 countries', 'Faith-based program launch', '4,000+ graduates']
        },
        {
            year: '2023',
            title: 'Global Recognition',
            description: 'Received international awards and expanded to 15+ countries worldwide.',
            achievements: ['UNESCO recognition', '10,000+ students', 'Corporate partnerships']
        },
        {
            year: '2024',
            title: 'Innovation Leadership',
            description: 'Leading educational innovation with AI-powered learning and sustainability focus.',
            achievements: ['AI integration', 'Sustainability certification', 'Global expansion']
        }
    ];

    const partners = [
        { name: 'UNESCO', logo: '/api/placeholder/150/80' },
        { name: 'World Bank', logo: '/api/placeholder/150/80' },
        { name: 'Microsoft', logo: '/api/placeholder/150/80' },
        { name: 'Google for Education', logo: '/api/placeholder/150/80' },
        { name: 'MIT OpenCourseWare', logo: '/api/placeholder/150/80' },
        { name: 'African Development Bank', logo: '/api/placeholder/150/80' }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 pt-20 pb-16">
                <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className={`text-center transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                        <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                            Transforming Education for a
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">