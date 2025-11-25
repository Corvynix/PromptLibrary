/**
 * Database seeding script
 * Seeds initial badges and creates a super admin user
 */

import { db } from "./db";
import { users, badges, adminSettings } from "@shared/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { seedBadges } from "./services/badges";

async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    // 1. Seed badges
    console.log("Seeding badges...");
    await seedBadges();
    
    // 2. Create super admin user if it doesn't exist
    console.log("Checking for super admin user...");
    const existingAdmin = await db
      .select()
      .from(users)
      .where(sql`roles @> '["super_admin"]'::jsonb`)
      .limit(1);
    
    if (existingAdmin.length === 0) {
      console.log("Creating super admin user...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await db.insert(users).values({
        email: "admin@promptlibrary.com",
        password: hashedPassword,
        displayName: "Super Admin",
        roles: sql`'["super_admin"]'::jsonb`,
        karmaScore: 1000,
        metrics: {},
      });
      
      console.log("Super admin created: admin@promptlibrary.com / admin123");
    } else {
      console.log("Super admin user already exists");
    }
    
    // 3. Seed admin settings
    console.log("Seeding admin settings...");
    const settingsToSeed = [
      {
        key: "pqas_thresholds",
        value: {
          auto_approve: 75,
          production_promotion: 85,
          flag_for_review: 50,
          auto_reject: 30,
        }
      },
      {
        key: "platform_stats",
        value: {
          total_prompts: 0,
          total_users: 0,
          total_uses: 0,
          avg_quality_score: 0,
        }
      }
    ];
    
    for (const setting of settingsToSeed) {
      await db.insert(adminSettings)
        .values(setting)
        .onConflictDoUpdate({
          target: [adminSettings.key],
          set: { value: setting.value, updatedAt: new Date() }
        });
    }
    
    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
