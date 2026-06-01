'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ChevronDown,
    BookOpen,
    Globe,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface NavItem {
    name: string;
    href: string;
    dropdown?: string[];
    icon?: React.ReactNode;
}

interface NavDesktopMenuProps {
    navigationItems: NavItem[];
}

const NavDesktopMenu = ({ navigationItems }: NavDesktopMenuProps) => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname?.startsWith(href);
    };

    return (
        <div className="hidden lg:flex items-center gap-1 rounded-2xl border border-border/60 bg-background/70 p-1 shadow-sm backdrop-blur-xl">
            {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                    {item.dropdown ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-foreground/75 transition-all duration-300 hover:bg-primary/10 hover:text-primary group"
                                >
                                    {item.name === 'Programs' && <BookOpen size={20} className="group-hover:text-primary transition-colors" />}
                                    {item.name === 'Pages' && <Globe size={20} className="group-hover:text-primary transition-colors" />}
                                    <span>{item.name}</span>
                                    <motion.div
                                        animate={{ rotate: 0 }}
                                        className="group-hover:rotate-180 transition-transform duration-300"
                                    >
                                        <ChevronDown size={18} className="text-foreground/60 group-hover:text-primary" />
                                    </motion.div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-64 mt-3 bg-background/95 backdrop-blur-xl text-foreground border border-border/50 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
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
                            className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300 relative group ${
                                isActive(item.href)
                                    ? 'bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground'
                                    : 'text-foreground/75 hover:bg-primary/10 hover:text-primary'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                            <motion.span 
                                className="absolute bottom-1 left-4 h-0.5 bg-primary rounded-full"
                                initial={{ width: 0 }}
                                whileHover={{ width: 'calc(100% - 2rem)' }}
                                transition={{ duration: 0.3 }}
                            />
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NavDesktopMenu;
