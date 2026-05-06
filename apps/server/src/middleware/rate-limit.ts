import type { NextFunction, Request, Response } from "express";

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

type Bucket = {
  count: number;
  resetAt: number;
};

const bucketStore = new Map<string, Bucket>();

function getKey(req: Request) {
  return req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
}

export function rateLimit(options: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.method}:${req.path}:${getKey(req)}`;
    const now = Date.now();
    const existing = bucketStore.get(key);

    if (!existing || existing.resetAt <= now) {
      bucketStore.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });

      return next();
    }

    if (existing.count >= options.maxRequests) {
      res.setHeader("Retry-After", Math.ceil((existing.resetAt - now) / 1000));
      return res.status(429).json({
        error: options.message ?? "Too many requests",
      });
    }

    existing.count += 1;
    return next();
  };
}

export function resetRateLimitStore() {
  bucketStore.clear();
}
