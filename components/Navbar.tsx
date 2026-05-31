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
    Settings,
    BookOpen,
    Zap,
    HelpCircle,
    Globe,
    ArrowRight,
    Sparkles
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
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        setMounted(true);
    }, []);

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
        { name: 'Explore', href: '/programs' },
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

    const isAdmin = user?.publicMetadata?.role === 'admin';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 font-poppins transition-all duration-500 ${
            scrolled
                ? 'bg-background/50 backdrop-blur-2xl border-b border-border/30 shadow-2xl'
                : 'bg-background/20 backdrop-blur-xl border-b border-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                {/* Desktop & Mobile Navbar */}
                <div className="flex justify-between items-center h-20 lg:h-24">
                    {/* Logo & Brand */}
                    <Link href="/" className="flex items-center gap-4 group flex-shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 group-hover:scale-110"></div>
                            <div className="relative w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 group-hover:border-primary/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                                <Image
                                    src="/logo.png"
                                    alt="21st Century Academy"
                                    width={56}
                                    height={56}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">21st</span>
                                <Sparkles className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-xs lg:text-sm text-muted-foreground font-semibold">Century Academy</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:justify-center items-center gap-1">
                        {navigationItems.map((item) => (
                            <div key={item.name} className="relative group">
                                {item.dropdown ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center gap-2 text-base font-semibold text-foreground/80 hover:text-primary px-4 py-2 rounded-xl transition-all duration-300 hover:bg-primary/5 group"
                                            >
                                                {item.name === 'Programs' && <BookOpen size={20} className="group-hover:text-primary transition-colors" />}
                                                {item.name === 'Explore' && <Zap size={20} className="group-hover:text-primary transition-colors" />}
                                                {item.name === 'Pages' && <Globe size={20} className="group-hover:text-primary transition-colors" />}
                                                <span>{item.name}</span>
                                                <ChevronDown
                                                    size={18}
                                                    className="transition-all duration-300 group-hover:rotate-180 text-foreground/60 group-hover:text-primary"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className="w-64 mt-3 bg-background/80 backdrop-blur-xl text-foreground border border-border/50 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                                            align="start"
                                            sideOffset={8}
                                        >
                                            {item.dropdown.map((subItem, idx) => (
                                                <DropdownMenuItem
                                                    key={idx}
                                                    asChild
                                                    className="cursor-pointer text-base py-3 px-4 transition-all duration-200 hover:bg-primary/10 hover:text-primary rounded-xl m-1 group/item"
                                                >
                                                    <Link
                                                        href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                        className="flex items-center gap-3 w-full"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-primary group-hover/item:scale-150 transition-transform"></span>
                                                        <span className="flex-1">{subItem}</span>
                                                        <ArrowRight size={16} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-2 text-base font-semibold text-foreground/80 hover:text-primary px-4 py-2 rounded-xl transition-all duration-300 hover:bg-primary/5 relative group"
                                    >
                                        {item.name === 'Home' && <BookOpen size={20} className="group-hover:text-primary transition-colors" />}
                                        {item.name === 'Support' && <HelpCircle size={20} className="group-hover:text-primary transition-colors" />}
                                        <span>{item.name}</span>
                                        <span className="absolute bottom-1 left-4 w-0 h-1 bg-gradient-to-r from-primary to-primary/50 group-hover:w-[calc(100%-2rem)] transition-all duration-300 rounded-full"></span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        {/* Search Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl p-2 h-12 w-12 relative group"
                            aria-label="Search"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Search size={22} className="relative z-10" />
                        </Button>

                        {/* Language Selector - Desktop Only */}
                        <div className="hidden lg:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 text-base font-semibold px-4 py-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 h-12 group"
                                    >
                                        <Globe size={20} className="group-hover:text-primary transition-colors" />
                                        <span>{currentLang}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="mt-3 bg-background/80 backdrop-blur-xl text-foreground border border-border/50 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                                >
                                    {languages.map((lang) => (
                                        <DropdownMenuItem
                                            key={lang.code}
                                            onClick={() => setCurrentLang(lang.code)}
                                            className={`cursor-pointer text-base py-3 px-4 transition-all duration-200 rounded-xl m-1 group/item ${
                                                currentLang === lang.code
                                                    ? 'bg-primary/20 text-primary font-semibold'
                                                    : 'hover:bg-primary/10 hover:text-primary'
                                            }`}
                                        >
                                            {lang.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Theme Toggle - Desktop Only */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl p-2 h-12 w-12 hidden lg:flex relative group"
                                    aria-label="Toggle theme"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        {getThemeIcon()}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="mt-3 bg-background/80 backdrop-blur-xl text-foreground border border-border/50 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                            >
                                <DropdownMenuItem
                                    onClick={() => setTheme('light')}
                                    className="cursor-pointer text-base py-3 px-4 transition-all duration-200 hover:bg-primary/10 rounded-xl m-1 flex items-center gap-3 group/item"
                                >
                                    <Sun size={18} className="group-hover/item:text-primary transition-colors" />
                                    <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme('dark')}
                                    className="cursor-pointer text-base py-3 px-4 transition-all duration-200 hover:bg-primary/10 rounded-xl m-1 flex items-center gap-3 group/item"
                                >
                                    <Moon size={18} className="group-hover/item:text-primary transition-colors" />
                                    <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme('system')}
                                    className="cursor-pointer text-base py-3 px-4 transition-all duration-200 hover:bg-primary/10 rounded-xl m-1 flex items-center gap-3 group/item"
                                >
                                    <Monitor size={18} className="group-hover/item:text-primary transition-colors" />
                                    <span>System</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Auth Buttons */}
                        {isSignedIn ? (
                            <div className="hidden lg:flex items-center gap-4">
                                <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 text-base font-semibold px-6 py-3 rounded-xl h-12 transition-all duration-300 border-primary/30 hover:border-primary/60 hover:bg-primary/5 hover:text-primary relative group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        <Settings size={20} className="relative z-10" />
                                        <span className="relative z-10">Dashboard</span>
                                    </Button>
                                </Link>

                                <UserButton
                                    appearance={{
                                        baseTheme: theme === 'dark' ? dark : undefined,
                                        variables: {
                                            colorPrimary: theme === 'dark' ? 'hsl(142, 76%, 36%)' : 'hsl(142, 76%, 36%)',
                                            colorBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                                            colorInputBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                                            colorText: theme === 'dark' ? 'hsl(213, 31%, 91%)' : 'hsl(224, 71%, 4%)',
                                            colorTextSecondary: theme === 'dark' ? 'hsl(215, 16%, 47%)' : 'hsl(215, 16%, 47%)',
                                            borderRadius: '1rem',
                                        },
                                        elements: {
                                            avatarBox: "w-12 h-12 hover:scale-110 transition-transform duration-300 rounded-xl",
                                        }
                                    }}
                                    afterSignOutUrl="/"
                                />
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-3">
                                <Link href="/sign-in">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 text-base font-semibold px-6 py-3 rounded-xl h-12 transition-all duration-300 border-primary/30 hover:border-primary/60 hover:bg-primary/5 hover:text-primary relative group"
                                    >
                                        <User size={20} />
                                        <span>Sign In</span>
                                    </Button>
                                </Link>

                                <Link href="/sign-up">
                                    <Button
                                        className="flex items-center gap-2 text-base font-semibold px-7 py-3 rounded-xl h-12 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 relative group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-300"></div>
                                        <Zap size={20} className="relative z-10" />
                                        <span className="relative z-10">Get Started</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden transition-all duration-300 rounded-xl p-2 h-12 w-12 hover:bg-primary/10 relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="w-6 h-6 relative z-10 flex flex-col justify-center items-center gap-1.5">
                                <Menu
                                    size={24}
                                    className={`absolute transition-all duration-300 ${
                                        isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                                    }`}
                                />
                                <X
                                    size={24}
                                    className={`absolute transition-all duration-300 ${
                                        isMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                                    }`}
                                />
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden border-t border-border/30 overflow-hidden transition-all duration-300 ${
                    isMenuOpen ? 'max-h-screen py-6 opacity-100' : 'max-h-0 py-0 opacity-0'
                }`}>
                    <div className="space-y-3">
                        {/* Mobile Navigation Items */}
                        <div className="space-y-2 px-2 mb-6">
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
                                                className="flex items-center justify-between w-full text-left text-base font-semibold py-3 px-4 h-auto rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                                            >
                                                <span>{item.name}</span>
                                                <ChevronDown
                                                    size={20}
                                                    className={`transition-transform duration-300 group-hover:text-primary ${
                                                        activeDropdown === index ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </Button>

                                            <div className={`ml-4 space-y-2 overflow-hidden transition-all duration-300 ${
                                                activeDropdown === index ? 'max-h-screen mt-2 opacity-100' : 'max-h-0 mt-0 opacity-0'
                                            }`}>
                                                {item.dropdown.map((subItem, subIdx) => (
                                                    <Link
                                                        key={subIdx}
                                                        href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                        className="flex items-center gap-3 text-foreground hover:text-primary py-3 px-4 transition-all duration-200 hover:bg-primary/10 rounded-xl group/item"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-primary group-hover/item:scale-150 transition-transform"></span>
                                                        <span className="text-base">{subItem}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="block text-foreground font-semibold py-3 px-4 hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-xl text-base group relative"
                                        >
                                            <span>{item.name}</span>
                                            <span className="absolute bottom-2 left-4 w-0 h-1 bg-gradient-to-r from-primary to-primary/50 group-hover:w-[calc(100%-2rem)] transition-all duration-300 rounded-full"></span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile Auth Section */}
                        <div className={`pt-4 border-t border-border/30 space-y-3 px-2 transition-all duration-300 transform ${
                            isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                        }`} style={{ transitionDelay: `${(navigationItems.length + 2) * 50}ms` }}>
                            {isSignedIn ? (
                                <div className="space-y-3">
                                    <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="w-full block">
                                        <Button
                                            variant="outline"
                                            className="w-full flex items-center justify-center gap-2 text-base font-semibold py-3 rounded-xl h-12 hover:bg-primary/10 hover:text-primary border-primary/30 transition-all duration-200"
                                        >
                                            <Settings size={20} />
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
                                                    borderRadius: '1rem',
                                                },
                                                elements: {
                                                    avatarBox: "w-12 h-12 hover:scale-110 transition-transform duration-300 rounded-xl",
                                                }
                                            }}
                                            afterSignOutUrl="/"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link href="/sign-in" className="w-full block">
                                        <Button
                                            variant="outline"
                                            className="w-full flex items-center justify-center gap-2 text-base font-semibold py-3 rounded-xl h-12 hover:bg-primary/10 hover:text-primary border-primary/30 transition-all duration-200"
                                        >
                                            <User size={20} />
                                            <span>Sign In</span>
                                        </Button>
                                    </Link>
                                    <Link href="/sign-up" className="w-full block">
                                        <Button
                                            className="w-full flex items-center justify-center gap-2 text-base font-semibold py-3 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-200 relative group overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>
                                            <Zap size={20} className="relative z-10" />
                                            <span className="relative z-10">Get Started</span>
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Theme & Language */}
                        <div className={`pt-4 border-t border-border/30 space-y-4 px-2 transition-all duration-300 transform ${
                            isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                        }`} style={{ transitionDelay: `${navigationItems.length * 50}ms` }}>
                            <div>
                                <div className="flex items-center justify-between mb-3 px-2">
                                    <span className="text-foreground font-semibold flex items-center gap-2">
                                        <Globe size={18} className="text-primary" />
                                        <span>Language</span>
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {languages.map((lang) => (
                                        <Button
                                            key={lang.code}
                                            variant={currentLang === lang.code ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentLang(lang.code)}
                                            className="rounded-lg text-base font-semibold py-2 h-10 transition-all duration-200 hover:scale-105"
                                        >
                                            {lang.code}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3 px-2">
                                    <span className="text-primary">
                                        {getThemeIcon()}
                                    </span>
                                    <span className="text-foreground font-semibold">Theme</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant={theme === 'light' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTheme('light')}
                                        className="rounded-lg text-base font-semibold py-2 h-10 transition-all duration-200 hover:scale-105"
                                    >
                                        <Sun size={18} />
                                    </Button>
                                    <Button
                                        variant={theme === 'dark' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTheme('dark')}
                                        className="rounded-lg text-base font-semibold py-2 h-10 transition-all duration-200 hover:scale-105"
                                    >
                                        <Moon size={18} />
                                    </Button>
                                    <Button
                                        variant={theme === 'system' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTheme('system')}
                                        className="rounded-lg text-base font-semibold py-2 h-10 transition-all duration-200 hover:scale-105"
                                    >
                                        <Monitor size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;