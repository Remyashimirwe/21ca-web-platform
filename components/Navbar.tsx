'use client'
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useUser, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import {
    Menu,
    X,
    ChevronDown,
    Search,
    Sun,
    Moon,
    User,
    Monitor,
    Settings
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {dark} from "@clerk/themes";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [currentLang, setCurrentLang] = useState('EN');
    const [, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isSignedIn, user } = useUser();

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
        { name: 'Programs', href: '/programs' },
        {
            name: 'Pages',
            href: '/pages',
            dropdown: [
                'Blog',
                'Impact Stories',
                'Price',
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

    // Check if user has admin role
    const isAdmin = user?.publicMetadata?.role === 'admin';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-background shadow-md border-b border-border font-poppins`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">

                    {/* Logo with animation */}
                    <Link href="/" className="flex items-center space-x-3 group">
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
                    </Link>

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
                                                    <Link
                                                        href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                        className="flex w-full"
                                                    >
                                                        {subItem}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground font-medium transition-all duration-200 relative group py-2"
                                    >
                                        <span className="relative z-10">{item.name}</span>
                                        {/* Hover underline effect */}
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                                    </Link>
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

                        {/* Authentication Section */}
                        {isSignedIn ? (
                            <div className="hidden lg:flex items-center space-x-3">
                                {/* Dashboard Link */}
                                <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:scale-105 active:scale-95 transition-all duration-200"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>

                                {/* Clerk User Button */}
                                <UserButton
                                    appearance={{
                                        baseTheme: theme === 'dark' ? dark : undefined,
                                        variables: {
                                            colorPrimary: theme === 'dark' ? 'hsl(142, 76%, 36%)' : 'hsl(142, 76%, 36%)',
                                            colorBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                                            colorInputBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                                            colorText: theme === 'dark' ? 'hsl(213, 31%, 91%)' : 'hsl(224, 71%, 4%)',
                                            colorTextSecondary: theme === 'dark' ? 'hsl(215, 16%, 47%)' : 'hsl(215, 16%, 47%)',
                                            borderRadius: '0.5rem',
                                        },
                                        elements: {
                                            avatarBox: "w-8 h-8 hover:scale-110 transition-transform duration-200",
                                            userButtonPopoverCard: theme === 'dark'
                                                ? "border border-slate-700 bg-slate-900/95 backdrop-blur-sm shadow-2xl"
                                                : "border border-slate-200 bg-white/95 backdrop-blur-sm shadow-2xl",
                                            userButtonPopoverActions: theme === 'dark' ? "bg-slate-900" : "bg-white",
                                            userButtonPopoverActionButton: theme === 'dark'
                                                ? "text-slate-100 hover:bg-slate-800 transition-colors duration-200"
                                                : "text-slate-900 hover:bg-slate-100 transition-colors duration-200",
                                            userButtonPopoverActionButtonText: theme === 'dark' ? "text-slate-100" : "text-slate-900",
                                            userButtonPopoverActionButtonIcon: theme === 'dark' ? "text-slate-400" : "text-slate-600",
                                            userPreviewTextContainer: theme === 'dark' ? "text-slate-100" : "text-slate-900",
                                            userPreviewSecondaryIdentifier: theme === 'dark' ? "text-slate-400" : "text-slate-600",
                                            userButtonPopoverFooter: "hidden", // Hide Clerk branding
                                            formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
                                            card: theme === 'dark'
                                                ? "bg-slate-900 border-slate-700"
                                                : "bg-white border-slate-200",
                                            headerTitle: theme === 'dark' ? "text-slate-100" : "text-slate-900",
                                            headerSubtitle: theme === 'dark' ? "text-slate-400" : "text-slate-600",
                                            formFieldInput: theme === 'dark'
                                                ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-green-500"
                                                : "border-slate-200 bg-white text-slate-900 focus:border-green-500",
                                            formFieldLabel: theme === 'dark' ? "text-slate-200" : "text-slate-700",
                                        }
                                    }}
                                    afterSignOutUrl="/"
                                />
                            </div>
                        ) : (
                            <>
                                {/* Sign In Button */}
                                <Link href="/sign-in">
                                    <Button
                                        variant="ghost"
                                        className="hidden lg:inline-flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all duration-200 border-2"
                                    >
                                        <User size={16} />
                                        <span>Sign In</span>
                                    </Button>
                                </Link>

                                {/* Sign Up Button */}
                                <Link href="/sign-up">
                                    <Button
                                        className="hidden lg:inline-flex hover:scale-105 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 border-2"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}

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
                                                <Link
                                                    key={subIndex}
                                                    href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="block text-muted-foreground hover:text-primary py-1 transition-all duration-200 hover:translate-x-1"
                                                >
                                                    {subItem}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="block text-foreground font-medium py-2 hover:text-primary transition-all duration-200 hover:translate-x-1"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}

                        {/* Mobile Authentication Section */}
                        <div className={`pt-4 border-t border-border transition-all duration-300 transform ${
                            isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                        }`} style={{ transitionDelay: `${(navigationItems.length + 2) * 50}ms` }}>
                            {isSignedIn ? (
                                <div className="space-y-3">
                                    <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                                        <Button
                                            variant="outline"
                                            className="w-full flex items-center justify-center space-x-2 hover:scale-105 active:scale-95 transition-all duration-200"
                                        >
                                            <Settings size={16} />
                                            <span>Dashboard</span>
                                        </Button>
                                    </Link>
                                    <div className="flex justify-center">
                                        <UserButton
                                            appearance={{
                                                baseTheme: theme === 'dark' ? dark : undefined,
                                                variables: {
                                                    colorPrimary: theme === 'dark' ? 'hsl(142, 76%, 36%)' : 'hsl(142, 76%, 36%)',
                                                    colorBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                                                    colorInputBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                                                    colorText: theme === 'dark' ? 'hsl(213, 31%, 91%)' : 'hsl(224, 71%, 4%)',
                                                    colorTextSecondary: theme === 'dark' ? 'hsl(215, 16%, 47%)' : 'hsl(215, 16%, 47%)',
                                                    borderRadius: '0.5rem',
                                                },
                                                elements: {
                                                    avatarBox: "w-10 h-10 hover:scale-110 transition-transform duration-200",
                                                    userButtonPopoverCard: theme === 'dark'
                                                        ? "border border-slate-700 bg-slate-900/95 backdrop-blur-sm shadow-2xl"
                                                        : "border border-slate-200 bg-white/95 backdrop-blur-sm shadow-2xl",
                                                    userButtonPopoverActions: theme === 'dark' ? "bg-slate-900" : "bg-white",
                                                    userButtonPopoverActionButton: theme === 'dark'
                                                        ? "text-slate-100 hover:bg-slate-800 transition-colors duration-200"
                                                        : "text-slate-900 hover:bg-slate-100 transition-colors duration-200",
                                                    userButtonPopoverActionButtonText: theme === 'dark' ? "text-slate-100" : "text-slate-900",
                                                    userButtonPopoverActionButtonIcon: theme === 'dark' ? "text-slate-400" : "text-slate-600",
                                                    userPreviewTextContainer: theme === 'dark' ? "text-slate-100" : "text-slate-900",
                                                    userPreviewSecondaryIdentifier: theme === 'dark' ? "text-slate-400" : "text-slate-600",
                                                    userButtonPopoverFooter: "hidden",
                                                    formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
                                                    card: theme === 'dark'
                                                        ? "bg-slate-900 border-slate-700"
                                                        : "bg-white border-slate-200",
                                                    headerTitle: theme === 'dark' ? "text-slate-100" : "text-slate-900",
                                                    headerSubtitle: theme === 'dark' ? "text-slate-400" : "text-slate-600",
                                                    formFieldInput: theme === 'dark'
                                                        ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-green-500"
                                                        : "border-slate-200 bg-white text-slate-900 focus:border-green-500",
                                                    formFieldLabel: theme === 'dark' ? "text-slate-200" : "text-slate-700",
                                                }
                                            }}
                                            afterSignOutUrl="/"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link href="/sign-in">
                                        <Button
                                            variant="outline"
                                            className="w-full flex items-center justify-center space-x-2 hover:scale-105 active:scale-95 transition-all duration-200"
                                        >
                                            <User size={16} />
                                            <span>Sign In</span>
                                        </Button>
                                    </Link>
                                    <Link href="/sign-up">
                                        <Button
                                            className="w-full hover:scale-105 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

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
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;