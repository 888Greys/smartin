interface RateLimitBucket {
    count: number;
    resetAt: number;
}

interface RateLimitResult {
    allowed: boolean;
    retryAfterMs: number;
}

class InMemoryRateLimiter {
    private buckets = new Map<string, RateLimitBucket>();

    check(key: string, limit: number, windowMs: number): RateLimitResult {
        const now = Date.now();
        const existing = this.buckets.get(key);

        if (!existing || now >= existing.resetAt) {
            this.buckets.set(key, { count: 1, resetAt: now + windowMs });
            this.cleanup(now);
            return { allowed: true, retryAfterMs: 0 };
        }

        if (existing.count >= limit) {
            return { allowed: false, retryAfterMs: Math.max(0, existing.resetAt - now) };
        }

        existing.count += 1;
        return { allowed: true, retryAfterMs: 0 };
    }

    private cleanup(now: number): void {
        if (this.buckets.size < 5000) {
            return;
        }

        for (const [key, bucket] of this.buckets) {
            if (now >= bucket.resetAt) {
                this.buckets.delete(key);
            }
        }
    }
}

function resolveClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0]?.trim() || "unknown";
    }

    return request.headers.get("x-real-ip") || "unknown";
}

export function createRateLimitKey(prefix: string, request: Request, subject?: string): string {
    const ip = resolveClientIp(request);
    const normalizedSubject = subject?.toLowerCase().trim() || "anonymous";
    return `${prefix}:${normalizedSubject}:${ip}`;
}

export const rateLimiter = new InMemoryRateLimiter();
