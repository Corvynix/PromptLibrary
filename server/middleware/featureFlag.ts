import type { RequestHandler } from "express";
import { getFeatureFlag } from "../services/featureFlags";

export function requireFeatureFlag(key: string): RequestHandler {
  return async (_req, res, next) => {
    try {
      if (!(await getFeatureFlag(key))) return res.status(404).json({ error: "This feature is unavailable" });
      next();
    } catch (error) {
      next(error);
    }
  };
}
