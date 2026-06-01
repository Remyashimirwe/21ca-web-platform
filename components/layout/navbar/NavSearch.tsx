'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavSearchProps {
    onSearch: (query: string) => void;
}

const NavSearch = ({ onSearch }: NavSearchProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
            setSearchQuery('');
            setSearchFocused(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        searchRef.current?.focus();
    };

    return (
        <div className="relative w-full max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
                <motion.div 
                    animate={{ 
                        scale: searchFocused ? 1.02 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative flex items-center"
                >
                    <Search className={cn(
                        "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300",
                        searchFocused ? "text-primary" : "text-muted-foreground"
                    )} />
                    <Input
                        ref={searchRef}
                        placeholder="Search courses, lessons, instructors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className={cn(
                            "pl-10 pr-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background focus:border-primary/40 transition-all duration-300",
                            searchFocused && "ring-2 ring-primary/20 shadow-lg"
                        )}
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                        <AnimatePresence>
                            {searchQuery && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearSearch}
                                        className="h-8 w-8 p-0 hover:bg-muted"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </motion.div>
            </form>

            <AnimatePresence>
                {searchFocused && searchQuery && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl p-3 z-50"
                    >
                        <div className="text-xs text-muted-foreground px-2 py-1">
                            Press <kbd className="font-sans border rounded px-1">Enter</kbd> to search for <span className="text-foreground font-medium">"{searchQuery}"</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NavSearch;
