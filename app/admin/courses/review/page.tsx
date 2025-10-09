// app/admin/courses/review/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CourseReviewPage from '@/components/admin/CourseReviewPage';

export default async function AdminCourseReviewPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    const userRole = user.publicMetadata?.role as string;
    if (userRole !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <DashboardLayout>
            <CourseReviewPage />
        </DashboardLayout>
    );
}