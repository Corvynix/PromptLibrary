# Deployment Guide

This guide covers deploying PromptLibrary to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. ✅ A PostgreSQL database (Supabase recommended)
2. ✅ Environment variables configured
3. ✅ Redis instance (optional, for caching)
4. ✅ Sentry account (optional, for error tracking)

---

## Environment Variables

### Required

```env
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

**Generate a secure SESSION_SECRET**:
```bash
openssl rand -base64 32
```

### Optional

```env
# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Sentry (for error tracking)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=info  # debug, info, warn, error

# Node Environment
NODE_ENV=production
```

---

## Deployment Platforms

### 1. Vercel (Recommended for Quick Deploy)

**Pros**: Zero-config, automatic HTTPS, global CDN  
**Cons**: Serverless (cold starts), limited WebSocket support

#### Steps:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `DATABASE_URL`, `SESSION_SECRET`, etc.

5. Redeploy:
```bash
vercel --prod
```

#### Vercel Configuration

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index-prod.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index-prod.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ]
}
```

---

### 2. Railway

**Pros**: Simple, supports PostgreSQL + Redis, no cold starts  
**Cons**: Paid after free tier

#### Steps:

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Initialize project:
```bash
railway init
```

4. Add PostgreSQL:
```bash
railway add postgresql
```

5. Add Redis (optional):
```bash
railway add redis
```

6. Set environment variables:
```bash
railway variables set SESSION_SECRET=your-secret-key
```

7. Deploy:
```bash
railway up
```

#### Railway Configuration

Create `railway.toml`:
```toml
[build]
builder = "nixpacks"
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"
restartPolicyType = "on-failure"
restartPolicyMaxRetries = 10
```

---

### 3. Replit

**Pros**: Built-in database, zero setup  
**Cons**: Limited resources on free tier

#### Steps:

1. Fork the Repl
2. Set Secrets (environment variables):
   - Click "Secrets" (lock icon)
   - Add `SESSION_SECRET`
3. Click "Run"

Replit automatically detects the build and start commands from `package.json`.

---

### 4. Docker

**Pros**: Portable, works anywhere  
**Cons**: Requires Docker knowledge

#### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 5000

# Start
CMD ["npm", "start"]
```

#### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/promptlib
      - SESSION_SECRET=your-secret-key
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=promptlib
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Deploy:
```bash
docker-compose up -d
```

---

## Database Setup

### Supabase (Recommended)

1. Create a project at [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Run migrations:
```bash
npm run db:push
```

### Self-Hosted PostgreSQL

1. Install PostgreSQL 14+
2. Create database:
```sql
CREATE DATABASE promptlib;
```
3. Set `DATABASE_URL`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/promptlib
```
4. Run migrations:
```bash
npm run db:push
```

---

## Post-Deployment Checklist

- [ ] Database migrations applied (`npm run db:push`)
- [ ] Environment variables set (especially `SESSION_SECRET`)
- [ ] Health check working (`/health`)
- [ ] Metrics endpoint accessible (`/metrics`)
- [ ] HTTPS enabled
- [ ] CORS configured for your domain
- [ ] Error tracking (Sentry) configured
- [ ] Backups enabled for database
- [ ] Monitoring alerts set up

---

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Use Nginx or cloud load balancer
2. **Multiple Instances**: Run 2+ app instances
3. **Session Storage**: Use Redis for shared sessions
4. **Database**: Use connection pooling (already configured)

### Caching Strategy

1. **Redis**: Cache feed endpoints (5 min TTL)
2. **CDN**: Serve static assets from CDN
3. **Database**: Add indexes for frequently queried fields

### Monitoring

1. **Sentry**: Error tracking and performance monitoring
2. **Prometheus + Grafana**: Metrics visualization
3. **Pino**: Structured logging (ship to Datadog/Loggly)

---

## Troubleshooting

### Build Fails

**Error**: `MODULE_NOT_FOUND`  
**Fix**: Run `npm install` and ensure all dependencies are installed

### Database Connection Fails

**Error**: `Connection refused`  
**Fix**: Check `DATABASE_URL` format and firewall rules

### Rate Limiting Too Aggressive

**Error**: `429 Too Many Requests`  
**Fix**: Adjust limits in `server/middleware/security.ts`

### High Memory Usage

**Fix**: 
- Enable Redis caching
- Reduce connection pool size in `server/db.ts`
- Optimize queries (add indexes)

---

## Support

For deployment issues:
- 📧 Email: devops@promptlibrary.com
- 💬 Discord: [Join our community](https://discord.gg/promptlib)
- 📖 Docs: [Full documentation](https://docs.promptlibrary.com)
