// components/notifications/NotificationsPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bell,
    Check,
    CheckCheck,
    BookOpen,
    MessageSquare,
    Award,
    DollarSign,
    AlertCircle,
    Trash2,
    Filter,
    Users,
    Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'COURSE_UPDATE' | 'ASSIGNMENT' | 'PAYMENT' | 'CERTIFICATE';
    isRead: boolean;
    actionUrl: string | null;
    createdAt: Date;
}

const NotificationsPage = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/notifications');
            const data = await response.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
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

    const deleteNotification = async (notificationId: string) => {
        try {
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE'
            });
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'COURSE_UPDATE':
                return <BookOpen className="h-5 w-5 text-blue-500" />;
            case 'ASSIGNMENT':
                return <Upload className="h-5 w-5 text-purple-500" />;
            case 'PAYMENT':
                return <DollarSign className="h-5 w-5 text-green-500" />;
            case 'CERTIFICATE':
                return <Award className="h-5 w-5 text-yellow-500" />;
            case 'SUCCESS':
                return <CheckCheck className="h-5 w-5 text-green-500" />;
            case 'WARNING':
                return <AlertCircle className="h-5 w-5 text-orange-500" />;
            case 'ERROR':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Bell className="h-5 w-5 text-blue-500" />;
        }
    };

    const formatTime = (date: Date | string) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diff = now.getTime() - notifDate.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return notifDate.toLocaleDateString();
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground">
                        Stay updated with your latest activities
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={markAllAsRead}>
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{notifications.length}</p>
                            </div>
                            <Bell className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Unread</p>
                                <p className="text-2xl font-bold">{unreadCount}</p>
                            </div>
                            <Badge variant="destructive" className="text-lg px-3 py-1">
                                {unreadCount}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Week</p>
                                <p className="text-2xl font-bold">
                                    {notifications.filter(n => {
                                        const weekAgo = new Date();
                                        weekAgo.setDate(weekAgo.getDate() - 7);
                                        return new Date(n.createdAt) > weekAgo;
                                    }).length}
                                </p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            All ({notifications.length})
                        </Button>
                        <Button
                            variant={filter === 'unread' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('unread')}
                        >
                            Unread ({unreadCount})
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-muted rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-muted rounded w-3/4" />
                                        <div className="h-3 bg-muted rounded w-1/2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredNotifications.length === 0 ? (
                <Card className="p-12 text-center">
                    <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </h3>
                    <p className="text-muted-foreground">
                        {filter === 'unread'
                            ? "You're all caught up!"
                            : 'New notifications will appear here'}
                    </p>
                </Card>
            ) : (
                <div className="space-y-2">
                    {filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={cn(
                                'cursor-pointer hover:shadow-md transition-all duration-200',
                                !notification.isRead && 'border-l-4 border-l-primary bg-primary/5'
                            )}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                                        !notification.isRead ? 'bg-primary/10' : 'bg-muted'
                                    )}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className={cn(
                                                    'font-medium',
                                                    !notification.isRead && 'text-foreground'
                                                )}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {formatTime(notification.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(notification.id);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;