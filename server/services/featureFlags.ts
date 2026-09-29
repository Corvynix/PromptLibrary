import { db } from "../db";
import { featureFlags, siteSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

const flagCache: Map<string, { value: boolean; expiresAt: number }> = new Map();
const settingCache: Map<string, { value: string; expiresAt: number }> = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const defaults: Record<string, boolean> = {
  ENABLE_COMMUNITY: true,
  ENABLE_MEMBERSHIP: true,
  ENABLE_AI_OPERATOR: false,
  ENABLE_RADAR: true,
  ENABLE_VAULT: true,
  ENABLE_PUBLIC_PROJECTS: true,
  ENABLE_MANUAL_PAYMENTS: true,
};

export async function getFeatureFlag(key: string): Promise<boolean> {
  const cached = flagCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  try {
    const flagKey = key.startsWith("ENABLE_") ? key : `ENABLE_${key.toUpperCase()}`;
    const rows = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.key, flagKey));
    const envValue = process.env[flagKey];
    const value = rows[0]?.value ?? (envValue === undefined ? defaults[flagKey] ?? false : envValue === "true");
    flagCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch {
    // Fallback to env var if DB not available
    const flagKey = key.startsWith("ENABLE_") ? key : `ENABLE_${key.toUpperCase()}`;
    const envValue = process.env[flagKey];
    return envValue === undefined ? defaults[flagKey] ?? false : envValue === "true";
  }
}

export async function getSiteSetting(key: string, defaultValue = ""): Promise<string> {
  const cached = settingCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key));
    const value = rows.length > 0 ? rows[0].value : defaultValue;
    settingCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  } catch {
    return defaultValue;
  }
}

export function clearCache() {
  flagCache.clear();
  settingCache.clear();
}
