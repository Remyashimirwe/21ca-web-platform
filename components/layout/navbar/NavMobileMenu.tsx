'use client';

import React from 'react';
import {
    X,
    Moon,
    Settings,
    Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import { dark } from "@clerk/themes";

interface NavItem {
    name: string;
    href: string;
    dropdown?: string[];
}

interface NavMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navigationItems: NavItem[];
    isSignedIn: boolean;
    isAdmin: boolean;
    theme: string | undefined;
    currentLang: string;
    onLangChange: (lang: string) => void;
    setTheme: (theme: string) => void;
}

const NavMobileMenu = ({
    isOpen,
    onClose,
    navigationItems,
    isSignedIn,
    isAdmin,
    theme,
    currentLang,
    onLangChange,
    setTheme
}: NavMobileMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[60] lg:hidden"
                >
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                    />

                    <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border/50 shadow-2xl overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Menu
                            </span>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X size={24} />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Navigation Items */}
                            <nav className="space-y-2">
                                {navigationItems.map((item) => (
                                    <div key={item.name}>
                                        {item.dropdown ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-muted-foreground px-4 py-2 text-sm font-semibold uppercase tracking-wider">
                                                    {item.name}
                                                </div>
                                                {item.dropdown.map((subItem: string) => (
                                                    <Link
                                                        key={subItem}
                                                        href={`${item.href}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                                                        onClick={onClose}
                                                        className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                                                    >
                                                        {subItem}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                onClick={onClose}
                                                className="block rounded-xl px-4 py-3 text-base font-semibold hover:bg-primary/10 hover:text-primary transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            <div className="pt-6 border-t border-border/50 space-y-6">
                                {/* Auth Section */}
                                {isSignedIn ? (
                                    <div className="space-y-4">
                                        <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} onClick={onClose} className="block w-full">
                                            <Button variant="outline" className="w-full justify-start gap-3 h-12 text-lg">
                                                <Settings size={20} />
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <div className="flex justify-center py-2">
                                            <UserButton
                                                appearance={{
                                                    baseTheme: theme === 'dark' ? dark : undefined,
                                                    variables: {
                                                        colorPrimary: 'hsl(142, 76%, 36%)',
                                                        borderRadius: '1rem',
                                                    },
                                                }}
                                                afterSignOutUrl="/"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href="/sign-in" onClick={onClose}>
                                            <Button variant="outline" className="w-full h-12 text-base font-semibold">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/sign-up" onClick={onClose}>
                                            <Button className="w-full h-12 text-base font-semibold">
                                                Join
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {/* Controls Section */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between px-4">
                                        <span className="text-sm font-medium text-muted-foreground">Language</span>
                                        <div className="flex gap-2">
                                            {['EN', 'FR', 'RW'].map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => onLangChange(lang)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                                        currentLang === lang ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                                    }`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-4">
                                        <span className="text-sm font-medium text-muted-foreground">Theme</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => setTheme('light')} className="p-2 bg-muted rounded-lg hover:bg-primary/10"><Sun size={16} /></button>
                                            <button onClick={() => setTheme('dark')} className="p-2 bg-muted rounded-lg hover:bg-primary/10"><Moon size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NavMobileMenu;
