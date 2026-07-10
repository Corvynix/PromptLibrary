import { db } from "./db";
import { users } from "@shared/schema";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    const existingAdmin = await db
      .select()
      .from(users)
      .where(sql`roles @> '["super_admin"]'::jsonb`)
      .limit(1);

    if (existingAdmin.length === 0) {
      console.log("Creating super admin user...");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await db.insert(users).values({
        email: "admin@koriq.education",
        password: hashedPassword,
        displayName: "Super Admin",
        roles: sql`'["super_admin"]'::jsonb`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("Super admin created: admin@koriq.education / admin123");
    } else {
      console.log("Super admin user already exists");
    }

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
