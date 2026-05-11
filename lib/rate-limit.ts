/**
 * Lightweight in-memory rate limiter.
 *
 * This is intentionally tiny and dependency-free. It uses a fixed-window
 * counter keyed by a caller-supplied identity string (e.g. `userId` or IP).
 *
 * Limitations (deliberate, documented):
 *   - Memory is per-process, so on a multi-instance / serverless deploy the
 *     limit is enforced per instance, not globally. That is still a useful
 *     speed bump against trivial brute-force / abuse from a single attacker.
 *   - For a real shared limit across instances, swap this for Upstash
 *     Ratelimit / Vercel KV / Redis. The call sites only need the
 *     `rateLimit({ key, limit, windowMs })` signature, so the helper can be
 *     replaced without touching routes.
 */
import { NextRequest, NextResponse } from 'next/server';

type Bucket = { count: number; resetAt: number };

// Module-level Map survives across hot requests within the same Node process.
const buckets: Map<string, Bucket> = (globalThis as any).__rateLimitBuckets__ ||
    new Map<string, Bucket>();
(globalThis as any).__rateLimitBuckets__ = buckets;

export interface RateLimitOptions {
    /** Stable identity for this caller (e.g. `${userId}:${route}` or `${ip}:${route}`). */
    key: string;
    /** Max requests allowed within `windowMs`. */
    limit: number;
    /** Window length in milliseconds. */
    windowMs: number;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    /** Epoch ms when the current window resets. */
    resetAt: number;
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
        const fresh: Bucket = { count: 1, resetAt: now + windowMs };
        buckets.set(key, fresh);
        return { success: true, remaining: limit - 1, resetAt: fresh.resetAt };
    }

    if (existing.count >= limit) {
        return { success: false, remaining: 0, resetAt: existing.resetAt };
    }

    existing.count += 1;
    return { success: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/** Best-effort client IP from common proxy headers (Vercel sets `x-forwarded-for`). */
export function getClientIp(req: NextRequest): string {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) {
        const first = xff.split(',')[0]?.trim();
        if (first) return first;
    }
    return req.headers.get('x-real-ip') || 'unknown';
}

/** Build a standard 429 response with `Retry-After`. */
export function tooManyRequestsResponse(resetAt: number): NextResponse {
    const retryAfterSec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    return NextResponse.json(
        { error: 'Too many requests' },
        {
            status: 429,
            headers: {
                'Retry-After': String(retryAfterSec),
            },
        }
    );
}

// Opportunistic cleanup so the Map doesn't grow unbounded in long-lived processes.
// Runs at most once every 5 minutes per process.
let lastSweep = 0;
function sweep() {
    const now = Date.now();
    if (now - lastSweep < 5 * 60 * 1000) return;
    lastSweep = now;
    for (const [k, b] of buckets) {
        if (b.resetAt <= now) buckets.delete(k);
    }
}
// Sweep on every call site; the cap above keeps it cheap.
export function maybeSweepRateLimitStore(): void {
    sweep();
}
