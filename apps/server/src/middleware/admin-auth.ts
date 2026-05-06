import type { Request, Response, NextFunction } from "express";
import { getServerEnv } from "../config/env";

/**
 * Simple admin authentication middleware
 * Uses ADMIN_API_KEY environment variable
 * In production, this should be replaced with a proper auth system (JWT, session, etc.)
 */
export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const env = getServerEnv();
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    // If no admin key is configured, allow in development mode
    if (env.NODE_ENV === "development") {
      return next();
    }
    return res.status(500).json({ error: "Admin authentication not configured" });
  }

  const authHeader = req.headers["authorization"];
  const expected = `Bearer ${adminApiKey}`;

  if (!authHeader || authHeader !== expected) {
    return res.status(401).json({ error: "Unauthorized. Admin access required." });
  }

  next();
}
