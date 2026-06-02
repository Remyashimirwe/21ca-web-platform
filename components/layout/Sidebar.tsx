'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users, BookOpen, TrendingUp, DollarSign, BarChart3, Settings,
    HelpCircle, Calendar, MessageSquare, Award, Upload,
    FileText, Globe, Heart, ChevronLeft, ChevronRight, User,
    GraduationCap, Shield, HandHeart, Sparkles, LayoutDashboard,
    Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: string[];
    badge?: string;
}

interface NavSection {
    label: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        label: 'Main',
        items: [
            { title: 'Dashboard',  href: '/dashboard', icon: LayoutDashboard, roles: ['user', 'instructor', 'admin', 'partner'] },
            { title: 'Messages',   href: '/messages',  icon: MessageSquare,   roles: ['user', 'instructor', 'admin'], badge: '3' },
            { title: 'Calendar',   href: '/calendar',  icon: Calendar,        roles: ['user', 'instructor', 'admin'] },
        ]
    },
    {
        label: 'Learning',
        items: [
            { title: 'My Courses',      href: '/my-courses',   icon: BookOpen,  roles: ['user'] },
            { title: 'Browse Programs', href: '/programs',     icon: Sparkles,  roles: ['user'] },
            { title: 'Certificates',    href: '/certificates', icon: Award,     roles: ['user'] },
            { title: 'Community',       href: '/community',    icon: Users,     roles: ['user'] },
        ]
    },
    {
        label: 'Instructor',
        items: [
            { title: 'My Courses',   href: '/instructor/courses',       icon: BookOpen,  roles: ['instructor', 'admin'] },
            { title: 'Create',       href: '/instructor/create-course', icon: Upload,    roles: ['instructor', 'admin'] },
            { title: 'Students',     href: '/instructor/students',      icon: Users,     roles: ['instructor', 'admin'] },
            { title: 'Submissions',  href: '/instructor/submissions',   icon: FileText,  roles: ['instructor', 'admin'] },
            { title: 'Analytics',    href: '/instructor/analytics',     icon: BarChart3, roles: ['instructor', 'admin'] },
            { title: 'Earnings',     href: '/instructor/earnings',      icon: DollarSign,roles: ['instructor', 'admin'] },
        ]
    },
    {
        label: 'Admin',
        items: [
            { title: 'Admin Panel', href: '/admin/dashboard', icon: Shield,    roles: ['admin'] },
            { title: 'Users',       href: '/admin/users',     icon: Users,     roles: ['admin'] },
            { title: 'Courses',     href: '/admin/courses',   icon: Layers,    roles: ['admin'] },
            { title: 'Payments',    href: '/admin/payments',  icon: DollarSign,roles: ['admin'] },
            { title: 'Reports',     href: '/admin/reports',   icon: BarChart3, roles: ['admin'] },
            { title: 'System',      href: '/admin/system',    icon: TrendingUp,roles: ['admin'] },
        ]
    },
    {
        label: 'Partner',
        items: [
            { title: 'Impact Hub',      href: '/partner',         icon: Heart,    roles: ['partner'] },
            { title: 'Success Stories', href: '/partner/stories', icon: Award,    roles: ['partner'] },
            { title: 'Reports',         href: '/partner/reports', icon: FileText, roles: ['partner'] },
            { title: 'Global Impact',   href: '/partner/global',  icon: Globe,    roles: ['partner'] },
        ]
    },
];

const roleConfig = {
    admin:      { label: 'Admin',      gradient: 'from-rose-500 to-pink-600',     icon: Shield,        ring: 'ring-rose-500/20' },
    instructor: { label: 'Instructor', gradient: 'from-violet-500 to-purple-600', icon: GraduationCap, ring: 'ring-violet-500/20' },
    partner:    { label: 'Partner',    gradient: 'from-emerald-500 to-teal-600',  icon: HandHeart,     ring: 'ring-emerald-500/20' },
    user:       { label: 'Student',    gradient: 'from-blue-500 to-indigo-600',   icon: User,          ring: 'ring-blue-500/20' },
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
    const { user } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const userRole = (user?.publicMetadata?.role as string) || 'user';
    const role = roleConfig[userRole as keyof typeof roleConfig] ?? roleConfig.user;

    const visibleSections = navSections
        .map(s => ({ ...s, items: s.items.filter(i => i.roles.includes(userRole)) }))
        .filter(s => s.items.length > 0);

    return (
        <div className={cn(
            "relative h-screen flex flex-col bg-background border-r border-border/60 transition-all duration-300 ease-in-out overflow-hidden",
            collapsed ? "w-14" : "w-64"
        )}>

            {/* Logo — same height as navbar (h-16) */}
            <div className={cn(
                "flex items-center h-16 shrink-0 border-b border-border/60 px-4 gap-3",
                collapsed && "justify-center px-0"
            )}>
                <button
                    onClick={() => router.push('/dashboard')}
                    className={cn(
                        "shrink-0 w-9 h-9 rounded-lg overflow-hidden relative hover:opacity-90 transition-opacity",
                        `bg-gradient-to-br ${role.gradient}`
                    )}
                >
                    <img src="/logo.png" alt="21CA" className="w-full h-full object-contain p-1.5" />
                </button>
                {!collapsed && (
                    <div className="flex flex-col leading-none gap-0.5">
                        <span className="text-[15px] font-bold text-foreground tracking-tight">21CA</span>
                        <span className="text-[11px] text-muted-foreground">Century Academy</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
                {visibleSections.map((section) => (
                    <div key={section.label}>
                        {!collapsed && (
                            <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                                {section.label}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => router.push(item.href)}
                                        title={collapsed ? item.title : undefined}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm transition-colors duration-150 relative group",
                                            collapsed && "justify-center px-0",
                                            isActive
                                                ? "text-white"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className={cn("absolute inset-0 rounded-lg bg-gradient-to-r", role.gradient)}
                                            />
                                        )}

                                        <Icon className={cn(
                                            "h-4 w-4 shrink-0 relative z-10",
                                            isActive ? "text-white" : ""
                                        )} />

                                        {!collapsed && (
                                            <span className={cn(
                                                "flex-1 text-left relative z-10",
                                                isActive ? "font-medium" : ""
                                            )}>
                                                {item.title}
                                            </span>
                                        )}

                                        {!collapsed && item.badge && (
                                            <span className={cn(
                                                "text-[10px] font-semibold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center relative z-10",
                                                isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom actions */}
            <div className="shrink-0 border-t border-border/60 p-2.5 space-y-0.5">
                <button
                    onClick={() => router.push('/settings')}
                    title={collapsed ? 'Settings' : undefined}
                    className={cn(
                        "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm transition-colors duration-150",
                        collapsed && "justify-center px-0",
                        pathname === '/settings'
                            ? "bg-muted text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                >
                    <Settings className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="flex-1 text-left">Settings</span>}
                </button>

                <button
                    onClick={() => router.push('/support')}
                    title={collapsed ? 'Help & Support' : undefined}
                    className={cn(
                        "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm transition-colors duration-150",
                        collapsed && "justify-center px-0",
                        "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                >
                    <HelpCircle className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="flex-1 text-left">Help & Support</span>}
                </button>

                {onToggle && (
                    <button
                        onClick={onToggle}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={cn(
                            "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors duration-150",
                            collapsed && "justify-center px-0"
                        )}
                    >
                        {collapsed
                            ? <ChevronRight className="h-4 w-4 shrink-0" />
                            : <><ChevronLeft className="h-4 w-4 shrink-0" /><span className="flex-1 text-left">Collapse</span></>
                        }
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
