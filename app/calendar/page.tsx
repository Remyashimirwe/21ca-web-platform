// app/calendar/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CalendarPage from '@/components/calendar/CalendarPage';

export default async function CalendarPageRoute() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    return (
        <DashboardLayout>
            <CalendarPage />
        </DashboardLayout>
    );
}