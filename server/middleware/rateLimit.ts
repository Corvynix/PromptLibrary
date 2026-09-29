import type { Request, Response, NextFunction } from "express";

const store = new Map<string, { count: number; resetAt: number }>();
let requests = 0;

export function rateLimit(
  maxRequests: number,
  windowMs: number,
  keyFn?: (req: Request) => string
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyFn ? keyFn(req) : req.ip || "unknown";
    const now = Date.now();
    // ponytail: in-memory limits are per process; move to shared storage if multiple instances need a common quota.
    if (++requests % 256 === 0) {
      store.forEach((entry, entryKey) => { if (entry.resetAt < now) store.delete(entryKey); });
    }

    const entry = store.get(key);
    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count++;
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ error: "Too many requests. Try again later." });
    }

    next();
  };
}

// Pre-configured limiters
export const authRateLimit = rateLimit(10, 60_000);
export const writeRateLimit = rateLimit(30, 60_000);
export const postRateLimit = rateLimit(5, 60_000);
