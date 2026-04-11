// app/admin/courses/review/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminCoursesPage from '@/components/admin/courses/AdminCoursesPage';

export default async function AdminCoursesReviewPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    const userRole = String(user.publicMetadata?.role || '').toUpperCase();
    if (userRole !== 'ADMIN') {
        redirect('/dashboard');
    }

    return (
        <DashboardLayout>
            <AdminCoursesPage />
        </DashboardLayout>
    );
}