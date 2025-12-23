/**
 * Client-side Rate Limiter
 * Prevents abuse of API calls and improves UX
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const limits: Map<string, RateLimitEntry> = new Map();

// Configuration for different action types
const RATE_LIMITS = {
    // Auth actions - strict limits
    login: { maxAttempts: 5, windowMs: 60 * 1000 },        // 5 attempts per minute
    register: { maxAttempts: 3, windowMs: 60 * 1000 },     // 3 attempts per minute
    passwordReset: { maxAttempts: 3, windowMs: 5 * 60 * 1000 }, // 3 per 5 minutes

    // Social actions - moderate limits
    follow: { maxAttempts: 30, windowMs: 60 * 1000 },      // 30 per minute
    like: { maxAttempts: 60, windowMs: 60 * 1000 },        // 60 per minute
    comment: { maxAttempts: 20, windowMs: 60 * 1000 },     // 20 per minute
    post: { maxAttempts: 10, windowMs: 60 * 1000 },        // 10 per minute

    // Match actions
    joinMatch: { maxAttempts: 10, windowMs: 60 * 1000 },   // 10 per minute
    createMatch: { maxAttempts: 5, windowMs: 60 * 1000 },  // 5 per minute
    invite: { maxAttempts: 20, windowMs: 60 * 1000 },      // 20 per minute

    // Booking actions
    createBooking: { maxAttempts: 5, windowMs: 60 * 1000 }, // 5 per minute
    cancelBooking: { maxAttempts: 5, windowMs: 60 * 1000 }, // 5 per minute

    // Search - generous but limited
    search: { maxAttempts: 30, windowMs: 60 * 1000 },      // 30 per minute

    // Profile updates
    updateProfile: { maxAttempts: 10, windowMs: 60 * 1000 }, // 10 per minute
    uploadImage: { maxAttempts: 10, windowMs: 60 * 1000 },   // 10 per minute

    // Default for unspecified actions
    default: { maxAttempts: 60, windowMs: 60 * 1000 },     // 60 per minute
} as const;

type RateLimitAction = keyof typeof RATE_LIMITS;

/**
 * Check if an action is rate limited
 * @param action - The action type being performed
 * @param identifier - Optional unique identifier (e.g., user ID)
 * @returns Object with allowed status and retry info
 */
export function checkRateLimit(
    action: RateLimitAction,
    identifier: string = 'anonymous'
): { allowed: boolean; retryAfterMs?: number; remaining?: number } {
    const config = RATE_LIMITS[action] || RATE_LIMITS.default;
    const key = `${action}:${identifier}`;
    const now = Date.now();

    const entry = limits.get(key);

    // No previous entry or window expired - allow and start fresh
    if (!entry || now >= entry.resetTime) {
        limits.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        });
        return { allowed: true, remaining: config.maxAttempts - 1 };
    }

    // Within window - check count
    if (entry.count >= config.maxAttempts) {
        return {
            allowed: false,
            retryAfterMs: entry.resetTime - now,
            remaining: 0,
        };
    }

    // Increment and allow
    entry.count++;
    limits.set(key, entry);

    return {
        allowed: true,
        remaining: config.maxAttempts - entry.count,
    };
}

/**
 * Reset rate limit for a specific action/identifier
 */
export function resetRateLimit(action: RateLimitAction, identifier: string = 'anonymous'): void {
    const key = `${action}:${identifier}`;
    limits.delete(key);
}

/**
 * Clear all rate limits (useful for testing or logout)
 */
export function clearAllRateLimits(): void {
    limits.clear();
}

/**
 * Decorator/wrapper for rate-limited async functions
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
    action: RateLimitAction,
    fn: T,
    getIdentifier?: (...args: Parameters<T>) => string
): T {
    return (async (...args: Parameters<T>) => {
        const identifier = getIdentifier?.(...args) || 'anonymous';
        const check = checkRateLimit(action, identifier);

        if (!check.allowed) {
            const retrySeconds = Math.ceil((check.retryAfterMs || 0) / 1000);
            throw new Error(
                `Muitas tentativas. Tente novamente em ${retrySeconds} segundos.`
            );
        }

        return fn(...args);
    }) as T;
}

/**
 * Debounce utility for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delayMs: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delayMs);
    };
}

/**
 * Throttle utility for scroll/resize handlers
 */
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limitMs: number
): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= limitMs) {
            lastCall = now;
            fn(...args);
        }
    };
}
