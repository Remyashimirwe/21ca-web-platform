// Create this as app/debug/page.tsx
import { auth } from '@clerk/nextjs/server';

export default async function DebugPage() {
    const { userId, sessionClaims } = await auth();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
            <div className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold">User ID:</h2>
                <p>{userId}</p>
                
                <h2 className="font-bold mt-4">Session Claims:</h2>
                <pre className="text-sm overflow-auto">
                    {JSON.stringify(sessionClaims, null, 2)}
                </pre>
                
                <h2 className="font-bold mt-4">Detected Role:</h2>
                <p>{(sessionClaims?.publicMetadata as any)?.role || 'undefined'}</p>
            </div>
        </div>
    );
}