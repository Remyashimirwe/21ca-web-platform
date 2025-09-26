'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Check if mobile view
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarCollapsed(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [pathname, isMobile]);

    const handleSidebarToggle = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile Backdrop */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed left-0 top-0 z-50 h-full transition-transform duration-300",
                isMobile && !sidebarOpen && "-translate-x-full",
                isMobile ? "w-64" : sidebarCollapsed ? "w-16" : "w-64"
            )}>
                <Sidebar
                    collapsed={!isMobile && sidebarCollapsed}
                    onToggle={isMobile ? () => setSidebarOpen(false) : handleSidebarToggle}
                />
            </div>

            {/* Main Content */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
            )}>
                {/* Navbar */}
                <Navbar
                    onSidebarToggle={handleSidebarToggle}
                    sidebarCollapsed={sidebarCollapsed}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;