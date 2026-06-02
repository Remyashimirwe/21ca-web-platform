'use client';

import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import {
    User, Bell, Shield, Palette, Camera, Mail, Globe, Lock,
    LogOut, Trash2, Check, Moon, Sun, Monitor, ChevronRight,
    GraduationCap, HandHeart, Smartphone, Volume2, Eye, EyeOff,
    ExternalLink, Save, Sparkles, CreditCard, Share2, Languages, Zap
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const roleConfig = {
    admin: { label: 'Admin', gradient: 'from-rose-500 to-pink-600', color: 'bg-rose-500', icon: Shield, light: 'bg-rose-500/10 text-rose-600' },
    instructor: { label: 'Instructor', gradient: 'from-violet-500 to-purple-600', color: 'bg-violet-500', icon: GraduationCap, light: 'bg-violet-500/10 text-violet-600' },
    partner: { label: 'Partner', gradient: 'from-emerald-500 to-teal-600', color: 'bg-emerald-500', icon: HandHeart, light: 'bg-emerald-500/10 text-emerald-600' },
    user: { label: 'Student', gradient: 'from-blue-500 to-indigo-600', color: 'bg-blue-500', icon: User, light: 'bg-blue-500/10 text-blue-600' },
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                checked ? "bg-primary shadow-[0_0_12px_-3px_rgba(var(--primary),0.5)]" : "bg-muted-foreground/20"
            )}
        >
            <span className={cn(
                "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-300",
                checked ? "translate-x-5" : "translate-x-1"
            )} />
        </button>
    );
}

function SettingRow({ label, description, children, icon: Icon }: { label: string; description?: string; children: React.ReactNode; icon?: any }) {
    return (
        <div className="flex items-center justify-between py-5 border-b border-border/40 last:border-0 group transition-all">
            <div className="flex items-start gap-4 flex-1 min-w-0 pr-6">
                {Icon && (
                    <div className="mt-0.5 p-2 rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground tracking-tight">{label}</p>
                    {description && <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
                </div>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}

function SectionCard({ title, children, className, description, icon: Icon }: { title?: string; description?: string; children: React.ReactNode; className?: string; icon?: any }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300", className)}
        >
            {title && (
                <div className="px-8 py-6 border-b border-border/40 bg-muted/20">
                    <div className="flex items-center gap-3">
                        {Icon && <div className="p-2 rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>}
                        <div>
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">{title}</h3>
                            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                        </div>
                    </div>
                </div>
            )}
            <div className="px-8 py-2">{children}</div>
        </motion.div>
    );
}

export default function SettingsPage() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');

    const userRole = (user?.publicMetadata?.role as string) ?? 'user';
    const role = roleConfig[userRole as keyof typeof roleConfig] ?? roleConfig.user;
    const RoleIcon = role.icon;

    const [notifications, setNotifications] = useState({
        courseUpdates: true,
        assignments: true,
        messages: true,
        payments: true,
        certificates: true,
        newsletter: false,
        browserPush: true,
        emailDigest: true,
    });

    const [deleteConfirm, setDeleteConfirm] = useState('');

    const themeOptions = [
        { value: 'light', label: 'Light', icon: Sun, color: 'from-amber-400 to-orange-500' },
        { value: 'dark', label: 'Dark', icon: Moon, color: 'from-indigo-500 to-purple-600' },
        { value: 'system', label: 'System', icon: Monitor, color: 'from-slate-400 to-slate-600' },
    ] as const;

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const tabs = [
        { value: 'profile', label: 'Profile', icon: User },
        { value: 'appearance', label: 'Appearance', icon: Palette },
        { value: 'notifications', label: 'Notifications', icon: Bell },
        { value: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-10 py-6">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-1"
                    >
                        <h1 className="text-4xl font-black text-foreground tracking-tighter">Settings</h1>
                        <p className="text-sm text-muted-foreground font-medium">Personalize your experience and manage your security.</p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <Button variant="outline" className="rounded-2xl border-border/40 bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                            <Share2 className="h-4 w-4 mr-2" /> Share Profile
                        </Button>
                        <Button className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                            <Save className="h-4 w-4 mr-2" /> Save All
                        </Button>
                    </motion.div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="sticky top-20 z-10 px-4">
                        <TabsList className="h-auto p-1.5 rounded-[2rem] bg-muted/40 backdrop-blur-md border border-border/40 gap-1.5 flex w-full max-w-2xl mx-auto shadow-2xl shadow-black/5">
                            {tabs.map(({ value, label, icon: Icon }) => (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className={cn(
                                        "flex-1 rounded-[1.5rem] py-3.5 text-xs font-bold transition-all duration-300 gap-2.5",
                                        "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl data-[state=active]:ring-1 data-[state=active]:ring-primary/10",
                                        "hover:bg-background/50"
                                    )}
                                >
                                    <Icon className={cn("h-4 w-4 transition-transform duration-300", activeTab === value && "scale-110")} />
                                    <span className="hidden sm:inline uppercase tracking-widest">{label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* ── Profile ── */}
                            <TabsContent value="profile" className="space-y-8 mt-0 border-0 outline-none">
                                <SectionCard>
                                    {/* Avatar row */}
                                    <div className="flex flex-col sm:flex-row items-center gap-8 py-8 border-b border-border/40">
                                        <div className="relative group">
                                            <div className={cn("absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br opacity-75 blur-lg group-hover:opacity-100 transition duration-500", role.gradient)} />
                                            <Avatar className="h-32 w-32 rounded-[2rem] border-4 border-background shadow-2xl relative">
                                                <AvatarImage src={user?.imageUrl} />
                                                <AvatarFallback className={cn("text-white text-3xl font-black bg-gradient-to-br", role.gradient)}>
                                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <button 
                                                className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-background border border-border shadow-xl hover:scale-110 transition-transform group/btn"
                                                onClick={() => window.open('https://accounts.clerk.dev/user', '_blank')}
                                            >
                                                <Camera className="h-5 w-5 text-primary group-hover/btn:rotate-12 transition-transform" />
                                            </button>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left space-y-3">
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-black text-foreground tracking-tight">{user?.fullName ?? 'Anonymous User'}</h2>
                                                <p className="text-sm font-medium text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                                            </div>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                                <Badge className={cn("px-4 py-1.5 rounded-xl font-black uppercase tracking-tighter text-[10px] border-0 shadow-lg text-white", role.gradient)}>
                                                    {role.label}
                                                </Badge>
                                                <Badge variant="outline" className="px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest border-border/60 bg-background/50 backdrop-blur-sm">
                                                    ID: {user?.id.slice(-8)}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="rounded-2xl gap-2 text-xs font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary"
                                            onClick={() => window.open('https://accounts.clerk.dev/user', '_blank')}
                                        >
                                            Update Profile <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Info grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                                        <SettingRow icon={User} label="Full name" description="How you appear on the platform">
                                            <span className="text-sm font-bold text-foreground">{user?.fullName ?? '—'}</span>
                                        </SettingRow>
                                        <SettingRow icon={Mail} label="Email address" description="Verified primary contact">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-foreground truncate max-w-[150px]">
                                                    {user?.primaryEmailAddress?.emailAddress}
                                                </span>
                                                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            </div>
                                        </SettingRow>
                                        <SettingRow icon={Sparkles} label="Account role" description="Your platform permissions">
                                            <div className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", role.light)}>
                                                {role.label}
                                            </div>
                                        </SettingRow>
                                        <SettingRow icon={Smartphone} label="Last login" description="Your most recent activity">
                                            <span className="text-sm font-bold text-foreground">
                                                {user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Today'}
                                            </span>
                                        </SettingRow>
                                    </div>
                                </SectionCard>

                                <SectionCard title="Quick Actions" icon={Zap} description="Commonly used account management tools">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                                        <button className="flex items-center gap-4 p-4 rounded-3xl bg-muted/30 border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group text-left">
                                            <div className="p-3 rounded-2xl bg-background border border-border shadow-sm group-hover:scale-110 transition-transform">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">Public Profile</p>
                                                <p className="text-[11px] text-muted-foreground">View as others see you</p>
                                            </div>
                                        </button>
                                        <button className="flex items-center gap-4 p-4 rounded-3xl bg-muted/30 border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group text-left">
                                            <div className="p-3 rounded-2xl bg-background border border-border shadow-sm group-hover:scale-110 transition-transform">
                                                <Languages className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">Language</p>
                                                <p className="text-[11px] text-muted-foreground">English (US)</p>
                                            </div>
                                        </button>
                                    </div>
                                </SectionCard>
                            </TabsContent>

                            {/* ── Appearance ── */}
                            <TabsContent value="appearance" className="space-y-8 mt-0 border-0 outline-none">
                                <SectionCard title="Interface Theme" icon={Palette} description="Customize your visual environment">
                                    <div className="py-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {themeOptions.map(({ value, label, icon: Icon, color }) => (
                                                <button
                                                    key={value}
                                                    onClick={() => setTheme(value)}
                                                    className={cn(
                                                        "group relative flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300",
                                                        theme === value
                                                            ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10"
                                                            : "border-border/40 bg-muted/20 hover:border-border hover:bg-muted/40"
                                                    )}
                                                >
                                                    {theme === value && (
                                                        <motion.div 
                                                            layoutId="activeTheme"
                                                            className="absolute inset-0 rounded-[1.8rem] ring-2 ring-primary ring-offset-4 ring-offset-background" 
                                                        />
                                                    )}
                                                    <div className={cn(
                                                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-xl",
                                                        theme === value ? cn("bg-gradient-to-br text-white scale-110 rotate-3", color) : "bg-background text-muted-foreground group-hover:scale-105"
                                                    )}>
                                                        <Icon className="h-8 w-8" />
                                                    </div>
                                                    <div className="text-center z-10">
                                                        <span className={cn(
                                                            "text-xs font-black uppercase tracking-[0.2em]",
                                                            theme === value ? "text-primary" : "text-muted-foreground"
                                                        )}>
                                                            {label}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard title="Visual Effects" icon={Sparkles} description="Fine-tune your dashboard performance">
                                    <SettingRow icon={Smartphone} label="Compact navigation" description="Show icon-only sidebar to maximize workspace">
                                        <Toggle checked={false} onChange={() => {}} />
                                    </SettingRow>
                                    <SettingRow icon={Volume2} label="Sound effects" description="Enable interface feedback sounds">
                                        <Toggle checked={true} onChange={() => {}} />
                                    </SettingRow>
                                    <SettingRow icon={Eye} label="Reduce motion" description="Minimize animations throughout the UI">
                                        <Toggle checked={false} onChange={() => {}} />
                                    </SettingRow>
                                </SectionCard>
                            </TabsContent>

                            {/* ── Notifications ── */}
                            <TabsContent value="notifications" className="space-y-8 mt-0 border-0 outline-none">
                                <SectionCard title="Platform Activity" icon={Bell} description="Select which events trigger notifications">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                                        <SettingRow label="Course updates" description="Announcements and new content">
                                            <Toggle checked={notifications.courseUpdates} onChange={v => setNotifications(p => ({ ...p, courseUpdates: v }))} />
                                        </SettingRow>
                                        <SettingRow label="Assignments" description="Deadlines and grading alerts">
                                            <Toggle checked={notifications.assignments} onChange={v => setNotifications(p => ({ ...p, assignments: v }))} />
                                        </SettingRow>
                                        <SettingRow label="Direct messages" description="Real-time chat notifications">
                                            <Toggle checked={notifications.messages} onChange={v => setNotifications(p => ({ ...p, messages: v }))} />
                                        </SettingRow>
                                        <SettingRow label="Payments" description="Receipts and subscription info">
                                            <Toggle checked={notifications.payments} onChange={v => setNotifications(p => ({ ...p, payments: v }))} />
                                        </SettingRow>
                                    </div>
                                </SectionCard>

                                <SectionCard title="Delivery Preferences" icon={Globe} description="Choose how we contact you">
                                    <SettingRow icon={Monitor} label="Push notifications" description="Directly on your desktop or mobile">
                                        <Toggle checked={notifications.browserPush} onChange={v => setNotifications(p => ({ ...p, browserPush: v }))} />
                                    </SettingRow>
                                    <SettingRow icon={Mail} label="Email digests" description="Weekly summary of your progress">
                                        <Toggle checked={notifications.emailDigest} onChange={v => setNotifications(p => ({ ...p, emailDigest: v }))} />
                                    </SettingRow>
                                </SectionCard>

                                <div className="flex justify-center pt-4">
                                    <Button className="h-14 px-12 rounded-[2rem] bg-gradient-to-r from-primary to-indigo-600 font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95">
                                        Update Preferences
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* ── Security ── */}
                            <TabsContent value="security" className="space-y-8 mt-0 border-0 outline-none">
                                <SectionCard title="Access Control" icon={Shield} description="Protect your account from unauthorized access">
                                    <SettingRow icon={Lock} label="Password Management" description="Last changed 3 months ago">
                                        <Button
                                            variant="outline"
                                            className="rounded-2xl border-border/40 font-bold uppercase tracking-widest text-[10px] hover:bg-primary/5 hover:text-primary transition-all"
                                            onClick={() => router.push('/profile')}
                                        >
                                            Change <ExternalLink className="h-3 w-3 ml-2" />
                                        </Button>
                                    </SettingRow>
                                    <SettingRow icon={Smartphone} label="Two-factor Authentication" description="Secure your login with 2FA">
                                        <Button
                                            className="rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20"
                                            onClick={() => router.push('/profile')}
                                        >
                                            Enable <ExternalLink className="h-3 w-3 ml-2" />
                                        </Button>
                                    </SettingRow>
                                </SectionCard>

                                <SectionCard title="Billing & Plans" icon={CreditCard} description="Manage your subscription and payments">
                                    <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-500">
                                                <Sparkles className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-foreground uppercase tracking-tight">Free Student Plan</p>
                                                <p className="text-xs text-muted-foreground font-medium">Upgrade to Pro for full access</p>
                                            </div>
                                        </div>
                                        <Button className="rounded-2xl bg-amber-500 hover:bg-amber-600 font-black uppercase tracking-widest py-6 px-8 shadow-xl shadow-amber-500/20">
                                            Upgrade to Pro
                                        </Button>
                                    </div>
                                </SectionCard>

                                <SectionCard title="Danger Zone" icon={Trash2} className="border-rose-500/20 shadow-rose-500/5">
                                    <div className="py-6 space-y-6">
                                        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                                            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">Warning: Permanent Action</p>
                                            <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">
                                                Deleting your account will erase all your progress, certificates, and data permanently. This cannot be undone.
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <Input
                                                placeholder={`Type "${user?.firstName ?? 'DELETE'}" to confirm`}
                                                value={deleteConfirm}
                                                onChange={e => setDeleteConfirm(e.target.value)}
                                                className="h-12 rounded-2xl bg-background/50 border-rose-500/20 focus:ring-rose-500/20 focus:border-rose-500"
                                            />
                                            <Button
                                                variant="destructive"
                                                disabled={deleteConfirm !== (user?.firstName ?? 'DELETE')}
                                                className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 disabled:opacity-30"
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </SectionCard>
                            </TabsContent>
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
