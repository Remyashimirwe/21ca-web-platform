// middleware.ts
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
    '/api/programs(.*)',
    '/api/instructors(.*)',
    '/api/categories(.*)',
    // NOTE: `/partner(.*)` is intentionally *not* public. The partner area
    // (e.g. `/partner/dashboard`) should require authentication; if a specific
    // marketing page needs to be public, add it explicitly here.
])

export default clerkMiddleware(async (auth, req) => {
    // Only protect non-public routes
    if (!isPublicRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
