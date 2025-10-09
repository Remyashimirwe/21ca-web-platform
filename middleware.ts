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
    '/partner(.*)', // Partner dashboard and all sub-routes are public
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
