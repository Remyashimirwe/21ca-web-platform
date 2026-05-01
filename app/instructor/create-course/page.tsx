import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CreateCourse from '@/components/courses/CreateCourse';

export default async function CreateCoursePage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    const userRole = String(user.publicMetadata?.role || '').toUpperCase();

    if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
        redirect('/dashboard');
    }

    return (
        <DashboardLayout>
            <CreateCourse />
        </DashboardLayout>
    );
}