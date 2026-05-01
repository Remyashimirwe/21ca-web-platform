import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SubmissionsPage from '@/components/instructor/SubmissionsPage';

export default async function InstructorSubmissionsPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    const userRole = (user.publicMetadata?.role as string)?.toLowerCase();
    if (userRole !== 'instructor' && userRole !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <DashboardLayout>
            <SubmissionsPage />
        </DashboardLayout>
    );
}
