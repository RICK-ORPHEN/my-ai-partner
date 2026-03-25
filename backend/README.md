# AI School Platform - Backend API

Production-grade Express.js backend for the AI School Platform with Supabase PostgreSQL database.

## Features

✅ **Complete Database Schema** - 30+ tables for users, courses, skills, projects, industries, and more
✅ **Authentication System** - JWT-based auth with Supabase integration
✅ **RESTful API** - 60+ endpoints organized by feature domain
✅ **Row-Level Security** - RLS policies for data privacy
✅ **Error Handling** - Comprehensive error responses
✅ **CORS Support** - Configurable CORS for frontend integration
✅ **Production Ready** - Logging, graceful shutdown, environment config

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project with PostgreSQL database

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Configure:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Database Setup

1. Create Supabase project at https://supabase.com
2. Run migrations in Supabase SQL editor:
   - `supabase/migrations/001_initial_schema.sql` - Creates all tables and RLS policies
   - `supabase/migrations/002_seed_data.sql` - Loads sample data (optional)

### Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:3001`

## API Endpoints

### Authentication (`/api/auth`)

- `POST /signup` - Register new user
- `POST /login` - Authenticate user
- `POST /logout` - Logout user
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile

### Industries (`/api/industries`)

- `GET /` - List all industries with goals
- `GET /:slug` - Get specific industry
- `GET /:id/goals` - Get industry goals

### Onboarding (`/api/onboarding`)

- `GET /my-progress` - Get onboarding status
- `POST /select-industry` - Select industry
- `POST /select-goals` - Select goals
- `POST /generate-path` - Generate learning path
- `GET /my-path` - Get learning path

### Lessons (`/api/lessons`)

- `GET /` - List all lessons
- `GET /:id` - Get lesson details
- `POST /:id/start` - Start lesson
- `POST /:id/complete` - Mark complete
- `GET /:id/progress` - Get lesson progress
- `POST /:id/chat` - Chat interaction

### Skills (`/api/skills`)

- `GET /` - List all skills
- `GET /my-scores` - Get user's scores
- `PUT /my-scores/:skill_id` - Update skill
- `GET /badges` - Get badges
- `GET /ranking` - Get rankings
- `GET /profile/:userId` - Get public profile

### Matching (`/api/matching`)

- `GET /offers` - List opportunities
- `GET /offers/:id` - Get opportunity
- `POST /apply/:id` - Apply to opportunity
- `GET /applications` - Get applications
- `PUT /applications/:id` - Update application
- `GET /messages` - Get messages

### Community (`/api/community`)

- `GET /posts` - List posts
- `POST /posts` - Create post
- `GET /posts/:id` - Get post with replies
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/reply` - Add reply
- `POST /posts/:id/like` - Like post

### Dashboard (`/api/dashboard`)

- `GET /stats` - User statistics
- `GET /activity` - Activity feed
- `GET /next-lesson` - Recommended lesson
- `GET /progress-breakdown` - Course progress details

## Project Structure

```
backend/
├── server.js                 # Express app setup
├── package.json             # Dependencies
├── .env.example             # Environment template
├── lib/
│   └── supabase.js         # Supabase client
├── middleware/
│   └── auth.js             # JWT verification
└── routes/
    ├── auth.js             # Authentication
    ├── industries.js       # Industries/goals
    ├── onboarding.js       # Learning path
    ├── lessons.js          # Lesson content
    ├── skills.js           # Skills & badges
    ├── matching.js         # Opportunities
    ├── community.js        # Community posts
    └── dashboard.js        # User dashboard
```

## Authentication

All protected endpoints require Bearer token in Authorization header:

```bash
Authorization: Bearer <jwt_token>
```

Tokens obtained from `/api/auth/login` or `/api/auth/signup`.

## Error Handling

Standard error response format:

```json
{
  "error": "Error Type",
  "message": "Human readable message",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

Status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema Highlights

### Core Tables
- `users` - User accounts and roles
- `user_profiles` - Extended profile info
- `user_industries` - Industry selection
- `user_goals` - Learning goals

### Learning
- `courses` - Course catalog
- `lessons` - Lesson content
- `lesson_progress` - User progress
- `enrollments` - Course enrollments
- `chat_sessions` - AI chat history

### Skills & Achievement
- `skills` - Skill definitions
- `user_skills` - User skill mapping
- `skill_scores` - Overall scores
- `badges` - Badge definitions
- `user_badges` - Earned badges

### Opportunities
- `industries` - 8 industry types
- `industry_goals` - Goals per industry
- `companies` - Company profiles
- `opportunities` - Job/project listings
- `applications` - User applications

### Community
- `community_posts` - Forum posts
- `community_replies` - Post replies

### Support
- `notifications` - User notifications
- `messages` - Direct messages
- `subscriptions` - Billing info
- `payments` - Payment records

## Security Features

✅ **Row Level Security** - All tables have RLS policies
✅ **JWT Auth** - Verified on protected endpoints
✅ **Input Validation** - All inputs validated
✅ **Environment Variables** - Sensitive data in .env
✅ **CORS** - Configured to frontend domain
✅ **Error Messages** - No sensitive info in responses

## Performance

- **Connection Pooling** - Via Supabase
- **Indexes** - On frequently queried columns
- **Pagination** - All list endpoints support offset/limit
- **Query Optimization** - Selective field selection
- **Caching** - Can be added at route level

## Development

### Run Tests
```bash
npm test
```

### Format Code
```bash
npm run format
```

### Check Linting
```bash
npm run lint
```

## Deployment

### Using Railway, Heroku, or Render

1. Push code to GitHub
2. Connect repository
3. Set environment variables
4. Deploy branch

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://prod-project.supabase.co
SUPABASE_SERVICE_KEY=prod-service-key
SUPABASE_ANON_KEY=prod-anon-key
JWT_SECRET=strong-random-secret-key
FRONTEND_URL=https://app.example.com
```

## Monitoring

- Logs to console with timestamps
- Error stack traces in development
- Request duration tracking
- Graceful shutdown on signals

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] AI integration for lesson chat (Claude/ChatGPT)
- [ ] File upload handling (portfolios, assignments)
- [ ] Email notifications
- [ ] Payment processing (Stripe integration)
- [ ] Advanced search with Elasticsearch
- [ ] Caching layer (Redis)
- [ ] Rate limiting
- [ ] API documentation (Swagger/OpenAPI)

## Support

For issues or questions:
1. Check existing error in response
2. Review database schema (supabase/migrations/)
3. Check environment variables in .env
4. Review Supabase logs in console

## License

MIT
