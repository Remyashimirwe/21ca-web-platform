'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Search,
    Users,
    Shield,
    UserCheck,
    UserX,
    Trash2,
    RefreshCw,
    Crown,
    GraduationCap,
    Briefcase,
    UserRoundPen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Role = 'USER' | 'INSTRUCTOR' | 'ADMIN' | 'PARTNER';

type UserRow = {
    id: string;
    clerkId: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string | null;
    role: Role;
    isActive?: boolean;
};

const roleConfig: Record<Role, { label: string; icon: React.ElementType; color: string }> = {
    USER: { label: 'User', icon: Users, color: 'text-slate-600' },
    INSTRUCTOR: { label: 'Instructor', icon: GraduationCap, color: 'text-blue-600' },
    ADMIN: { label: 'Admin', icon: Crown, color: 'text-purple-600' },
    PARTNER: { label: 'Partner', icon: Briefcase, color: 'text-emerald-600' }
};

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [savingId, setSavingId] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users', { cache: 'no-store' });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return users;

        return users.filter((u) =>
            [u.firstName, u.lastName, u.email, u.role]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [users, query]);

    const updateRole = async (userId: string, role: Role) => {
        setSavingId(userId);
        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role })
            });

            if (!res.ok) throw new Error('Failed to update role');

            await fetchUsers();
        } finally {
            setSavingId(null);
        }
    };

    const deleteUser = async (userId: string) => {
        const confirmed = confirm('Delete this user from Clerk and deactivate in the database?');
        if (!confirmed) return;

        setSavingId(userId);
        try {
            const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (!res.ok) throw new Error('Failed to delete user');

            await fetchUsers();
        } finally {
            setSavingId(null);
        }
    };

    const stats = {
        total: users.length,
        admins: users.filter((u) => u.role === 'ADMIN').length,
        instructors: users.filter((u) => u.role === 'INSTRUCTOR').length,
        partners: users.filter((u) => u.role === 'PARTNER').length
    };

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                        <p className="mt-2 text-muted-foreground">
                            Manage roles, search users, and sync changes with Clerk and the database.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={fetchUsers}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                                </div>
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Admins</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.admins}</p>
                                </div>
                                <Crown className="h-6 w-6 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Instructors</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.instructors}</p>
                                </div>
                                <GraduationCap className="h-6 w-6 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Partners</p>
                                    <p className="mt-2 text-3xl font-bold">{stats.partners}</p>
                                </div>
                                <Briefcase className="h-6 w-6 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            All Users
                        </CardTitle>

                        <div className="relative w-full max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search users..."
                                className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <div className="py-12 text-center text-muted-foreground">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">No users found.</div>
                        ) : (
                            <div className="space-y-4">
                                {filteredUsers.map((user) => {
                                    const config = roleConfig[user.role];
                                    const RoleIcon = config.icon;

                                    return (
                                        <div
                                            key={user.id}
                                            className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4 lg:flex-row lg:items-center lg:justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    {user.imageUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={user.imageUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
                                                    ) : (
                                                        <Users className="h-5 w-5" />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        {user.firstName || ''} {user.lastName || ''}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    <div className={`mt-2 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium ${config.color}`}>
                                                        <RoleIcon className="h-3.5 w-3.5" />
                                                        {config.label}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Button
                                                    variant={user.role === 'USER' ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateRole(user.id, 'USER')}
                                                    disabled={savingId === user.id}
                                                >
                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                    User
                                                </Button>
                                                <Button
                                                    variant={user.role === 'INSTRUCTOR' ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateRole(user.id, 'INSTRUCTOR')}
                                                    disabled={savingId === user.id}
                                                >
                                                    <GraduationCap className="mr-2 h-4 w-4" />
                                                    Instructor
                                                </Button>
                                                <Button
                                                    variant={user.role === 'PARTNER' ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateRole(user.id, 'PARTNER')}
                                                    disabled={savingId === user.id}
                                                >
                                                    <Briefcase className="mr-2 h-4 w-4" />
                                                    Partner
                                                </Button>
                                                <Button
                                                    variant={user.role === 'ADMIN' ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => updateRole(user.id, 'ADMIN')}
                                                    disabled={savingId === user.id}
                                                >
                                                    <Crown className="mr-2 h-4 w-4" />
                                                    Admin
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => deleteUser(user.id)}
                                                    disabled={savingId === user.id}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}