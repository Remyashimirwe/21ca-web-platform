import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MessagesPage from '@/components/messages/MessagesPage';

export default async function MessagesPageRoute() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    return (
        <DashboardLayout>
            <MessagesPage />
        </DashboardLayout>
    );
}