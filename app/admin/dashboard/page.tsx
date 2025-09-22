import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/dashboards/admin/AdminDashboard';

export default async function AdminDashboardPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    // Debug logging
    console.log('=== ADMIN DASHBOARD DEBUG WITH CURRENTUSER ===');
    console.log('User ID:', userId);
    console.log('User publicMetadata:', user.publicMetadata);
    
    const userRole = user.publicMetadata?.role as string;
    console.log('User role:', userRole);
    console.log('Role check result:', userRole !== 'admin');
    console.log('=== END ADMIN DEBUG ===');

    if (userRole !== 'admin') {
        console.log('Not admin, redirecting to /dashboard');
        redirect('/dashboard');
    }

    return <AdminDashboard />;
}