import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UserMyCourses from '@/components/courses/UserMyCourses';

export default async function MyCoursesPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect('/sign-in');
    }

    return <UserMyCourses />;
}