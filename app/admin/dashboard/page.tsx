import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/dashboards/admin/AdminDashboard';

export default async function AdminDashboardPage() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Check if user has admin role - fix the metadata path
    const userRole = (sessionClaims?.publicMetadata as any)?.role;
    if (userRole !== 'admin') {
        redirect('/dashboard'); // Redirect non-admin users to regular dashboard
    }

    return <AdminDashboard />;
}