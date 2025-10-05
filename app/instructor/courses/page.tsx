import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MyCourses from '@/components/courses/MyCourses';

export default async function InstructorCoursesPage() {
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
            <MyCourses />
        </DashboardLayout>
    );
}