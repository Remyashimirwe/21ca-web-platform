import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

type CalendarBody = {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    duration?: number;
    timezone?: string;
    attendees?: string[];
};

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = (await req.json()) as CalendarBody;
        const { title, description, date, time, duration = 60, timezone = 'UTC', attendees = [] } = body;

        if (!title?.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        if (!time?.trim()) {
            return NextResponse.json({ error: 'Time is required' }, { status: 400 });
        }

        const microsoftAccessToken = process.env.MICROSOFT_CALENDAR_ACCESS_TOKEN;

        if (!microsoftAccessToken) {
            return NextResponse.json(
                { error: 'Microsoft Calendar is not configured' },
                { status: 500 }
            );
        }

        const start = new Date(`${date}T${time}`);
        const end = new Date(start.getTime() + duration * 60 * 1000);

        const eventRes = await fetch('https://graph.microsoft.com/v1.0/me/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${microsoftAccessToken}`,
            },
            body: JSON.stringify({
                subject: title.trim(),
                body: {
                    contentType: 'HTML',
                    content: description?.trim() || '',
                },
                start: {
                    dateTime: start.toISOString(),
                    timeZone: timezone,
                },
                end: {
                    dateTime: end.toISOString(),
                    timeZone: timezone,
                },
                attendees: attendees.map((email: string) => ({
                    emailAddress: { address: email },
                    type: 'required',
                })),
            }),
        });

        const data = await eventRes.json();

        if (!eventRes.ok) {
            return NextResponse.json(
                { error: data?.error?.message || 'Failed to create Microsoft Calendar event' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            provider: 'MICROSOFT',
            eventId: data.id,
            webLink: data.webLink,
        });
    } catch (error) {
        console.error('Microsoft Calendar route error:', error);
        return NextResponse.json(
            { error: 'Failed to create Microsoft Calendar event' },
            { status: 500 }
        );
    }
}