# PromptLibrary - The World's Largest AI Prompt Community

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Node](https://img.shields.io/badge/Node-20+-green)

**PromptLibrary** is a production-ready, community-driven social platform for discovering, sharing, and remixing high-quality AI prompts. Think of it as "GitHub meets Instagram" for prompt engineering.

## ✨ Features

- 🎯 **PQAS Quality Scoring**: Automatic assessment across 6 dimensions (Clarity, Specificity, Effectiveness, Consistency, Safety, Efficiency)
- 🔄 **Visual Remix System**: Fork prompts and visualize lineage with interactive graphs
- 👥 **Social Features**: Follow creators, upvote prompts, earn karma, unlock badges
- 🏆 **Reputation System**: Transparent karma algorithm with public weights
- 📊 **Feed Algorithms**: Trending, New, and Editor's Choice
- 🎨 **Premium UI/UX**: Glassmorphism, smooth animations, responsive design
- 🔒 **Enterprise Security**: Rate limiting, input sanitization, helmet.js
- 📈 **Monitoring**: Structured logging (Pino), error tracking (Sentry), metrics (Prometheus)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or Supabase account)
- Redis (optional, for caching)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/promptlibrary.git
cd promptlibrary

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:5000` to see the app.

## 📁 Project Structure

```
PromptLibrary/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   └── main.tsx       # Entry point
│   └── index.html
├── server/                 # Express backend
│   ├── middleware/        # Security, logging, monitoring
│   ├── services/          # Business logic (PQAS, karma, badges)
│   ├── __tests__/         # Integration tests
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   ├── db.ts              # Database connection
│   └── app.ts             # Express app setup
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle ORM schema
├── docs/                   # Documentation
├── e2e/                    # End-to-end tests
└── package.json
```

## 🔧 Tech Stack

**Frontend**:
- React 18 + TypeScript
- Tailwind CSS (custom design system)
- Framer Motion (animations)
- TanStack Query (data fetching)
- React Hook Form + Zod (validation)

**Backend**:
- Node.js + Express + TypeScript
- PostgreSQL (Drizzle ORM)
- JWT Authentication + bcrypt
- Redis (caching)

**DevOps**:
- Vite (build tool)
- Vitest (testing)
- Pino (logging)
- Sentry (error tracking)
- Prometheus (metrics)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📦 Building for Production

```bash
# Build client and server
npm run build

# Start production server
npm start
```

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/promptlib

# Security (REQUIRED in production)
SESSION_SECRET=your-super-secret-jwt-key-here

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Sentry (optional)
SENTRY_DSN=https://your-sentry-dsn

# CORS (optional)
ALLOWED_ORIGINS=http://localhost:5000,https://yourdomain.com

# Logging
LOG_LEVEL=info
```

## 🚢 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

### Docker

```bash
# Build image
docker build -t promptlibrary .

# Run container
docker run -p 5000:5000 --env-file .env promptlibrary
```

## 📊 API Documentation

See [docs/API.md](docs/API.md) for complete API reference.

### Quick Examples

**Register a user**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
```

**Create a prompt**:
```bash
curl -X POST http://localhost:5000/api/prompts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Code Review Assistant",
    "shortDesc": "AI assistant for code reviews",
    "type": "text",
    "industryTags": ["engineering"],
    "content": "You are a code review expert..."
  }'
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Replit](https://replit.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

## 📞 Support

- 📧 Email: support@promptlibrary.com
- 💬 Discord: [Join our community](https://discord.gg/promptlib)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/promptlibrary/issues)

---

**Made with ❤️ by the PromptLibrary Team**
