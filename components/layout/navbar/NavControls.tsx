'use client';

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavLanguageSelectorProps {
    currentLang: string;
    onLangChange: (lang: string) => void;
}

interface NavThemeToggleProps {
    theme: string | undefined;
    setTheme: (theme: string) => void;
}

export const NavLanguageSelector = ({ currentLang, onLangChange }: NavLanguageSelectorProps) => {
    const languages = [
        { code: 'EN', name: 'English' },
        { code: 'FR', name: 'Français' },
        { code: 'RW', name: 'Kinyarwanda' }
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-base font-semibold px-4 py-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 h-12 group"
                >
                    <motion.div
                        whileHover={{ rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Globe size={20} className="group-hover:text-primary transition-colors" />
                    </motion.div>
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
                        onClick={() => onLangChange(lang.code)}
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
    );
};

export const NavThemeToggle = ({ theme, setTheme }: NavThemeToggleProps) => {
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
    );
};
