import { type Server } from "node:http";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { pool } from "./db";
import { registerRoutes } from "./routes";

export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  console.log(`${time} [${source}] ${message}`);
}

export const app = express();
const proxyHops = process.env.TRUST_PROXY_HOPS;
if (proxyHops && /^\d+$/.test(proxyHops)) app.set("trust proxy", Number(proxyHops));

app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  if (process.env.NODE_ENV === "production") res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) log(`${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`);
  });
  next();
});

export default async function runApp(setup: (app: Express, server: Server) => Promise<void>) {
  const server = await registerRoutes(app);
  app.get("/health", async (_req, res) => {
    try {
      await pool.query("SELECT 1");
      return res.json({ status: "ok" });
    } catch {
      return res.status(503).json({ status: "unavailable" });
    }
  });
  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

  await setup(app, server);
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const candidate = err as { status?: unknown; statusCode?: unknown };
    const rawStatus = Number(candidate?.status ?? candidate?.statusCode);
    const status = Number.isInteger(rawStatus) && rawStatus >= 400 && rawStatus < 600 ? rawStatus : 500;
    if (status >= 500) console.error("Unhandled request error", err);
    return res.status(status).json({ error: status < 500 ? "Invalid request" : "Internal server error" });
  });

  const port = Number.parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => log(`serving on port ${port}`));
}
