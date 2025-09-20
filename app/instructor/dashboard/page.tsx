import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import InstructorDashboard from '@/components/dashboards/instructor/InstructorDashboard';

export default async function InstructorDashboardPage() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Check if user has instructor role - fix the metadata path
    const userRole = (sessionClaims?.publicMetadata as any)?.role;
    if (userRole !== 'instructor' && userRole !== 'admin') {
        redirect('/dashboard'); // Redirect non-instructor users to regular dashboard
    }

    return <InstructorDashboard />;
}