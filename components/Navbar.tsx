'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useUser } from '@clerk/nextjs';
import {
    Menu,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import NavLogo from '@/components/layout/navbar/NavLogo';
import NavDesktopMenu from '@/components/layout/navbar/NavDesktopMenu';
import NavRightControls from '@/components/layout/navbar/NavRightControls';
import NavMobileMenu from '@/components/layout/navbar/NavMobileMenu';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    if (!mounted) {
        return null;
    }

    const isAdmin = user?.publicMetadata?.role === 'admin';

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 font-poppins transition-all duration-500 ${
                scrolled
                    ? 'bg-background/80 backdrop-blur-2xl border-b border-border/40 shadow-2xl shadow-black/5 py-1'
                    : 'bg-transparent py-4'
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-8 h-20">
                    {/* Logo & Brand */}
                    <NavLogo />

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex justify-center">
                        <div className={cn(
                            "px-2 py-1.5 rounded-2xl transition-all duration-500",
                            scrolled ? "bg-muted/30 border border-border/20 shadow-inner" : ""
                        )}>
                            <NavDesktopMenu navigationItems={navigationItems} />
                        </div>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center justify-end gap-2 sm:gap-4">
                        <div className={cn(
                            "flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl transition-all duration-500",
                            scrolled ? "" : "bg-background/20 backdrop-blur-sm border border-white/10"
                        )}>
                            <NavRightControls 
                                isSignedIn={Boolean(isSignedIn)}
                                theme={theme}
                                setTheme={setTheme}
                                currentLang={currentLang}
                                onLangChange={setCurrentLang}
                                isAdmin={isAdmin}
                            />
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden transition-all duration-300 rounded-2xl p-2 h-12 w-12 hover:bg-primary/10 relative group bg-background/20 backdrop-blur-sm border border-white/10"
                        >
                            <div className="w-6 h-6 relative z-10 flex flex-col justify-center items-center">
                                <Menu
                                    size={24}
                                    className={`absolute transition-all duration-500 ${
                                        isMenuOpen ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                                    }`}
                                />
                                <X
                                    size={24}
                                    className={`absolute transition-all duration-500 ${
                                        isMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'
                                    }`}
                                />
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <NavMobileMenu 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                navigationItems={navigationItems}
                isSignedIn={Boolean(isSignedIn)}
                isAdmin={isAdmin}
                theme={theme}
                currentLang={currentLang}
                onLangChange={setCurrentLang}
                setTheme={setTheme}
            />
        </motion.nav>
    );
};

export default Navbar;
