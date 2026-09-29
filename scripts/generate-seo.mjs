import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const configured = process.env.SITE_URL;
if (!configured) {
  if (process.env.NODE_ENV === "production") throw new Error("SITE_URL is required for a production build");
  process.exit(0);
}

const site = new URL(configured);
if (site.protocol !== "https:" && process.env.NODE_ENV === "production") {
  throw new Error("SITE_URL must use HTTPS in production");
}
const base = site.origin;
const routes = ["/", "/diagnose", "/privacy", "/terms", "/refund", "/guidelines"];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${base}${route}</loc></url>`).join("")}</urlset>\n`;
const publicDir = resolve("dist/public");
await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(resolve(publicDir, "sitemap.xml"), sitemap),
  writeFile(resolve(publicDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nDisallow: /onboarding\nDisallow: /payment\nDisallow: /projects\nDisallow: /sprint\nDisallow: /community\nDisallow: /radar\nDisallow: /vault\nDisallow: /api\nSitemap: ${base}/sitemap.xml\n`),
]);
