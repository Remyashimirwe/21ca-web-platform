import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import InstructorDashboard from '@/components/dashboards/instructor/InstructorDashboard';
import Navbar from '@/components/Navbar';

export default async function InstructorDashboardPage() {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // Check if user has instructor role
    const userRole = (sessionClaims?.metadata as any)?.role;
    if (userRole !== 'instructor' && userRole !== 'admin') {
        redirect('/dashboard'); // Redirect non-instructor users to regular dashboard
    }

    return (
        <>
            <Navbar />
            <InstructorDashboard />
        </>
    );
}