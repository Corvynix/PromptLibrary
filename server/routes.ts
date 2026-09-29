import type { Express } from "express";
import { createServer, type Server } from "http";

import authRoutes from "./routes/auth";
import projectsRoutes from "./routes/projects";
import sprintRoutes from "./routes/sprint";
import communityRoutes from "./routes/community";
import radarRoutes from "./routes/radar";
import reposRoutes from "./routes/repos";
import vaultRoutes from "./routes/vault";
import paymentsRoutes from "./routes/payments";
import diagnoseRoutes from "./routes/diagnose";
import adminRoutes from "./routes/admin";
import experimentsRoutes from "./routes/experiments";
import { requireFeatureFlag } from "./middleware/featureFlag";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all modular routes
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectsRoutes);
  app.use("/api/sprint", sprintRoutes);
  app.use("/api/community", requireFeatureFlag("COMMUNITY"), communityRoutes);
  app.use("/api/radar", requireFeatureFlag("RADAR"), radarRoutes);
  app.use("/api/repos", requireFeatureFlag("RADAR"), reposRoutes);
  app.use("/api/vault", requireFeatureFlag("VAULT"), vaultRoutes);
  app.use("/api/payments", paymentsRoutes);
  app.use("/api/diagnose", diagnoseRoutes);
  app.use("/api/experiments", experimentsRoutes);
  app.use("/api/admin", adminRoutes);

  // Return http server
  const httpServer = createServer(app);
  return httpServer;
}
