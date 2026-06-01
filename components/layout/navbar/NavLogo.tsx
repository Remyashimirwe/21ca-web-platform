'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const NavLogo = () => {
    return (
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 group-hover:scale-110"></div>
                <div className="relative w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 group-hover:border-primary/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                    <Image
                        src="/logo.png"
                        alt="21st Century Academy"
                        width={48}
                        height={48}
                        className="object-contain"
                        priority
                    />
                </div>
            </motion.div>
            
            <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        21st
                    </span>
                    <motion.div
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                    >
                        <Sparkles className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                    </motion.div>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                    Century Academy
                </span>
            </div>
        </Link>
    );
};

export default NavLogo;
