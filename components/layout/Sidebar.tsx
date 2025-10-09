'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import {
    Users,
    BookOpen,
    TrendingUp,
    DollarSign,
    BarChart3,
    Settings,
    HelpCircle,
    Home,
    Calendar,
    MessageSquare,
    Award,
    Upload,
    FileText,
    Globe,
    Heart,
    ChevronLeft,
    ChevronRight,
    User,
    GraduationCap,
    Shield,
    HandHeart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

interface NavigationItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: string[];
    badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
    const { user } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    
    const userRole = user?.publicMetadata?.role as string || 'user';

    // Navigation items based on roles
    const navigationItems: NavigationItem[] = [
        // Common items for all users
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            roles: ['user', 'instructor', 'admin', 'partner']
        },
        
        // User/Student specific
        {
            title: 'My Courses',
            href: '/courses/my-courses',
            icon: BookOpen,
            roles: ['user']
        },
        {
            title: 'Browse Courses',
            href: '/courses',
            icon: GraduationCap,
            roles: ['user']
        },
        {
            title: 'Certificates',
            href: '/certificates',
            icon: Award,
            roles: ['user']
        },
        {
            title: 'Community',
            href: '/community',
            icon: Users,
            roles: ['user']
        },
        
        // Instructor specific
        {
            title: 'My Courses',
            href: '/instructor/courses',
            icon: BookOpen,
            roles: ['instructor', 'admin']
        },
        {
            title: 'Create Course',
            href: '/instructor/create-course',
            icon: Upload,
            roles: ['instructor', 'admin']
        },
        {
            title: 'Students',
            href: '/instructor/students',
            icon: Users,
            roles: ['instructor', 'admin']
        },
        {
            title: 'Analytics',
            href: '/instructor/analytics',
            icon: BarChart3,
            roles: ['instructor', 'admin']
        },
        {
            title: 'Earnings',
            href: '/instructor/earnings',
            icon: DollarSign,
            roles: ['instructor', 'admin']
        },
        
        // Admin specific
        {
            title: 'Admin Panel',
            href: '/admin',
            icon: Shield,
            roles: ['admin']
        },
        {
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
            roles: ['admin']
        },
        {
            title: 'Course Management',
            href: '/admin/courses',
            icon: BookOpen,
            roles: ['admin']
        },
        {
            title: 'Course Review',
            href: '/admin/courses/review',
            icon: FileText,
            roles: ['admin']
        },
        {
            title: 'Payments',
            href: '/admin/payments',
            icon: DollarSign,
            roles: ['admin']
        },
        {
            title: 'Reports',
            href: '/admin/reports',
            icon: BarChart3,
            roles: ['admin']
        },
        {
            title: 'System Health',
            href: '/admin/system',
            icon: TrendingUp,
            roles: ['admin']
        },
        
        // Partner/Donor specific (public)
        {
            title: 'Impact Dashboard',
            href: '/partner',
            icon: Heart,
            roles: ['partner']
        },
        {
            title: 'Success Stories',
            href: '/partner/stories',
            icon: Award,
            roles: ['partner']
        },
        {
            title: 'Reports',
            href: '/partner/reports',
            icon: FileText,
            roles: ['partner']
        },
        {
            title: 'Global Impact',
            href: '/partner/global',
            icon: Globe,
            roles: ['partner']
        },
        
        // Common bottom items
        {
            title: 'Messages',
            href: '/messages',
            icon: MessageSquare,
            roles: ['user', 'instructor', 'admin'],
            badge: '3'
        },
        {
            title: 'Calendar',
            href: '/calendar',
            icon: Calendar,
            roles: ['user', 'instructor', 'admin']
        },
        {
            title: 'Support',
            href: '/support',
            icon: HelpCircle,
            roles: ['user', 'instructor', 'admin', 'partner']
        }
    ];

    const filteredNavigation = navigationItems.filter(item => 
        item.roles.includes(userRole)
    );

    const handleNavigation = (href: string) => {
        router.push(href);
    };

    const getRoleIcon = () => {
        switch (userRole) {
            case 'admin':
                return <Shield className="h-4 w-4" />;
            case 'instructor':
                return <GraduationCap className="h-4 w-4" />;
            case 'partner':
                return <HandHeart className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const getRoleColor = () => {
        switch (userRole) {
            case 'admin':
                return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            case 'instructor':
                return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
            case 'partner':
                return 'text-green-500 bg-green-50 dark:bg-green-900/20';
            default:
                return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }
    };

    return (
        <div className={cn(
            "h-screen bg-background border-r border-border transition-all duration-300 flex flex-col",
            collapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">21</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-foreground">21CA</h2>
                                <p className="text-xs text-muted-foreground">Century Africa</p>
                            </div>
                        </div>
                    )}
                    {onToggle && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onToggle}
                            className={cn(
                                "p-1.5 h-auto",
                                collapsed && "w-full justify-center"
                            )}
                        >
                            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </div>

            {/* User Role Badge */}
            {!collapsed && (
                <div className="p-4">
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg",
                        getRoleColor()
                    )}>
                        {getRoleIcon()}
                        <div className="flex-1">
                            <p className="text-sm font-medium capitalize">{userRole}</p>
                            <p className="text-xs opacity-75">{user?.firstName} {user?.lastName}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex-1 p-4 overflow-y-auto">
                <nav className="space-y-2">
                    {filteredNavigation.map((item, index) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        
                        return (
                            <Button
                                key={index}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 text-left",
                                    collapsed && "justify-center px-2",
                                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                                )}
                                onClick={() => handleNavigation(item.href)}
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                {!collapsed && (
                                    <>
                                        <span className="flex-1">{item.title}</span>
                                        {item.badge && (
                                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </Button>
                        );
                    })}
                </nav>
            </div>

            {/* Settings */}
            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3",
                        collapsed && "justify-center px-2"
                    )}
                    onClick={() => handleNavigation('/settings')}
                >
                    <Settings className="h-4 w-4" />
                    {!collapsed && <span>Settings</span>}
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;