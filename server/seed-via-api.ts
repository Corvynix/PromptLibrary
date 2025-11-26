
const API_URL = "http://localhost:5001/api";

async function seedViaApi() {
    console.log("🌱 Seeding via API...");

    try {
        // 1. Create Users
        const users = [
            { email: "wizard@example.com", password: "password123", displayName: "prompt_wizard" },
            { email: "master@example.com", password: "password123", displayName: "AI_Master" },
            { email: "neon@example.com", password: "password123", displayName: "NeonCreator" }
        ];

        const tokens = [];

        for (const u of users) {
            console.log(`Creating user ${u.displayName}...`);
            let res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(u)
            });

            if (res.status === 400) {
                // User might exist, try login
                console.log(`User ${u.displayName} exists, logging in...`);
                res = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: u.email, password: u.password })
                });
            }

            const data = await res.json();
            if (data.token) {
                tokens.push(data.token);
            } else {
                console.error(`Failed to auth user ${u.displayName}:`, data);
            }
        }

        if (tokens.length === 0) {
            throw new Error("No tokens obtained");
        }

        // 2. Create Prompts
        const prompts = [
            {
                title: "Cinematic Portrait Generator v6",
                shortDesc: "Create stunning, hyper-realistic portraits with cinematic lighting and depth of field. Optimized for Midjourney v6.",
                industryTags: ["Photography", "Portrait", "Cinematic"],
                tokenIndex: 0
            },
            {
                title: "Neon Cyberpunk Cityscapes",
                shortDesc: "Generate futuristic night city scenes with neon lights, rain reflections, and flying cars.",
                industryTags: ["Sci-Fi", "Environment", "Concept Art"],
                tokenIndex: 2
            },
            {
                title: "Minimalist Logo Designer",
                shortDesc: "Create clean, vector-style logos for tech startups. Focus on geometric shapes and negative space.",
                industryTags: ["Design", "Logo", "Branding"],
                tokenIndex: 1
            },
            {
                title: "Fantasy RPG Character Sheet",
                shortDesc: "Generate detailed D&D character portraits with inventory and stats layout.",
                industryTags: ["Gaming", "Fantasy", "RPG"],
                tokenIndex: 0
            },
            {
                title: "Isometric 3D Icons",
                shortDesc: "Cute 3D isometric icons for web design and presentations. Claymorphism style.",
                industryTags: ["3D", "Icons", "Web Design"],
                tokenIndex: 2
            },
            {
                title: "Abstract Oil Painting",
                shortDesc: "Thick impasto style oil paintings suitable for wall art and backgrounds.",
                industryTags: ["Art", "Painting", "Abstract"],
                tokenIndex: 1
            },
            {
                title: "Product Photography Studio",
                shortDesc: "Professional product shots with softbox lighting and infinite white background.",
                industryTags: ["Marketing", "Product", "Photography"],
                tokenIndex: 0
            },
            {
                title: "Anime Style Character v4",
                shortDesc: "High quality anime characters with cel shading and dynamic poses.",
                industryTags: ["Anime", "Character", "Illustration"],
                tokenIndex: 2
            },
            {
                title: "Architectural Visualization",
                shortDesc: "Photorealistic modern house exteriors with landscaping and natural lighting.",
                industryTags: ["Architecture", "Real Estate", "3D"],
                tokenIndex: 1
            },
            {
                title: "Pixel Art Sprite Sheet",
                shortDesc: "Game-ready pixel art sprites for 2D platformers. Includes walk cycle.",
                industryTags: ["Game Dev", "Pixel Art", "Retro"],
                tokenIndex: 2
            },
            {
                title: "UX/UI Mobile App Mockup",
                shortDesc: "Modern mobile app interface designs with glassmorphism elements.",
                industryTags: ["UI/UX", "Mobile", "Design"],
                tokenIndex: 0
            },
            {
                title: "Vintage Travel Poster",
                shortDesc: "Art deco style travel posters for fictional locations.",
                industryTags: ["Vintage", "Poster", "Illustration"],
                tokenIndex: 1
            }
        ];

        for (const p of prompts) {
            console.log(`Creating prompt: ${p.title}`);
            const res = await fetch(`${API_URL}/prompts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens[p.tokenIndex]}`
                },
                body: JSON.stringify({
                    title: p.title,
                    shortDesc: p.shortDesc,
                    industryTags: p.industryTags,
                    type: "image",
                    visibility: "public",
                    content: { system: "You are an AI.", user: p.shortDesc }
                })
            });

            if (!res.ok) {
                console.error(`Failed to create prompt ${p.title}:`, await res.text());
            }
        }

        console.log("✅ Seeding completed!");
    } catch (error) {
        console.error("❌ Error seeding:", error);
    }
}

seedViaApi();
