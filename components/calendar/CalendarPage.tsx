'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Users,
    Video,
    MapPin,
    Edit,
    Trash2,
    X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    type: 'live_session' | 'assignment' | 'deadline' | 'meeting' | 'other';
    courseId?: string;
    courseName?: string;
    location?: string;
    attendees?: number;
}

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [userRole, setUserRole] = useState<string | null>(null);

    // New event form state
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        type: 'other' as const,
        location: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, [currentDate, view]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/calendar/events');
            const data = await response.json();
            setEvents(Array.isArray(data) ? data.map((e: any) => ({
                ...e,
                startTime: new Date(e.startTime),
                endTime: new Date(e.endTime)
            })) : []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1));
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.startTime);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'live_session':
                return 'bg-blue-500';
            case 'assignment':
                return 'bg-purple-500';
            case 'deadline':
                return 'bg-red-500';
            case 'meeting':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'live_session':
                return Video;
            case 'assignment':
                return Edit;
            case 'deadline':
                return Clock;
            case 'meeting':
                return Users;
            default:
                return CalendarIcon;
        }
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            
            const startDateTime = new Date(`${newEvent.date}T${newEvent.startTime}`);
            const endDateTime = new Date(`${newEvent.date}T${newEvent.endTime}`);

            if (endDateTime <= startDateTime) {
                toast.error('End time must be after start time');
                return;
            }

            const response = await fetch('/api/calendar/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newEvent.title,
                    description: newEvent.description,
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                    type: newEvent.type,
                    location: newEvent.location
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create event');
            }

            toast.success('Event created successfully');
            setShowEventModal(false);
            setNewEvent({
                title: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '10:00',
                type: 'other',
                location: '',
            });
            fetchEvents();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const upcomingEvents = events
        .filter(e => new Date(e.startTime) >= new Date())
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 5);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await fetch('/api/user/me');
                if (response.ok) {
                    const data = await response.json();
                    setUserRole(data.role.toLowerCase());
                }
            } catch (error) {
                console.error('Failed to fetch user role:', error);
            }
        };
        fetchUserRole();
    }, []);

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Calendar</h1>
                        <p className="text-muted-foreground">Manage your schedule and upcoming events</p>
                    </div>
                    {userRole !== 'user' && (
                        <Button onClick={() => setShowEventModal(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Event
                        </Button>
                    )}
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Calendar */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" size="sm" onClick={previousMonth}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <h2 className="text-xl font-bold">
                                        {monthNames[month]} {year}
                                    </h2>
                                    <Button variant="outline" size="sm" onClick={nextMonth}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={view === 'month' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setView('month')}
                                    >
                                        Month
                                    </Button>
                                    <Button
                                        variant={view === 'week' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setView('week')}
                                    >
                                        Week
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentDate(new Date())}
                                    >
                                        Today
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Day Names */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {dayNames.map(day => (
                                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-2">
                                {/* Empty cells before first day */}
                                {[...Array(startingDayOfWeek)].map((_, index) => (
                                    <div key={`empty-${index}`} className="aspect-square p-2" />
                                ))}

                                {/* Days of month */}
                                {[...Array(daysInMonth)].map((_, index) => {
                                    const day = index + 1;
                                    const date = new Date(year, month, day);
                                    const dayEvents = getEventsForDate(date);
                                    const today = isToday(day);

                                    return (
                                        <div
                                            key={day}
                                            className={cn(
                                                'aspect-square p-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
                                                today && 'border-primary bg-primary/5'
                                            )}
                                            onClick={() => setSelectedDate(date)}
                                        >
                                            <div className={cn(
                                                'text-sm font-medium mb-1',
                                                today && 'text-primary font-bold'
                                            )}>
                                                {day}
                                            </div>
                                            <div className="space-y-1">
                                                {dayEvents.slice(0, 2).map(event => {
                                                    const EventIcon = getEventIcon(event.type);
                                                    return (
                                                        <div
                                                            key={event.id}
                                                            className={cn(
                                                                'text-xs p-1 rounded truncate text-white',
                                                                getEventColor(event.type)
                                                            )}
                                                            title={event.title}
                                                        >
                                                            <EventIcon className="h-3 w-3 inline mr-1" />
                                                            {event.title}
                                                        </div>
                                                    );
                                                })}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-xs text-muted-foreground">
                                                        +{dayEvents.length - 2} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Events Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Upcoming Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {upcomingEvents.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No upcoming events
                                    </p>
                                ) : (
                                    upcomingEvents.map(event => {
                                        const EventIcon = getEventIcon(event.type);
                                        return (
                                            <div
                                                key={event.id}
                                                className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={cn(
                                                        'w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0',
                                                        getEventColor(event.type)
                                                    )}>
                                                        <EventIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm truncate">{event.title}</h4>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {new Date(event.startTime).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })} at {new Date(event.startTime).toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                        {event.courseName && (
                                                            <Badge variant="secondary" className="mt-2 text-xs">
                                                                {event.courseName}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">This Week</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Live Sessions</span>
                                    <span className="font-bold">
                                        {events.filter(e => e.type === 'live_session').length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Assignments Due</span>
                                    <span className="font-bold">
                                        {events.filter(e => e.type === 'assignment' || e.type === 'deadline').length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Meetings</span>
                                    <span className="font-bold">
                                        {events.filter(e => e.type === 'meeting').length}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add Event Modal */}
            <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddEvent} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                required
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                placeholder="Event title"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                placeholder="Event description"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Input
                                    type="date"
                                    required
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                                >
                                    <option value="meeting">Meeting</option>
                                    <option value="live_session">Live Session</option>
                                    <option value="assignment">Assignment</option>
                                    <option value="deadline">Deadline</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start Time</label>
                                <Input
                                    type="time"
                                    required
                                    value={newEvent.startTime}
                                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">End Time</label>
                                <Input
                                    type="time"
                                    required
                                    value={newEvent.endTime}
                                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location / Link</label>
                            <Input
                                value={newEvent.location}
                                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                placeholder="Room number or meeting link"
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setShowEventModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Event'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Selected Date Events Modal */}
            {selectedDate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>
                                    Events for {selectedDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedDate(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {getEventsForDate(selectedDate).length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No events scheduled for this day
                                    </p>
                                ) : (
                                    getEventsForDate(selectedDate).map(event => {
                                        const EventIcon = getEventIcon(event.type);
                                        return (
                                            <div key={event.id} className="p-4 bg-muted/30 rounded-lg">
                                                <div className="flex items-start gap-4">
                                                    <div className={cn(
                                                        'w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0',
                                                        getEventColor(event.type)
                                                    )}>
                                                        <EventIcon className="h-6 w-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold mb-1">{event.title}</h4>
                                                        <p className="text-sm text-muted-foreground mb-3">
                                                            {event.description}
                                                        </p>
                                                        <div className="flex flex-wrap gap-4 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                {new Date(event.startTime).toLocaleTimeString('en-US', {
                                                                    hour: 'numeric',
                                                                    minute: '2-digit'
                                                                })} - {new Date(event.endTime).toLocaleTimeString('en-US', {
                                                                    hour: 'numeric',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                            {event.courseName && (
                                                                <Badge variant="secondary">
                                                                    {event.courseName}
                                                                </Badge>
                                                            )}
                                                            {event.attendees && (
                                                                <div className="flex items-center gap-1">
                                                                    <Users className="h-4 w-4" />
                                                                    {event.attendees} attendees
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;