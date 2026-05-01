// app/notifications/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NotificationsPage from '@/components/notifications/NotificationsPage';

export default async function NotificationsPageRoute() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    return (
        <DashboardLayout>
            <NotificationsPage />
        </DashboardLayout>
    );
}