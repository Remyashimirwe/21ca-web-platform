'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
    Bell,
    Search,
    Moon,
    Sun,
    User,
    Settings,
    LogOut,
    HelpCircle,
    Menu,
    MessageSquare,
    Award,
    BookOpen,
    CreditCard,
    X,
    Zap,
    Shield,
    GraduationCap,
    HandHeart,
    DollarSign,
    AlertCircle,
    CheckCheck,
    Upload
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
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

const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle, sidebarCollapsed }) => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationsLoading, setNotificationsLoading] = useState(true);
    const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
    
    const searchRef = useRef<HTMLInputElement>(null);
    
    const userRole = user?.publicMetadata?.role as string || 'user';

    // Fetch notifications
    useEffect(() => {
        fetchNotifications();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setNotificationsLoading(true);
            const response = await fetch('/api/notifications');
            const data = await response.json();
            const newNotifications = Array.isArray(data) ? data : [];
            
            // Check for new notifications to trigger browser alerts
            if (newNotifications.length > 0) {
                const latest = newNotifications[0];
                if (lastNotificationId && latest.id !== lastNotificationId && !latest.isRead) {
                    showBrowserNotification(latest.title, {
                        body: latest.message,
                        tag: latest.id,
                    });
                }
                setLastNotificationId(latest.id);
            }
            
            setNotifications(newNotifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
        } finally {
            setNotificationsLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'POST'
            });
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/mark-all-read', {
                method: 'POST'
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    // Ensure component is mounted before accessing theme
    useEffect(() => {
        setMounted(true);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchFocused(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        searchRef.current?.focus();
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
            setNotificationsOpen(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'COURSE_UPDATE':
                return <BookOpen className="h-4 w-4 text-blue-500" />;
            case 'ASSIGNMENT':
                return <Upload className="h-4 w-4 text-purple-500" />;
            case 'PAYMENT':
                return <DollarSign className="h-4 w-4 text-green-500" />;
            case 'CERTIFICATE':
                return <Award className="h-4 w-4 text-yellow-500" />;
            case 'SUCCESS':
                return <CheckCheck className="h-4 w-4 text-green-500" />;
            case 'WARNING':
                return <AlertCircle className="h-4 w-4 text-orange-500" />;
            case 'ERROR':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Bell className="h-4 w-4 text-blue-500" />;
        }
    };

    const formatTimestamp = (timestamp: Date | string) => {
        const now = new Date();
        const notifDate = new Date(timestamp);
        const diff = now.getTime() - notifDate.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return notifDate.toLocaleDateString();
    };

    const getRoleData = () => {
        switch (userRole) {
            case 'admin':
                return { 
                    color: 'bg-red-500', 
                    icon: Shield, 
                    label: 'Admin',
                    gradient: 'from-red-500 to-pink-500'
                };
            case 'instructor':
                return { 
                    color: 'bg-purple-500', 
                    icon: GraduationCap, 
                    label: 'Instructor',
                    gradient: 'from-purple-500 to-indigo-500'
                };
            case 'partner':
                return { 
                    color: 'bg-green-500', 
                    icon: HandHeart, 
                    label: 'Partner',
                    gradient: 'from-green-500 to-emerald-500'
                };
            default:
                return { 
                    color: 'bg-blue-500', 
                    icon: User, 
                    label: 'Student',
                    gradient: 'from-blue-500 to-cyan-500'
                };
        }
    };

    const roleData = getRoleData();
    const RoleIcon = roleData.icon;

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
                setSearchFocused(true);
            }
            if (e.key === 'Escape' && searchFocused) {
                setSearchFocused(false);
                searchRef.current?.blur();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [searchFocused]);

    if (!mounted) return null;

    // Get latest 5 notifications for preview
    const previewNotifications = notifications.slice(0, 5);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Left Section - Mobile Menu & Logo */}
                <div className="flex items-center gap-4">
                    {onSidebarToggle && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onSidebarToggle}
                            className="hover:bg-muted/80 transition-colors"
                        >
                            <Menu className="h-4 w-4" />
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>
                    )}
                    
                    {/* Logo - visible on mobile when sidebar collapsed */}
                    <div className="flex items-center gap-2 md:hidden">
                        <div className={`w-8 h-8 bg-gradient-to-r ${roleData.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold text-sm">21</span>
                        </div>
                        <span className="font-bold text-foreground">21CA</span>
                    </div>
                </div>

                {/* Center Section - Search */}
                <div className="flex-1 max-w-xl mx-4">
                    <form onSubmit={handleSearch} className="relative">
                        <div className={cn(
                            "relative flex items-center transition-all duration-200",
                            searchFocused && "transform scale-[1.02]"
                        )}>
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors" />
                            <Input
                                ref={searchRef}
                                placeholder="Search courses, lessons, instructors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={cn(
                                    "pl-9 pr-20 h-10 bg-muted/30 border-muted-foreground/20 focus:bg-background focus:border-primary/40 transition-all duration-200",
                                    searchFocused && "ring-2 ring-primary/20 shadow-lg"
                                )}
                            />
                            <div className="absolute right-2 flex items-center gap-1">
                                {searchQuery && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearSearch}
                                        className="h-6 w-6 p-0 hover:bg-muted"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                        
                        {/* Search suggestions overlay */}
                        {searchFocused && searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-xl p-2 z-50">
                                <div className="text-sm text-muted-foreground p-2">
                                    Press Enter to search for "{searchQuery}"
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Right Section - Actions & Profile */}
                <div className="flex items-center gap-2">
                    {/* Quick Action - visible on desktop */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden lg:flex items-center gap-2 hover:bg-muted/80 transition-colors"
                        onClick={() => router.push('/programs')}
                    >
                        <Zap className="h-4 w-4" />
                        <span className="text-sm">Explore</span>
                    </Button>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="hover:bg-muted/80 transition-colors"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Notifications */}
                    <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                        <PopoverTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="relative hover:bg-muted/80 transition-colors"
                            >
                                <Bell className="h-4 w-4" />
                                {unreadCount > 0 && (
                                    <Badge 
                                        variant="destructive" 
                                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Badge>
                                )}
                                <span className="sr-only">Notifications ({unreadCount} unread)</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 mr-4" align="end">
                            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4" />
                                    <h3 className="font-semibold">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            {unreadCount} new
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={async () => {
                                                const result = await Notification.requestPermission();
                                                if (result === 'granted') {
                                                    new Notification('Notifications enabled!', {
                                                        body: 'You will now receive desktop notifications from 21CA.'
                                                    });
                                                }
                                            }}
                                            className="text-xs h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
                                            title="Enable desktop notifications"
                                        >
                                            Enable Desktop
                                        </Button>
                                    )}
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={markAllAsRead}
                                            className="text-xs hover:bg-muted/80"
                                        >
                                            Mark all read
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notificationsLoading ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                                    </div>
                                ) : previewNotifications.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No notifications yet</p>
                                    </div>
                                ) : (
                                    previewNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors",
                                                !notification.isRead && "bg-primary/5 border-l-4 border-l-primary"
                                            )}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex gap-3">
                                                <div className={cn(
                                                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                                                    !notification.isRead ? 'bg-primary/10' : 'bg-muted'
                                                )}>
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <p className="font-medium text-sm text-foreground line-clamp-1">
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                                            {formatTimestamp(notification.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-3 border-t bg-muted/30">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-center text-sm hover:bg-muted/80"
                                    onClick={() => {
                                        router.push('/notifications');
                                        setNotificationsOpen(false);
                                    }}
                                >
                                    View All Notifications
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* User Profile Dropdown */}
                    <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                                    <AvatarFallback className={`${roleData.color} text-white font-semibold`}>
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex items-start space-x-3 p-2">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={user?.imageUrl} />
                                        <AvatarFallback className={`${roleData.color} text-white`}>
                                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.fullName}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.primaryEmailAddress?.emailAddress}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                                <RoleIcon className="h-3 w-3" />
                                                {roleData.label}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {/* Role-specific menu items */}
                            {userRole === 'user' && (
                                <>
                                    <DropdownMenuItem onClick={() => router.push('/courses/my-courses')}>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        My Courses
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/certificates')}>
                                        <Award className="mr-2 h-4 w-4" />
                                        Certificates
                                    </DropdownMenuItem>
                                </>
                            )}
                            
                            {(userRole === 'instructor' || userRole === 'admin') && (
                                <>
                                    <DropdownMenuItem onClick={() => router.push('/instructor/courses')}>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        My Courses
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/instructor/earnings')}>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Earnings
                                    </DropdownMenuItem>
                                </>
                            )}
                            
                            <DropdownMenuItem onClick={() => router.push('/messages')}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Messages
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                <User className="mr-2 h-4 w-4" />
                                Profile & Account
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings & Preferences
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/support')}>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Help & Support
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={handleSignOut}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Navbar;