'use client';

import React, { useState, useEffect } from 'react';
import { 
    CheckCircle, 
    Clock, 
    User, 
    BookOpen, 
    MessageSquare, 
    Send,
    Loader2,
    Search,
    Filter,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type Submission = {
    id: string;
    content: string;
    submittedAt: string;
    status: 'SUBMITTED' | 'GRADED' | 'NEEDS_REVISION' | 'LATE';
    points?: number;
    feedback?: string;
    student: {
        firstName: string | null;
        lastName: string | null;
        email: string;
        imageUrl: string | null;
    };
    assignment: {
        title: string;
        course: {
            title: string;
        };
    };
};

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [points, setPoints] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/instructor/submissions');
            if (response.ok) {
                const data = await response.json();
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
            toast.error('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async () => {
        if (!selectedSubmission) return;
        
        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/instructor/submissions/${selectedSubmission.id}/grade`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ points, feedback }),
            });

            if (response.ok) {
                toast.success('Submission graded successfully');
                fetchSubmissions();
                setSelectedSubmission(null);
                setPoints('');
                setFeedback('');
            } else {
                toast.error('Failed to save grade');
            }
        } catch (error) {
            console.error('Error grading:', error);
            toast.error('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredSubmissions = submissions.filter(s => 
        s.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.assignment.course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderContent = (content: string) => {
        try {
            const parsed = JSON.parse(content);
            if (typeof parsed === 'object') {
                return (
                    <div className="space-y-4">
                        {Object.entries(parsed).map(([key, value]: [string, any]) => (
                            <div key={key} className="border-b pb-2 last:border-0">
                                <p className="text-sm font-semibold text-muted-foreground mb-1">Question {key}</p>
                                <div className="p-3 bg-muted/50 rounded-md text-sm">
                                    {Array.isArray(value) ? value.join(', ') : String(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }
        } catch (e) {
            return <div className="whitespace-pre-wrap text-sm">{content}</div>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading submissions...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Student Submissions</h1>
                    <p className="text-muted-foreground mt-1">Review and grade your students' work</p>
                </div>
                
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search student, course or assignment..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredSubmissions.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle>No submissions found</CardTitle>
                    <CardDescription className="mt-2">
                        {searchTerm ? "No submissions match your search criteria." : "When students submit their work, it will appear here for you to review."}
                    </CardDescription>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubmissions.map((submission) => (
                        <Card key={submission.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-2 bg-primary" />
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant={submission.status === 'GRADED' ? 'secondary' : 'default'} className={submission.status === 'GRADED' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                                        {submission.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(submission.submittedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-lg line-clamp-1">{submission.assignment.title}</CardTitle>
                                <CardDescription className="line-clamp-1">{submission.assignment.course.title}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-6">
                                    <Avatar>
                                        <AvatarImage src={submission.student.imageUrl || ''} />
                                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium leading-none">
                                            {submission.student.firstName} {submission.student.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">{submission.student.email}</p>
                                    </div>
                                </div>
                                
                                <Button 
                                    className="w-full group" 
                                    variant={submission.status === 'GRADED' ? 'outline' : 'default'}
                                    onClick={() => {
                                        setSelectedSubmission(submission);
                                        setPoints(submission.points?.toString() || '');
                                        setFeedback(submission.feedback || '');
                                    }}
                                >
                                    {submission.status === 'GRADED' ? 'Review Grade' : 'Grade Submission'}
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedSubmission && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Badge variant={selectedSubmission.status === 'GRADED' ? 'secondary' : 'default'}>
                                        {selectedSubmission.status}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        Submitted on {new Date(selectedSubmission.submittedAt).toLocaleString()}
                                    </span>
                                </div>
                                <DialogTitle className="text-2xl">{selectedSubmission.assignment.title}</DialogTitle>
                                <DialogDescription>
                                    Student: {selectedSubmission.student.firstName} {selectedSubmission.student.lastName} ({selectedSubmission.student.email})
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Submission Content
                                    </h4>
                                    <Card className="bg-muted/30">
                                        <CardContent className="p-4">
                                            {renderContent(selectedSubmission.content)}
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Grading & Feedback
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-1">
                                            <label className="text-sm font-medium mb-1.5 block">Points</label>
                                            <Input 
                                                type="number" 
                                                placeholder="Score" 
                                                value={points}
                                                onChange={(e) => setPoints(e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="text-sm font-medium mb-1.5 block">Feedback to Student</label>
                                            <Textarea 
                                                placeholder="Great work! Here are some suggestions..." 
                                                className="min-h-[100px]"
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="ghost" onClick={() => setSelectedSubmission(null)}>Cancel</Button>
                                <Button 
                                    onClick={handleGrade} 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Send className="mr-2 h-4 w-4" />
                                    {selectedSubmission.status === 'GRADED' ? 'Update Grade' : 'Save Grade'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
