// components/messages/NewMessagePage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Send, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const NewMessagePage = () => {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName} ${user.email}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = async () => {
        if (!selectedUser || !message.trim()) return;

        try {
            setSending(true);
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId: selectedUser.clerkId,
                    content: message.trim()
                })
            });

            if (response.ok) {
                router.push(`/messages?to=${selectedUser.clerkId}`);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/messages')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">New Message</h1>
                    <p className="text-muted-foreground">Start a conversation</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select Recipient</CardTitle>
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                        selectedUser?.id === user.id
                                            ? 'bg-primary/10 border-2 border-primary'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    <Avatar>
                                        <AvatarImage src={user.imageUrl || ''} />
                                        <AvatarFallback>
                                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <Badge variant="secondary" className="capitalize">
                                        {user.role.toLowerCase()}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Message Composer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compose Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedUser ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-2">To:</p>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={selectedUser.imageUrl || ''} />
                                            <AvatarFallback>
                                                {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {selectedUser.firstName} {selectedUser.lastName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedUser.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <textarea
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full min-h-48 p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim() || sending}
                                    className="w-full"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    {sending ? 'Sending...' : 'Send Message'}
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                Select a user to start messaging
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NewMessagePage;