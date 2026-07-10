// Database storage layer - from javascript_database blueprint
import {
  users,
  applications,
  type User,
  type InsertUser,
  type Application,
  type InsertApplication,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, sql, like, ilike, inArray } from "drizzle-orm";

// Comprehensive storage interface for all database operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getGlobalStats(): Promise<any>;

  // Application operations
  createApplication(app: InsertApplication): Promise<Application>;
}

export class DatabaseStorage implements IStorage {
  private applications: Application[] = [];

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getGlobalStats(): Promise<any> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);

    return {
      totalUsers: Number(userCount?.count || 0),
    };
  }

  async createApplication(app: InsertApplication): Promise<Application> {
    const row: Application = { ...app, id: crypto.randomUUID() as any, createdAt: new Date() };
    this.applications.push(row);
    return row;
  }
}

export const storage = new DatabaseStorage();
