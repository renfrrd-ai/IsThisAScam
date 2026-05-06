# Deployment Guide - ScamRadar

## Prerequisites

- Supabase project with database migrations applied
- OpenAI API key (optional, falls back to pattern analysis)
- Node.js 18+ runtime

## Environment Variables

### Backend (apps/server/.env)

```
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional - AI features
OPENAI_API_KEY=sk-...

# Optional - Admin authentication
ADMIN_API_KEY=your-secure-admin-key

# Optional - Storage
CLOUDFLARE_R2_BUCKET=your-bucket
CLOUDFLARE_R2_ACCESS_KEY=your-access-key
CLOUDFLARE_R2_SECRET_KEY=your-secret-key
CLOUDFLARE_R2_ENDPOINT=https://...

# Server
PORT=3000
NODE_ENV=production
```

### Frontend (apps/web/.env)

```
VITE_API_URL=https://your-backend-url.com
```

## Deployment Targets

### Frontend - Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `apps/web`
4. Add environment variables
5. Deploy

Build command: `cd ../.. && npm run build --workspace @scamradar/web`
Output directory: `apps/web/dist`

### Backend - Render.com (Recommended)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory to `apps/server`
4. Build command: `cd ../.. && npm run build --workspace @scamradar/server`
5. Start command: `cd apps/server && node dist/index.js`
6. Add environment variables

### Database - Supabase

- Already configured via Supabase cloud
- Run migrations via Supabase dashboard or CLI

## Production Safety Checks

- [x] CORS configured for production domains
- [x] Rate limiting enabled
- [x] Secure headers via Helmet
- [x] Error logging (structured JSON)
- [ ] Add request logging middleware
- [ ] Add health check monitoring

## Post-Deployment Smoke Test

- [ ] Home page loads
- [ ] Scam library displays
- [ ] Scam detail page works
- [ ] Report form submits
- [ ] AI check endpoint responds
- [ ] Admin login works
- [ ] Admin can moderate reports
