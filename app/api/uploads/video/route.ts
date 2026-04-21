import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define the path where the file will be saved
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
        
        // Ensure the directory exists
        await mkdir(uploadDir, { recursive: true });

        const uniqueFileName = `${randomUUID()}-${file.name.replace(/\s+/g, '_')}`;
        const filePath = join(uploadDir, uniqueFileName);

        // Write the file
        await writeFile(filePath, buffer);

        // Return the relative URL for the file
        const url = `/uploads/videos/${uniqueFileName}`;

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Error in video upload route:', error);
        return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 });
    }
}
