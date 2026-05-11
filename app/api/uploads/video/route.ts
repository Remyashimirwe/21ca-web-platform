import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';

// Hard server-side limits. Keep these in sync with the client-side validation
// in `components/courses/CreateCourse.tsx`, but treat the server values as the
// source of truth — the client is untrusted.
const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB

// Whitelist of MIME types we will accept *and* the file extension we will use
// for them on disk. We never trust `file.name` for the extension because an
// attacker could upload `evil.html` claiming `video/mp4` — by deriving the
// extension from the (validated) MIME we make sure the file we persist can
// only be served as a real video.
const ALLOWED_VIDEO_TYPES: Record<string, string> = {
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/x-matroska': 'mkv',
};

export async function POST(req: NextRequest) {
    try {
        // 1. AuthN: must be signed in.
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. AuthZ: only instructors/admins may upload course videos.
        //    Before this fix, any signed-in user (including free self-registered
        //    students) could upload arbitrary files into `public/uploads/videos`,
        //    enabling stored XSS / disk-fill.
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, role: true },
        });
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (dbUser.role !== 'INSTRUCTOR' && dbUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 3. Rate limit per user: cap uploads per minute to prevent disk-fill.
        const rl = rateLimit({
            key: `upload-video:${dbUser.id}`,
            limit: 10,
            windowMs: 60 * 1000,
        });
        if (!rl.success) {
            return tooManyRequestsResponse(rl.resetAt);
        }
        // Fallback rate-limit by IP too, in case the same user shares an account.
        const ipRl = rateLimit({
            key: `upload-video:ip:${getClientIp(req)}`,
            limit: 20,
            windowMs: 60 * 1000,
        });
        if (!ipRl.success) {
            return tooManyRequestsResponse(ipRl.resetAt);
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 4. MIME whitelist — reject anything that isn't a known video type.
        const mime = (file.type || '').toLowerCase();
        const extension = ALLOWED_VIDEO_TYPES[mime];
        if (!extension) {
            return NextResponse.json(
                { error: 'Unsupported file type. Allowed: mp4, webm, mov, avi, mkv.' },
                { status: 415 }
            );
        }

        // 5. Size cap — refuse to read the whole buffer if `file.size` already
        //    exceeds the limit. (We re-check after reading too in case the
        //    reported size is wrong.)
        if (typeof file.size === 'number' && file.size > MAX_VIDEO_BYTES) {
            return NextResponse.json(
                { error: 'File too large. Max size is 500 MB.' },
                { status: 413 }
            );
        }

        const bytes = await file.arrayBuffer();
        if (bytes.byteLength > MAX_VIDEO_BYTES) {
            return NextResponse.json(
                { error: 'File too large. Max size is 500 MB.' },
                { status: 413 }
            );
        }
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
        await mkdir(uploadDir, { recursive: true });

        // 6. Build the destination filename *from a UUID and our derived
        //    extension* — never from user-supplied `file.name`. This prevents
        //    extension smuggling like `evil.html` or `..%2fescape`.
        const uniqueFileName = `${randomUUID()}.${extension}`;
        const filePath = join(uploadDir, uniqueFileName);

        await writeFile(filePath, buffer);

        const url = `/uploads/videos/${uniqueFileName}`;
        return NextResponse.json({ url });
    } catch (error) {
        console.error('Error in video upload route:', error);
        return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 });
    }
}
