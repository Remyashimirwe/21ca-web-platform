'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Send,
    Search,
    MoreVertical,
    Paperclip,
    Smile,
    Phone,
    Video,
    Info,
    X,
    Check,
    CheckCheck,
    Plus,
    MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Conversation {
    id: string;
    participant: {
        id: string;
        clerkId: string;
        firstName: string;
        lastName: string;
        imageUrl: string | null;
        role: string;
    };
    lastMessage: {
        content: string;
        createdAt: Date;
        isRead: boolean;
        senderId: string;
    } | null;
    unreadCount: number;
}

interface Message {
    id: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    sender: {
        id: string;
        clerkId: string;
        firstName: string;
        lastName: string;
        imageUrl: string | null;
    };
    recipient: {
        id: string;
        clerkId: string;
    };
}

const MessagesPage = () => {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const toUserId = searchParams.get('to');
    
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showMobileChat, setShowMobileChat] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Initial fetch with loading indicator
        const initialFetch = async () => {
            setLoading(true);
            await fetchConversations();
            setLoading(false);
        };
        
        initialFetch();
        
        // Silent polling every 10 seconds
        const interval = setInterval(fetchConversations, 10000);
        
        // Auto-select conversation if 'to' parameter is provided
        if (toUserId) {
            setSelectedConversation(toUserId);
            setShowMobileChat(true);
        }
        
        return () => clearInterval(interval);
    }, [toUserId]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation);
            markAsRead(selectedConversation);
            
            // Poll for new messages every 3 seconds when a conversation is selected
            const interval = setInterval(() => {
                fetchMessages(selectedConversation);
            }, 3000);
            
            return () => clearInterval(interval);
        }
    }, [selectedConversation]);

    useEffect(() => {
        // Only auto-scroll if user hasn't scrolled up manually
        const container = messagesEndRef.current?.parentElement;
        if (container) {
            const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
            if (isScrolledToBottom) {
                scrollToBottom();
            }
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            // Silent fetch - don't set loading state on polls
            const response = await fetch('/api/messages/conversations');
            const data = await response.json();
            
            // Only update if conversations changed
            const newConversations = Array.isArray(data) ? data : [];
            setConversations(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(newConversations)) {
                    return newConversations;
                }
                return prev;
            });
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    };

    const fetchMessages = async (conversationId: string) => {
        try {
            // Silent fetch - no loading indicators
            const response = await fetch(`/api/messages/${conversationId}`);
            const data = await response.json();
            
            // Only update if messages changed
            const newMessages = Array.isArray(data) ? data : [];
            setMessages(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(newMessages)) {
                    return newMessages;
                }
                return prev;
            });
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const markAsRead = async (conversationId: string) => {
        try {
            await fetch(`/api/messages/${conversationId}/read`, {
                method: 'POST'
            });
            
            setConversations(prev => prev.map(conv => 
                conv.participant.clerkId === conversationId 
                    ? { ...conv, unreadCount: 0 }
                    : conv
            ));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            setSending(true);
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId: selectedConversation,
                    content: newMessage.trim()
                })
            });

            if (response.ok) {
                const message = await response.json();
                setMessages(prev => [...prev, message]);
                setNewMessage('');
                fetchConversations(); // Update conversation list
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (date: Date | string) => {
        const messageDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return messageDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return messageDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    };

    const filteredConversations = Array.isArray(conversations) 
        ? conversations.filter(conv =>
            `${conv.participant?.firstName || ''} ${conv.participant?.lastName || ''}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
        : [];

    const selectedChat = Array.isArray(conversations) 
        ? conversations.find(c => c.participant?.clerkId === selectedConversation)
        : null;
    const totalUnread = Array.isArray(conversations) 
        ? conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0)
        : 0;

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-4">
            {/* Conversations List - Hidden on mobile when chat is open */}
            <Card className={cn(
                "w-full md:w-80 lg:w-96 flex-shrink-0 transition-all duration-300",
                showMobileChat && "hidden md:flex"
            )}>
                <div className="h-full flex flex-col">
                    {/* Search Header */}
                    <div className="p-4 border-b space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Messages</h2>
                            <div className="flex items-center gap-2">
                                {totalUnread > 0 && (
                                    <Badge variant="destructive" className="rounded-full">
                                        {totalUnread}
                                    </Badge>
                                )}
                                <Button 
                                    size="sm"
                                    onClick={() => router.push('/messages/new')}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    New
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex gap-3 p-3 animate-pulse">
                                        <div className="w-12 h-12 bg-muted rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-muted rounded w-3/4" />
                                            <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => {
                                        setSelectedConversation(conv.participant.clerkId);
                                        setShowMobileChat(true);
                                    }}
                                    className={cn(
                                        "flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b",
                                        selectedConversation === conv.participant.clerkId && "bg-muted/50 border-l-4 border-l-primary"
                                    )}
                                >
                                    <div className="relative">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={conv.participant.imageUrl || ''} />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {conv.participant.firstName?.charAt(0)}
                                                {conv.participant.lastName?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className="font-semibold truncate">
                                                {conv.participant.firstName} {conv.participant.lastName}
                                            </p>
                                            {conv.lastMessage && (
                                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                                    {formatTime(conv.lastMessage.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn(
                                                "text-sm truncate",
                                                conv.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                                            )}>
                                                {conv.lastMessage?.content || 'No messages yet'}
                                            </p>
                                            {conv.unreadCount > 0 && (
                                                <Badge variant="destructive" className="rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
                                                    {conv.unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Card>

            {/* Chat Area */}
            <Card className={cn(
                "flex-1 flex flex-col",
                !showMobileChat && "hidden md:flex"
            )}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="md:hidden"
                                    onClick={() => setShowMobileChat(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedChat.participant.imageUrl || ''} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {selectedChat.participant.firstName?.charAt(0)}
                                        {selectedChat.participant.lastName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">
                                        {selectedChat.participant.firstName} {selectedChat.participant.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {selectedChat.participant.role}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="hidden sm:flex">
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="hidden sm:flex">
                                    <Video className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => {
                                const isOwn = message.sender.clerkId === user?.id;
                                const showAvatar = index === 0 || messages[index - 1].sender.clerkId !== message.sender.clerkId;
                                
                                return (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-2",
                                            isOwn ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {!isOwn && (
                                            <Avatar className={cn(
                                                "h-8 w-8",
                                                !showAvatar && "invisible"
                                            )}>
                                                <AvatarImage src={message.sender.imageUrl || ''} />
                                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                    {message.sender.firstName?.charAt(0)}
                                                    {message.sender.lastName?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "max-w-[70%] sm:max-w-md",
                                            isOwn && "order-first"
                                        )}>
                                            <div className={cn(
                                                "rounded-2xl px-4 py-2",
                                                isOwn 
                                                    ? "bg-primary text-primary-foreground" 
                                                    : "bg-muted"
                                            )}>
                                                <p className="text-sm break-words">{message.content}</p>
                                            </div>
                                            <div className={cn(
                                                "flex items-center gap-1 mt-1 px-2",
                                                isOwn ? "justify-end" : "justify-start"
                                            )}>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTime(message.createdAt)}
                                                </span>
                                                {isOwn && (
                                                    message.isRead ? (
                                                        <CheckCheck className="h-3 w-3 text-blue-500" />
                                                    ) : (
                                                        <Check className="h-3 w-3 text-muted-foreground" />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={sendMessage} className="p-4 border-t">
                            <div className="flex items-end gap-2">
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="sm"
                                    className="hidden sm:flex"
                                >
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <div className="flex-1 relative">
                                    <Input
                                        ref={inputRef}
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1 hidden sm:flex"
                                    >
                                        <Smile className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={!newMessage.trim() || sending}
                                    size="sm"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center p-8">
                        <div>
                            <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                            <p className="text-muted-foreground">
                                Choose a conversation from the list to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MessagesPage;