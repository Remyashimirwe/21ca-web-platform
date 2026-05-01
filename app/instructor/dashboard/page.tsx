import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InstructorDashboard from '@/components/dashboards/instructor/InstructorDashboard';

export default async function InstructorDashboardPage() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const userRole = (sessionClaims?.publicMetadata as any)?.role;
    if (userRole !== 'instructor' && userRole !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <DashboardLayout>
            <InstructorDashboard />
        </DashboardLayout>
    );
}