import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminDashboard from '@/components/dashboards/admin/AdminDashboard';

export default async function AdminDashboardPage() {
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
            <AdminDashboard />
        </DashboardLayout>
    );
}