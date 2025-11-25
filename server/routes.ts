import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { insertUserSchema, insertPromptSchema, insertPromptVersionSchema, insertCommentSchema, insertWorkflowSchema, insertNotificationSchema } from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";

// Auth middleware
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    roles: string[];
  };
}

function authenticate(req: AuthRequest, res: Response, next: Function) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: Function) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const hasRole = roles.some(role => req.user!.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============ AUTH ROUTES ============
  
  // Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });
      
      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, roles: user.roles },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { id: user.id, email: user.email, roles: user.roles },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({ user: { ...user, password: undefined }, token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get current user
  app.get("/api/auth/me", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ============ USER ROUTES ============
  
  // Get user by ID
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update user profile
  app.patch("/api/users/:id", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (req.user!.id !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const updates = req.body;
      delete updates.password; // Don't allow password updates here
      delete updates.roles; // Don't allow role updates
      delete updates.karmaScore;
      
      const user = await storage.updateUser(userId, updates);
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ============ PROMPT ROUTES ============
  
  // Create prompt
  app.post("/api/prompts", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const data = insertPromptSchema.parse({
        ...req.body,
        ownerId: req.user!.id,
        slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      });
      
      const prompt = await storage.createPrompt(data);
      
      // Create initial version
      if (req.body.content) {
        await storage.createPromptVersion({
          promptId: prompt.id,
          versionNumber: 1,
          content: req.body.content,
          modelCompatibility: req.body.modelCompatibility || [],
          createdBy: req.user!.id,
          status: 'draft',
        });
      }
      
      res.json(prompt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Get prompts (with filters)
  app.get("/api/prompts", async (req: Request, res: Response) => {
    try {
      const filters = {
        ownerId: req.query.ownerId ? parseInt(req.query.ownerId as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };
      
      const prompts = await storage.getPrompts(filters);
      res.json(prompts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get prompt by slug
  app.get("/api/prompts/slug/:slug", async (req: Request, res: Response) => {
    try {
      const prompt = await storage.getPromptBySlug(req.params.slug);
      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get prompt by ID
  app.get("/api/prompts/:id", async (req: Request, res: Response) => {
    try {
      const prompt = await storage.getPrompt(parseInt(req.params.id));
      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Search prompts
  app.get("/api/prompts/search/:query", async (req: Request, res: Response) => {
    try {
      const prompts = await storage.searchPrompts(req.params.query, {
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      });
      res.json(prompts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update prompt
  app.patch("/api/prompts/:id", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const promptId = parseInt(req.params.id);
      const prompt = await storage.getPrompt(promptId);
      
      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }
      
      if (prompt.ownerId !== req.user!.id && !req.user!.roles.includes('curator')) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const updated = await storage.updatePrompt(promptId, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ============ PROMPT VERSION ROUTES ============
  
  // Get versions for a prompt
  app.get("/api/prompts/:id/versions", async (req: Request, res: Response) => {
    try {
      const versions = await storage.getPromptVersions(parseInt(req.params.id));
      res.json(versions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Create new version (fork/remix)
  app.post("/api/prompts/:id/versions", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const promptId = parseInt(req.params.id);
      const data = insertPromptVersionSchema.parse({
        ...req.body,
        promptId,
        createdBy: req.user!.id,
      });
      
      const version = await storage.createPromptVersion(data);
      res.json(version);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // ============ COMMENT ROUTES ============
  
  // Get comments for a prompt
  app.get("/api/prompts/:id/comments", async (req: Request, res: Response) => {
    try {
      const comments = await storage.getComments(parseInt(req.params.id));
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Create comment
  app.post("/api/comments", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const data = insertCommentSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      const comment = await storage.createComment(data);
      
      // Send notification to prompt owner
      const prompt = await storage.getPrompt(data.promptId);
      if (prompt && prompt.ownerId !== req.user!.id) {
        await storage.createNotification({
          userId: prompt.ownerId,
          type: 'comment_on_prompt',
          title: 'New comment on your prompt',
          message: `${req.user!.email} commented on your prompt`,
          link: `/prompts/${data.promptId}`,
        });
      }
      
      res.json(comment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // ============ SOCIAL ROUTES ============
  
  // Follow user
  app.post("/api/users/:id/follow", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const followingId = parseInt(req.params.id);
      await storage.followUser(req.user!.id, followingId);
      
      // Send notification
      await storage.createNotification({
        userId: followingId,
        type: 'follower_new',
        title: 'New follower',
        message: `${req.user!.email} started following you`,
        link: `/users/${req.user!.id}`,
      });
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Unfollow user
  app.post("/api/users/:id/unfollow", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      await storage.unfollowUser(req.user!.id, parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Check if following
  app.get("/api/users/:id/is-following", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const isFollowing = await storage.isFollowing(req.user!.id, parseInt(req.params.id));
      res.json({ isFollowing });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get follower/following counts
  app.get("/api/users/:id/follow-stats", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const followers = await storage.getFollowers(userId);
      const following = await storage.getFollowing(userId);
      res.json({ followers, following });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ============ VOTE ROUTES ============
  
  // Vote on prompt or comment
  app.post("/api/vote", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { votableType, votableId, voteType } = req.body;
      await storage.vote(req.user!.id, votableType, votableId, voteType);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Remove vote
  app.delete("/api/vote", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { votableType, votableId } = req.body;
      await storage.unvote(req.user!.id, votableType, votableId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get user's vote
  app.get("/api/vote", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { votableType, votableId } = req.query as any;
      const vote = await storage.getVote(req.user!.id, votableType, parseInt(votableId));
      res.json({ vote });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ============ WORKFLOW ROUTES ============
  
  // Create workflow
  app.post("/api/workflows", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const data = insertWorkflowSchema.parse({
        ...req.body,
        createdBy: req.user!.id,
      });
      
      const workflow = await storage.createWorkflow(data);
      res.json(workflow);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Get workflows
  app.get("/api/workflows", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const workflows = await storage.getWorkflows(userId);
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get workflow by ID
  app.get("/api/workflows/:id", async (req: Request, res: Response) => {
    try {
      const workflow = await storage.getWorkflow(parseInt(req.params.id));
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      res.json(workflow);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ============ NOTIFICATION ROUTES ============
  
  // Get user notifications
  app.get("/api/notifications", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const unreadOnly = req.query.unreadOnly === 'true';
      const notifications = await storage.getNotifications(req.user!.id, unreadOnly);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Mark notification as read
  app.patch("/api/notifications/:id/read", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      await storage.markNotificationRead(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Mark all notifications as read
  app.patch("/api/notifications/read-all", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      await storage.markAllNotificationsRead(req.user!.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ============ BADGE ROUTES ============
  
  // Get all badges
  app.get("/api/badges", async (req: Request, res: Response) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get user badges
  app.get("/api/users/:id/badges", async (req: Request, res: Response) => {
    try {
      const badges = await storage.getUserBadges(parseInt(req.params.id));
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // ============ USAGE LOG ROUTES ============
  
  // Log usage
  app.post("/api/usage", async (req: Request, res: Response) => {
    try {
      const { userId, promptVersionId, action, metadata } = req.body;
      await storage.logUsage(userId, promptVersionId, action, metadata);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
