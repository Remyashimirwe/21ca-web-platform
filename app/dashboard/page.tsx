import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UserDashboard from '@/components/dashboards/user/UserDashboard';
import AdminDashboard from '@/components/dashboards/admin/AdminDashboard';
import InstructorDashboard from '@/components/dashboards/instructor/InstructorDashboard';

export default async function DashboardPage() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Get user role from public metadata
    const userRole = (sessionClaims?.publicMetadata as any)?.role;

    // Route to appropriate dashboard based on role
    switch (userRole) {
        case 'admin':
            return <AdminDashboard />;
        case 'instructor':
            return <InstructorDashboard />;
        default:
            return <UserDashboard />;
    }
}