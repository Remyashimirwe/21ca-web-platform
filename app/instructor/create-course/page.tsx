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

    const userRole = user.publicMetadata?.role as string;
    if (userRole !== 'instructor' && userRole !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <DashboardLayout>
            <CreateCourse />
        </DashboardLayout>
    );
}