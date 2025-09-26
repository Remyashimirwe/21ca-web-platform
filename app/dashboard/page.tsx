import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserDashboard from '@/components/dashboards/user/UserDashboard';
import AdminDashboard from '@/components/dashboards/admin/AdminDashboard';
import InstructorDashboard from '@/components/dashboards/instructor/InstructorDashboard';

export default async function DashboardPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    const userRole = user.publicMetadata?.role as string;

    const getDashboardComponent = () => {
        switch (userRole) {
            case 'admin':
                return <AdminDashboard />;
            case 'instructor':
                return <InstructorDashboard />;
            default:
                return <UserDashboard />;
        }
    };

    return (
        <DashboardLayout>
            {getDashboardComponent()}
        </DashboardLayout>
    );
}