'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Settings, User, Zap } from 'lucide-react';
import { dark } from "@clerk/themes";
import { NavLanguageSelector, NavThemeToggle } from './NavControls';

interface NavRightControlsProps {
    isSignedIn: boolean;
    theme: string | undefined;
    setTheme: (theme: string) => void;
    currentLang: string;
    onLangChange: (lang: string) => void;
    isAdmin: boolean;
}

const NavRightControls = ({
    isSignedIn,
    theme,
    setTheme,
    currentLang,
    onLangChange,
    isAdmin
}: NavRightControlsProps) => {
    return (
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Language Selector - Desktop Only */}
            <div className="hidden lg:block">
                <NavLanguageSelector currentLang={currentLang} onLangChange={onLangChange} />
            </div>

            {/* Theme Toggle - Desktop Only */}
            <div className="hidden lg:block">
                <NavThemeToggle theme={theme} setTheme={setTheme} />
            </div>

            {/* Auth Buttons */}
            {isSignedIn ? (
                <div className="hidden lg:flex items-center gap-4">
                    <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl h-11 transition-all duration-300 border-primary/30 hover:border-primary/60 hover:bg-primary/5 hover:text-primary relative group overflow-hidden"
                        >
                            <Settings size={20} className="relative z-10" />
                            <span className="relative z-10">Dashboard</span>
                        </Button>
                    </Link>

                    <UserButton
                        appearance={{
                            baseTheme: theme === 'dark' ? dark : undefined,
                            variables: {
                                colorPrimary: 'hsl(142, 76%, 36%)',
                                colorBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                                colorInputBackground: theme === 'dark' ? 'hsl(224, 71%, 4%)' : 'hsl(0, 0%, 100%)',
                                colorText: theme === 'dark' ? 'hsl(213, 31%, 91%)' : 'hsl(224, 71%, 4%)',
                                colorTextSecondary: theme === 'dark' ? 'hsl(215, 16%, 47%)' : 'hsl(215, 16%, 47%)',
                                borderRadius: '1rem',
                            },
                            elements: {
                                avatarBox: "w-11 h-11 hover:scale-105 transition-transform duration-300 rounded-xl",
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
                            className="flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl h-11 transition-all duration-300 border-primary/30 hover:border-primary/60 hover:bg-primary/5 hover:text-primary relative group"
                        >
                            <User size={20} />
                            <span>Sign In</span>
                        </Button>
                    </Link>

                    <Link href="/sign-up">
                        <Button
                            className="flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl h-11 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-300"></div>
                            <Zap size={20} className="relative z-10" />
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NavRightControls;
