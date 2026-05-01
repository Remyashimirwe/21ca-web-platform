import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
    if (!webhookSecret) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to ..env or ..env.local')
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

    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        const email = email_addresses[0]?.email_address;

        try {
            // Update metadata for user role
            const { clerkClient } = await import('@clerk/nextjs/server');
            const client = await clerkClient();
            
            if (eventType === 'user.created') {
                await client.users.updateUserMetadata(id, {
                    publicMetadata: {
                        role: 'user'
                    }
                });
                console.log(`Assigned 'user' role to user ${id}`);
            }

            // Sync with database
            await prisma.user.upsert({
                where: { clerkId: id },
                update: {
                    email: email,
                    firstName: first_name,
                    lastName: last_name,
                    imageUrl: image_url,
                },
                create: {
                    clerkId: id,
                    email: email,
                    firstName: first_name,
                    lastName: last_name,
                    imageUrl: image_url,
                    role: 'USER',
                },
            });
            console.log(`Synced user ${id} with database`);
        } catch (error) {
            console.error('Error syncing user:', error);
        }
    }

    return NextResponse.json({ message: 'Success' })
}