# API Documentation

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### POST /api/auth/register

Register a new user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "displayName": "John Doe" // optional
}
```

**Response** (201):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "displayName": "John Doe",
    "roles": ["user"],
    "karmaScore": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Rate Limit**: 5 requests per 15 minutes

---

### POST /api/auth/login

Login with email and password.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Rate Limit**: 5 requests per 15 minutes

---

## Prompts

### GET /api/prompts

Get all public prompts (paginated).

**Query Parameters**:
- `limit` (number, default: 20): Number of prompts to return
- `offset` (number, default: 0): Pagination offset

**Response** (200):
```json
[
  {
    "id": 1,
    "slug": "code-review-assistant",
    "title": "Code Review Assistant",
    "shortDesc": "AI assistant for code reviews",
    "type": "text",
    "industryTags": ["engineering"],
    "socialTags": ["coding", "ai"],
    "totalUses": 150,
    "owner": {
      "id": 1,
      "displayName": "John Doe",
      "avatarUrl": "https://..."
    }
  }
]
```

---

### POST /api/prompts

Create a new prompt (requires authentication).

**Request**:
```json
{
  "title": "Code Review Assistant",
  "shortDesc": "AI assistant for code reviews",
  "type": "text",
  "industryTags": ["engineering"],
  "socialTags": ["coding"],
  "visibility": "public",
  "license": "MIT",
  "content": {
    "system": "You are a code review expert",
    "user": "Review the following code..."
  }
}
```

**Response** (201):
```json
{
  "prompt": { ... },
  "version": { ... }
}
```

---

### GET /api/prompts/slug/:slug

Get a prompt by slug.

**Response** (200):
```json
{
  "id": 1,
  "slug": "code-review-assistant",
  "title": "Code Review Assistant",
  ...
}
```

---

## Feed Algorithms

### GET /api/feed/trending

Get trending prompts (cached for 5 minutes).

**Query Parameters**:
- `limit` (number, default: 20)

**Response** (200):
```json
[
  {
    "id": 1,
    "title": "Trending Prompt",
    "popularityScore": 95.5,
    ...
  }
]
```

---

### GET /api/feed/new

Get newest prompts.

**Query Parameters**:
- `limit` (number, default: 20)

**Response** (200):
```json
[...]
```

---

### GET /api/feed/editors-choice

Get featured prompts.

**Query Parameters**:
- `limit` (number, default: 20)

**Response** (200):
```json
[...]
```

---

## Social Features

### POST /api/users/:id/follow

Follow a user (requires authentication).

**Response** (200):
```json
{
  "success": true
}
```

---

### DELETE /api/users/:id/follow

Unfollow a user (requires authentication).

**Response** (200):
```json
{
  "success": true
}
```

---

### POST /api/prompts/:id/vote

Vote on a prompt (requires authentication).

**Request**:
```json
{
  "voteType": "upvote" // or "downvote"
}
```

**Response** (200):
```json
{
  "success": true
}
```

---

## Admin Endpoints

### GET /api/admin/moderation

Get moderation queue (requires admin/moderator role).

**Response** (200):
```json
{
  "flagged": [
    {
      "id": 1,
      "title": "Flagged Prompt",
      "flagReason": "spam",
      ...
    }
  ]
}
```

---

## Health & Metrics

### GET /health

Health check endpoint (no authentication required).

**Response** (200):
```json
{
  "status": "ok",
  "uptime": 12345.67,
  "timestamp": "2025-11-25T04:00:00.000Z",
  "environment": "production"
}
```

---

### GET /metrics

Prometheus metrics endpoint (no authentication required).

**Response** (200):
```
# HELP promptlib_http_requests_total Total number of HTTP requests
# TYPE promptlib_http_requests_total counter
promptlib_http_requests_total{method="GET",route="/api/prompts",status_code="200"} 1234
...
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

**Common Status Codes**:
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error
