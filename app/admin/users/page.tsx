import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserManagementPage from '@/components/dashboards/admin/UserManagementPage';

export default async function AdminUsersPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    const userRole = user.publicMetadata?.role as string;
    if (userRole !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <DashboardLayout>
            <UserManagementPage />
        </DashboardLayout>
    );
}