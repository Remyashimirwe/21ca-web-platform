import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/dashboards/admin/AdminDashboard';
import Navbar from '@/components/Navbar';

export default async function AdminDashboardPage() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Check if user has admin role
    const userRole = (sessionClaims?.metadata as any)?.role;
    if (userRole !== 'admin') {
        redirect('/dashboard'); // Redirect non-admin users to regular dashboard
    }

    return (
        <>
            <Navbar />
            <AdminDashboard />
        </>
    );
}