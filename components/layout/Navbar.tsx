'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
    Bell, Search, Moon, Sun, User, Settings, LogOut, HelpCircle,
    Menu, MessageSquare, Award, BookOpen, CreditCard, X, Zap,
    Shield, GraduationCap, HandHeart, DollarSign, AlertCircle,
    CheckCheck, Upload, ChevronRight, Crown, Sparkles
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { showBrowserNotification } from '@/components/notifications/PushNotificationManager';

interface NavbarProps {
    onSidebarToggle?: () => void;
    sidebarCollapsed?: boolean;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'COURSE_UPDATE' | 'ASSIGNMENT' | 'PAYMENT' | 'CERTIFICATE';
    isRead: boolean;
    actionUrl: string | null;
    createdAt: Date;
}

const roleConfig = {
    admin:      { label: 'Admin',      color: 'bg-rose-500',     icon: Shield,        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' },
    instructor: { label: 'Instructor', color: 'bg-violet-500',   icon: GraduationCap, badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400' },
    partner:    { label: 'Partner',    color: 'bg-emerald-500',  icon: HandHeart,     badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
    user:       { label: 'Student',    color: 'bg-blue-500',     icon: User,          badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' },
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
};

export default function Navbar({ onSidebarToggle }: NavbarProps) {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const [searchQuery, setSearchQuery]           = useState('');
    const [searchFocused, setSearchFocused]       = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [mounted, setMounted]                   = useState(false);
    const [notifications, setNotifications]       = useState<Notification[]>([]);
    const [notificationsLoading, setNotificationsLoading] = useState(true);
    const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);

    const searchRef = useRef<HTMLInputElement>(null);
    const userRole  = (user?.publicMetadata?.role as string) ?? 'user';
    const role      = roleConfig[userRole as keyof typeof roleConfig] ?? roleConfig.user;
    const isPaidUser = !!(user?.publicMetadata?.isPro);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        fetchNotifications();
        const id = setInterval(fetchNotifications, 30_000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
            if (e.key === 'Escape' && searchFocused) {
                setSearchFocused(false);
                searchRef.current?.blur();
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [searchFocused]);

    const fetchNotifications = async () => {
        try {
            setNotificationsLoading(true);
            const res  = await fetch('/api/notifications');
            const data = await res.json();
            const list: Notification[] = Array.isArray(data) ? data : [];
            if (list.length > 0) {
                const latest = list[0];
                if (lastNotificationId && latest.id !== lastNotificationId && !latest.isRead) {
                    showBrowserNotification(latest.title, { body: latest.message, tag: latest.id });
                }
                setLastNotificationId(latest.id);
            }
            setNotifications(list);
        } catch {
            setNotifications([]);
        } finally {
            setNotificationsLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
            setNotifications(p => p.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch { /* silent */ }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/mark-all-read', { method: 'POST' });
            setNotifications(p => p.map(n => ({ ...n, isRead: true })));
        } catch { /* silent */ }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); setSearchQuery(''); setSearchFocused(false); }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const notifIcon = (type: Notification['type']) => {
        const map: Record<string, React.ReactNode> = {
            COURSE_UPDATE: <BookOpen   className="h-3.5 w-3.5 text-blue-500" />,
            ASSIGNMENT:    <Upload     className="h-3.5 w-3.5 text-purple-500" />,
            PAYMENT:       <DollarSign className="h-3.5 w-3.5 text-green-500" />,
            CERTIFICATE:   <Award      className="h-3.5 w-3.5 text-yellow-500" />,
            SUCCESS:       <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />,
            WARNING:       <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
            ERROR:         <AlertCircle className="h-3.5 w-3.5 text-red-500" />,
        };
        return map[type] ?? <Bell className="h-3.5 w-3.5 text-blue-500" />;
    };

    const timeAgo = (ts: Date | string) => {
        const diff = Date.now() - new Date(ts).getTime();
        const m = Math.floor(diff / 60_000);
        const h = Math.floor(diff / 3_600_000);
        const d = Math.floor(diff / 86_400_000);
        if (m < 60) return `${m}m`;
        if (h < 24) return `${h}h`;
        if (d < 7)  return `${d}d`;
        return new Date(ts).toLocaleDateString();
    };

    if (!mounted) return null;

    return (
        <header className="sticky top-0 z-50 flex items-center h-16 px-5 gap-4 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">

            {/* Mobile menu toggle */}
            {onSidebarToggle && (
                <Button variant="ghost" size="icon" onClick={onSidebarToggle}
                    className="lg:hidden shrink-0 h-9 w-9 rounded-lg">
                    <Menu className="h-4.5 w-4.5" />
                </Button>
            )}

            {/* Greeting */}
            <div className="hidden lg:flex flex-col shrink-0 gap-0.5 leading-none">
                <span className="text-xs text-muted-foreground">{getGreeting()},</span>
                <span className="text-[15px] font-semibold text-foreground leading-none">{user?.firstName ?? 'Student'}</span>
            </div>

            <div className="hidden lg:block w-px h-6 bg-border mx-1" />

            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    ref={searchRef}
                    placeholder="Search courses, programs..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={cn(
                        "h-9 pl-10 pr-16 text-sm rounded-lg bg-muted/50 border-transparent transition-all duration-200",
                        searchFocused && "border-primary/40 bg-background ring-2 ring-primary/10"
                    )}
                />
                {searchQuery ? (
                    <button type="button" onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border/60 bg-background font-mono text-[10px] text-muted-foreground">
                        ⌘K
                    </div>
                )}
            </form>

            <div className="flex-1" />

            {/* Upgrade to Pro */}
            {userRole === 'user' && !isPaidUser && (
                <button
                    onClick={() => router.push('/premium')}
                    className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-sm hover:shadow-md hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                >
                    <Crown className="h-3.5 w-3.5" />
                    Go Premium
                </button>
            )}

            {/* Right actions */}
            <div className="flex items-center gap-1 shrink-0">

                {/* Explore */}
                <Button variant="ghost" size="icon"
                    onClick={() => router.push('/programs')}
                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    title="Explore Programs">
                    <Zap className="h-4 w-4" />
                </Button>

                {/* Theme */}
                <Button variant="ghost" size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 relative overflow-hidden">
                    <Sun  className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                {/* Notifications */}
                <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70">
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 rounded-xl shadow-xl border border-border/60 overflow-hidden" align="end" sideOffset={8}>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                            <div>
                                <p className="text-sm font-semibold">Notifications</p>
                                {unreadCount > 0 && <p className="text-xs text-muted-foreground">{unreadCount} unread</p>}
                            </div>
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={markAllAsRead}
                                    className="h-7 text-xs rounded-md px-2 text-muted-foreground hover:text-foreground">
                                    Mark all read
                                </Button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notificationsLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center py-10 px-6 text-center">
                                    <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                    <p className="text-sm font-medium">All caught up</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">No new notifications</p>
                                </div>
                            ) : (
                                <div className="p-1.5 space-y-0.5">
                                    {notifications.slice(0, 5).map(n => (
                                        <button key={n.id}
                                            onClick={() => {
                                                if (!n.isRead) markAsRead(n.id);
                                                if (n.actionUrl) { router.push(n.actionUrl); setNotificationsOpen(false); }
                                            }}
                                            className={cn(
                                                "w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors",
                                                !n.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/60"
                                            )}>
                                            <div className="mt-0.5 w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                                {notifIcon(n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <p className="text-xs font-semibold truncate text-foreground">{n.title}</p>
                                                    <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(n.createdAt)}</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">{n.message}</p>
                                            </div>
                                            {!n.isRead && <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-1.5 border-t border-border/60">
                            <Button variant="ghost" size="sm"
                                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground rounded-lg gap-1"
                                onClick={() => { router.push('/notifications'); setNotificationsOpen(false); }}>
                                View all
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Profile dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost"
                            className="h-9 pl-2 pr-3 rounded-lg flex items-center gap-2.5 hover:bg-muted/70 focus-visible:ring-1 focus-visible:ring-primary/40">
                            <div className="relative shrink-0">
                                <Avatar className="h-7 w-7 rounded-lg">
                                    <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? ''} />
                                    <AvatarFallback className={cn("text-white text-[11px] font-semibold rounded-lg", role.color)}>
                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
                            </div>
                            <div className="hidden lg:flex flex-col items-start leading-none gap-0.5">
                                <span className="text-sm font-medium text-foreground">{user?.firstName}</span>
                                <span className={cn("text-[10px] font-medium px-1 rounded", role.badge)}>{role.label}</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64 p-1.5 rounded-xl shadow-xl border border-border/60" align="end" sideOffset={8}>

                        {/* Profile header */}
                        <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg bg-muted/40">
                            <Avatar className="h-9 w-9 rounded-lg shrink-0">
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback className={cn("text-white font-semibold rounded-lg", role.color)}>
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{user?.fullName}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                <span className={cn("inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium", role.badge)}>
                                    {role.label}
                                </span>
                            </div>
                        </div>

                        {/* Upgrade to Pro */}
                        {userRole === 'user' && !isPaidUser && (
                            <>
                                <button
                                    onClick={() => router.push('/premium')}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors group"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                                        <Crown className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Go Premium</p>
                                        <p className="text-[10px] text-muted-foreground">Unlock all courses</p>
                                    </div>
                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                </button>
                                <DropdownMenuSeparator className="my-1" />
                            </>
                        )}

                        {/* Role-specific links */}
                        {userRole === 'user' && (
                            <>
                                <DropdownMenuItem onClick={() => router.push('/my-courses')} className="rounded-lg cursor-pointer gap-2.5 py-2 px-3 text-sm">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    My Learning
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/certificates')} className="rounded-lg cursor-pointer gap-2.5 py-2 px-3 text-sm">
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                    Certificates
                                </DropdownMenuItem>
                            </>
                        )}

                        {(userRole === 'instructor' || userRole === 'admin') && (
                            <>
                                <DropdownMenuItem onClick={() => router.push('/instructor/courses')} className="rounded-lg cursor-pointer gap-2.5 py-2 px-3 text-sm">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    Manage Courses
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/instructor/earnings')} className="rounded-lg cursor-pointer gap-2.5 py-2 px-3 text-sm">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    Earnings
                                </DropdownMenuItem>
                            </>
                        )}

                        <DropdownMenuItem onClick={() => router.push('/messages')} className="rounded-lg cursor-pointer gap-2.5 py-2 px-3 text-sm">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            Messages
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1" />

                        <DropdownMenuItem onClick={() => router.push('/settings')} className="rounded-lg cursor-pointer gap-2.5 py-2 px-3 text-sm">
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/support')} className="rounded-lg cursor-pointer gap-2.5 py-2 px-3 text-sm">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            Help & Support
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1" />

                        <DropdownMenuItem
                            onClick={async () => { await signOut(); router.push('/'); }}
                            className="rounded-lg cursor-pointer gap-2.5 py-2 px-3 text-sm text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
