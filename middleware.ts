import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/about',
    '/programs',
    '/pages/(.*)',
    '/support',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/(.*)',
    '/partner/dashboard' // Partner dashboard is public
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isInstructorRoute = createRouteMatcher(['/instructor(.*)'])

export default clerkMiddleware(async (auth, req) => {
    // Restrict admin routes to users with admin role
    if (isAdminRoute(req)) {
        const { sessionClaims } = await auth.protect()
        const userRole = (sessionClaims?.publicMetadata as any)?.role
        if (userRole !== 'admin') {
            throw new Error('Unauthorized: Admin access required')
        }
    }

    // Restrict instructor routes to users with instructor or admin role
    if (isInstructorRoute(req)) {
        const { sessionClaims } = await auth.protect()
        const userRole = (sessionClaims?.publicMetadata as any)?.role
        if (userRole !== 'instructor' && userRole !== 'admin') {
            throw new Error('Unauthorized: Instructor access required')
        }
    }

    // Protect all private routes (except partner dashboard which is public)
    if (!isPublicRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}