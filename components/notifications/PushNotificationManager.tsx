'use client';

import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PushNotificationManager() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setSupported(true);
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!supported) return;

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === 'granted') {
                toast.success('Notifications enabled!');
                // We could show a test notification here
                new Notification('21CA Platform', {
                    body: 'You will now receive notifications on your device.',
                    icon: '/favicon.ico'
                });
            } else if (result === 'denied') {
                toast.error('Notification permission denied.');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };

    if (!supported) return null;

    // We can return a small UI element or just handle the logic
    // For now, let's just provide the logic. 
    // If the user hasn't decided yet, we might want to show a prompt.
    
    return null;
}

/**
 * Utility function to show a browser notification
 */
export const showBrowserNotification = (title: string, options?: NotificationOptions) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        return new Notification(title, {
            icon: '/favicon.ico',
            ...options
        });
    }
    return null;
};
