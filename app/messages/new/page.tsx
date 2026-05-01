import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NewMessagePage from '@/components/messages/NewMessagePage';

export default async function NewMessagePageRoute() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    return (
        <DashboardLayout>
            <NewMessagePage />
        </DashboardLayout>
    );
}