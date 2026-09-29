const secret = process.env.SESSION_SECRET;

if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
  throw new Error("SESSION_SECRET must contain at least 32 characters in production");
}

export const jwtSecret = secret || "development-only-secret-change-before-production";
