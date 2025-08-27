'use client'
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import {
    Menu,
    X,
    ChevronDown,
    Search,
    Sun,
    Moon,
    User,
    Monitor
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [currentLang, setCurrentLang] = useState('EN');
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Handle hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const languages = [
        { code: 'EN', name: 'English' },
        { code: 'FR', name: 'Français' },
        { code: 'RW', name: 'Kinyarwanda' }
    ];

    const navigationItems = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        {
            name: 'Programs',
            href: '/programs',
            dropdown: [
                'STEM Education',
                'Digital & Financial Literacy',
                'Green Entrepreneurship',
                'Faith-Based Coaching'
            ]
        },
        { name: 'Courses', href: '/courses' },
        { name: 'Resources', href: '/resources' },
        {
            name: 'Pages',
            href: '#',
            dropdown: [
                'Blog',
                'Impact Stories',
                'Success Metrics',
                'Contact'
            ]
        },
        { name: 'Support', href: '/support' }
    ];

    const handleDropdownToggle = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="h-4 w-4" />;
            case 'dark':
                return <Moon className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />;
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-poppins ${
            scrolled
                ? 'bg-background/90 backdrop-blur-lg shadow-lg border-b border-border/50'
                : 'bg-background border-b border-border'
        }`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">

                    {/* Logo with animation */}
                    <div className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                            <Image
                                src="/logo.png"
                                alt="21st Century Academy Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-xl font-semibold text-foreground transition-colors duration-300">
        21st Century Academy
    </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navigationItems.map((item, index) => (
                            <div key={item.name} className="relative">
                                {item.dropdown ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-all duration-200 py-2 relative overflow-hidden group"
                                                onMouseEnter={() => setActiveDropdown(index)}
                                                onMouseLeave={() => setActiveDropdown(null)}
                                            >
                                                <span className="font-medium relative z-10">{item.name}</span>
                                                <ChevronDown
                                                    size={16}
                                                    className="transition-transform duration-200 relative z-10"
                                                />
                                                {/* Hover underline effect */}
                                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-64"
                                            align="start"
                                            sideOffset={4}
                                        >
                                            {item.dropdown.map((subItem, subIndex) => (
                                                <DropdownMenuItem
                                                    key={subIndex}
                                                    asChild
                                                    className="cursor-pointer transition-all duration-200 hover:translate-x-1"
                                                >
                                                    <a
                                                        href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                        className="flex w-full"
                                                    >
                                                        {subItem}
                                                    </a>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <a
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground font-medium transition-all duration-200 relative group py-2"
                                    >
                                        <span className="relative z-10">{item.name}</span>
                                        {/* Hover underline effect */}
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">

                        {/* Language Switcher - Desktop Only */}
                        <div className="hidden lg:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="font-medium">
                                        {currentLang}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {languages.map((lang) => (
                                        <DropdownMenuItem
                                            key={lang.code}
                                            onClick={() => setCurrentLang(lang.code)}
                                            className={`cursor-pointer transition-all duration-200 ${
                                                currentLang === lang.code
                                                    ? 'bg-accent text-accent-foreground'
                                                    : ''
                                            }`}
                                        >
                                            {lang.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Search Icon with animation */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:scale-110 active:scale-95 transition-all duration-200"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </Button>

                        {/* Enhanced Theme Switcher with System option */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:scale-110 active:scale-95 transition-all duration-200"
                                    aria-label="Toggle theme"
                                >
                                    <div className="relative w-5 h-5">
                                        {getThemeIcon()}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setTheme('light')}
                                    className="cursor-pointer"
                                >
                                    <Sun className="mr-2 h-4 w-4" />
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme('dark')}
                                    className="cursor-pointer"
                                >
                                    <Moon className="mr-2 h-4 w-4" />
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme('system')}
                                    className="cursor-pointer"
                                >
                                    <Monitor className="mr-2 h-4 w-4" />
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Sign In with hover effect */}
                        <Button
                            variant="ghost"
                            className="hidden lg:inline-flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                            <User size={16} />
                            <span>Sign In</span>
                        </Button>

                        {/* Sign Up Button with enhanced animation */}
                        <Button
                            className="hidden lg:inline-flex hover:scale-105 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Sign Up
                        </Button>

                        {/* Mobile Menu Toggle with animation */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden transition-all duration-200"
                        >
                            <div className="w-6 h-6 relative">
                                <Menu
                                    size={24}
                                    className={`absolute inset-0 transition-all duration-300 transform ${
                                        isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                                    }`}
                                />
                                <X
                                    size={24}
                                    className={`absolute inset-0 transition-all duration-300 transform ${
                                        isMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                                    }`}
                                />
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu with slide animation */}
                <div className={`lg:hidden border-t border-border overflow-hidden transition-all duration-300 ${
                    isMenuOpen ? 'max-h-screen py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                }`}>
                    <div className="flex flex-col space-y-4">
                        {navigationItems.map((item, index) => (
                            <div
                                key={item.name}
                                className={`transition-all duration-300 transform ${
                                    isMenuOpen
                                        ? 'translate-x-0 opacity-100'
                                        : '-translate-x-4 opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                {item.dropdown ? (
                                    <div>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleDropdownToggle(index)}
                                            className="flex items-center justify-between w-full text-left font-medium py-2 h-auto"
                                        >
                                            <span>{item.name}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-200 ${
                                                    activeDropdown === index ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </Button>

                                        <div className={`ml-4 space-y-2 overflow-hidden transition-all duration-300 ${
                                            activeDropdown === index ? 'max-h-screen mt-2 opacity-100' : 'max-h-0 mt-0 opacity-0'
                                        }`}>
                                            {item.dropdown.map((subItem, subIndex) => (
                                                <a
                                                    key={subIndex}
                                                    href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="block text-muted-foreground hover:text-primary py-1 transition-all duration-200 hover:translate-x-1"
                                                >
                                                    {subItem}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        href={item.href}
                                        className="block text-foreground font-medium py-2 hover:text-primary transition-all duration-200 hover:translate-x-1"
                                    >
                                        {item.name}
                                    </a>
                                )}
                            </div>
                        ))}

                        {/* Mobile Language Switcher */}
                        <div className={`pt-4 border-t border-border transition-all duration-300 transform ${
                            isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                        }`} style={{ transitionDelay: `${navigationItems.length * 50}ms` }}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-foreground font-medium">Language</span>
                                <span className="text-sm text-muted-foreground">{currentLang}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {languages.map((lang) => (
                                    <Button
                                        key={lang.code}
                                        variant={currentLang === lang.code ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentLang(lang.code)}
                                        className="hover:scale-105 active:scale-95 transition-all duration-200"
                                    >
                                        {lang.code}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Theme Switcher */}
                        <div className={`pt-4 border-t border-border transition-all duration-300 transform ${
                            isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                        }`} style={{ transitionDelay: `${(navigationItems.length + 1) * 50}ms` }}>
                            <span className="text-foreground font-medium mb-3 block">Theme</span>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={theme === 'light' ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTheme('light')}
                                    className="hover:scale-105 active:scale-95 transition-all duration-200"
                                >
                                    <Sun className="mr-1 h-3 w-3" />
                                    Light
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTheme('dark')}
                                    className="hover:scale-105 active:scale-95 transition-all duration-200"
                                >
                                    <Moon className="mr-1 h-3 w-3" />
                                    Dark
                                </Button>
                                <Button
                                    variant={theme === 'system' ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTheme('system')}
                                    className="hover:scale-105 active:scale-95 transition-all duration-200"
                                >
                                    <Monitor className="mr-1 h-3 w-3" />
                                    System
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Auth Buttons */}
                        <div className={`pt-4 space-y-3 transition-all duration-300 transform ${
                            isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                        }`} style={{ transitionDelay: `${(navigationItems.length + 2) * 50}ms` }}>
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center space-x-2 hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                                <User size={16} />
                                <span>Sign In</span>
                            </Button>
                            <Button
                                className="w-full hover:scale-105 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;