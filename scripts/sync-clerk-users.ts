// scripts/sync-clerk-users.ts
import { PrismaClient } from '@prisma/client';
import { createClerkClient } from '@clerk/backend';

const prisma = new PrismaClient();

async function syncUsers() {
    try {
        // Initialize Clerk client with your secret key
        const clerkClient = createClerkClient({
            secretKey: process.env.CLERK_SECRET_KEY
        });

        console.log('Fetching users from Clerk...');
        
        // Get users from Clerk
        const response = await clerkClient.users.getUserList({
            limit: 100
        });
        
        console.log(`Found ${response.data.length} users in Clerk`);
        
        for (const user of response.data) {
            const clerkRole = (user.publicMetadata?.role as string) || 'user';
            const userRole = clerkRole.toUpperCase();
            const validRoles = ['USER', 'INSTRUCTOR', 'ADMIN', 'PARTNER'];
            const finalRole = validRoles.includes(userRole) ? userRole : 'USER';
            
            await prisma.user.upsert({
                where: { clerkId: user.id },
                update: {
                    email: user.emailAddresses[0]?.emailAddress || '',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    imageUrl: user.imageUrl || '',
                    role: finalRole as any
                },
                create: {
                    clerkId: user.id,
                    email: user.emailAddresses[0]?.emailAddress || '',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    imageUrl: user.imageUrl || '',
                    role: finalRole as any
                }
            });
            
            console.log(`✅ Synced user: ${user.firstName} ${user.lastName} (${finalRole})`);
        }
        
        console.log('✅ All users synced successfully!');
    } catch (error) {
        console.error('❌ Error syncing users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

syncUsers();