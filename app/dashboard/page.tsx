import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UserDashboard from '@/components/dashboards/user/UserDashboard';
import AdminDashboard from '@/components/dashboards/admin/AdminDashboard';
import InstructorDashboard from '@/components/dashboards/instructor/InstructorDashboard';

export default async function DashboardPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    // Debug logging - remove these after testing
    console.log('=== DASHBOARD DEBUG WITH CURRENTUSER ===');
    console.log('User ID:', userId);
    console.log('User publicMetadata:', user.publicMetadata);
    console.log('User privateMetadata:', user.privateMetadata);
    console.log('User unsafeMetadata:', user.unsafeMetadata);

    // Get user role from public metadata using currentUser()
    const userRole = user.publicMetadata?.role as string;
    console.log('Detected user role:', userRole);
    console.log('Role type:', typeof userRole);
    console.log('=== END DEBUG ===');

    // Route to appropriate dashboard based on role
    switch (userRole) {
        case 'admin':
            console.log('Routing to AdminDashboard');
            return <AdminDashboard />;
        case 'instructor':
            console.log('Routing to InstructorDashboard');
            return <InstructorDashboard />;
        default:
            console.log('Routing to UserDashboard (default)');
            return <UserDashboard />;
    }
}