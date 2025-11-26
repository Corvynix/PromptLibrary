import "./env-loader";
import { db } from "./db";
import { users, prompts, promptVersions } from "@shared/schema";
import bcrypt from "bcrypt";

async function seedPrompts() {
    console.log("🌱 Seeding prompts...");

    try {
        // 1. Create Users
        const hashedPassword = await bcrypt.hash("password123", 10);

        const creators = await db.insert(users).values([
            {
                email: "wizard@example.com",
                password: hashedPassword,
                displayName: "prompt_wizard",
                avatarUrl: "https://github.com/shadcn.png",
                roles: ["user", "curator"],
                karmaScore: 15420
            },
            {
                email: "master@example.com",
                password: hashedPassword,
                displayName: "AI_Master",
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                roles: ["user"],
                karmaScore: 8500
            },
            {
                email: "neon@example.com",
                password: hashedPassword,
                displayName: "NeonCreator",
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
                roles: ["user"],
                karmaScore: 12000
            }
        ]).returning();

        console.log(`✅ Created ${creators.length} creators`);

        // 2. Create Prompts
        const promptData = [
            {
                title: "Cinematic Portrait Generator v6",
                shortDesc: "Create stunning, hyper-realistic portraits with cinematic lighting and depth of field. Optimized for Midjourney v6.",
                industryTags: ["Photography", "Portrait", "Cinematic"],
                ownerId: creators[0].id,
                popularityScore: 98.5,
                totalUses: 1250
            },
            {
                title: "Neon Cyberpunk Cityscapes",
                shortDesc: "Generate futuristic night city scenes with neon lights, rain reflections, and flying cars.",
                industryTags: ["Sci-Fi", "Environment", "Concept Art"],
                ownerId: creators[2].id,
                popularityScore: 95.2,
                totalUses: 890
            },
            {
                title: "Minimalist Logo Designer",
                shortDesc: "Create clean, vector-style logos for tech startups. Focus on geometric shapes and negative space.",
                industryTags: ["Design", "Logo", "Branding"],
                ownerId: creators[1].id,
                popularityScore: 92.0,
                totalUses: 2100
            },
            {
                title: "Fantasy RPG Character Sheet",
                shortDesc: "Generate detailed D&D character portraits with inventory and stats layout.",
                industryTags: ["Gaming", "Fantasy", "RPG"],
                ownerId: creators[0].id,
                popularityScore: 97.8,
                totalUses: 3400
            },
            {
                title: "Isometric 3D Icons",
                shortDesc: "Cute 3D isometric icons for web design and presentations. Claymorphism style.",
                industryTags: ["3D", "Icons", "Web Design"],
                ownerId: creators[2].id,
                popularityScore: 89.5,
                totalUses: 560
            },
            {
                title: "Abstract Oil Painting",
                shortDesc: "Thick impasto style oil paintings suitable for wall art and backgrounds.",
                industryTags: ["Art", "Painting", "Abstract"],
                ownerId: creators[1].id,
                popularityScore: 88.0,
                totalUses: 320
            },
            {
                title: "Product Photography Studio",
                shortDesc: "Professional product shots with softbox lighting and infinite white background.",
                industryTags: ["Marketing", "Product", "Photography"],
                ownerId: creators[0].id,
                popularityScore: 94.5,
                totalUses: 1500
            },
            {
                title: "Anime Style Character v4",
                shortDesc: "High quality anime characters with cel shading and dynamic poses.",
                industryTags: ["Anime", "Character", "Illustration"],
                ownerId: creators[2].id,
                popularityScore: 96.0,
                totalUses: 4200
            },
            {
                title: "Architectural Visualization",
                shortDesc: "Photorealistic modern house exteriors with landscaping and natural lighting.",
                industryTags: ["Architecture", "Real Estate", "3D"],
                ownerId: creators[1].id,
                popularityScore: 91.2,
                totalUses: 780
            },
            {
                title: "Pixel Art Sprite Sheet",
                shortDesc: "Game-ready pixel art sprites for 2D platformers. Includes walk cycle.",
                industryTags: ["Game Dev", "Pixel Art", "Retro"],
                ownerId: creators[2].id,
                popularityScore: 93.5,
                totalUses: 1100
            },
            {
                title: "UX/UI Mobile App Mockup",
                shortDesc: "Modern mobile app interface designs with glassmorphism elements.",
                industryTags: ["UI/UX", "Mobile", "Design"],
                ownerId: creators[0].id,
                popularityScore: 90.0,
                totalUses: 950
            },
            {
                title: "Vintage Travel Poster",
                shortDesc: "Art deco style travel posters for fictional locations.",
                industryTags: ["Vintage", "Poster", "Illustration"],
                ownerId: creators[1].id,
                popularityScore: 87.5,
                totalUses: 450
            }
        ];

        for (const p of promptData) {
            const [prompt] = await db.insert(prompts).values({
                slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                title: p.title,
                shortDesc: p.shortDesc,
                industryTags: p.industryTags,
                ownerId: p.ownerId,
                popularityScore: p.popularityScore,
                totalUses: p.totalUses,
                type: 'image',
                visibility: 'public',
                license: 'MIT'
            }).returning();

            // Create initial version
            await db.insert(promptVersions).values({
                promptId: prompt.id,
                versionNumber: 1,
                content: {
                    system: "You are an AI art generator.",
                    user: p.shortDesc
                },
                modelCompatibility: ["Midjourney v6", "DALL-E 3"],
                createdBy: p.ownerId,
                status: 'production'
            });
        }

        console.log(`✅ Created ${promptData.length} prompts`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding prompts:", error);
        process.exit(1);
    }
}

seedPrompts();
