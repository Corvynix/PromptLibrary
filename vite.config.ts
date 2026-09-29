import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ mode }) => {
  const configuredSiteUrl = loadEnv(mode, process.cwd(), "").SITE_URL;
  if (mode === "production" && !configuredSiteUrl) throw new Error("SITE_URL is required for a production build");
  const parsedSiteUrl = configuredSiteUrl ? new URL(configuredSiteUrl) : null;
  if (mode === "production" && parsedSiteUrl?.protocol !== "https:") throw new Error("SITE_URL must use HTTPS in production");
  const siteUrl = parsedSiteUrl?.origin;
  const canonical = siteUrl
    ? `<link rel="canonical" href="${siteUrl}/" /><meta property="og:url" content="${siteUrl}/" /><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "أول بيعة", url: `${siteUrl}/`, inLanguage: "ar" })}</script>`
    : "";
  return {
  plugins: [
    react(),
    runtimeErrorOverlay(),
    { name: "site-url-metadata", transformIndexHtml: (html: string) => html.replace("<!-- site-url-meta -->", canonical) },
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  };
});
