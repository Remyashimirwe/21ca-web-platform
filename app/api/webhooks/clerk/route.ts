import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
    if (!webhookSecret) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = headers()
    const svix_id = (await headerPayload).get('svix-id')
    const svix_timestamp = (await headerPayload).get('svix-timestamp')
    const svix_signature = (await headerPayload).get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(webhookSecret)

    let evt: any

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as any
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error occured', {
            status: 400
        })
    }

    // Handle the webhook
    const { id } = evt.data
    const eventType = evt.type

    if (eventType === 'user.created') {
        // Automatically assign 'user' role to new users
        try {
            const { clerkClient } = await import('@clerk/nextjs/server')
            
            await clerkClient.users.updateUserMetadata(id, {
                publicMetadata: {
                    role: 'user' // Default role for new users
                }
            })
            
            console.log(`Assigned 'user' role to user ${id}`)
        } catch (error) {
            console.error('Error updating user metadata:', error)
        }
    }

    return NextResponse.json({ message: 'Success' })
}