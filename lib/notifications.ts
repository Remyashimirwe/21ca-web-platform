import { prisma } from './prisma';

type NotificationType =
    | 'INFO'
    | 'SUCCESS'
    | 'WARNING'
    | 'ERROR'
    | 'COURSE_UPDATE'
    | 'ASSIGNMENT'
    | 'PAYMENT'
    | 'CERTIFICATE';

export async function createNotification({
                                             userId,
                                             title,
                                             message,
                                             type,
                                             actionUrl,
                                         }: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    actionUrl?: string;
}) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                actionUrl: actionUrl ?? null,
            },
        });

        console.log(`Notification created: ${notification.id} for user ${userId}`);
        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
        return null;
    }
}