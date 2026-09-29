import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "@shared/schema";
import { jwtSecret } from "../config";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    roles: string[];
  };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: number;
    };
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);
    if (!user || user.isBanned) {
      return res.status(401).json({ error: "Authentication required" });
    }
    let roles: string[] = ["user"];
    try {
      const parsed: unknown = JSON.parse(user.roles);
      if (Array.isArray(parsed) && parsed.every((role) => typeof role === "string")) roles = parsed;
    } catch {
      // Invalid stored roles receive the least-privileged role.
    }
    req.user = { id: user.id, email: user.email, roles };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        id: number;
        email: string;
        roles: string[];
      };
      req.user = decoded;
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const hasRole = roles.some((role) => req.user!.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}
