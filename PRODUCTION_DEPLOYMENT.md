# Shotota v2 - Production Deployment Guide

## Overview
Shotota v2 is a Bengali medical exam preparation platform built with Next.js 16.2.2, NextAuth.js, and Tailwind CSS. This guide covers deployment to production environments.

## Production Features Implemented
✅ NextAuth.js with JWT sessions
✅ Mock authentication fallback for development
✅ Graceful database error handling
✅ Type-safe API routes with TypeScript
✅ Responsive design with Tailwind CSS
✅ Framer Motion animations
✅ Full Bengali UI
✅ Admin dashboard with exam creation
✅ Settings page with profile management
✅ Exam system with results tracking

## Prerequisites
- Node.js 18.x or higher
- npm or yarn
- PostgreSQL 13+ (optional - can run with mock data)
- Vercel account (recommended) or any Node.js hosting

## Environment Variables

### Required for Production
```
# Authentication
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://yourdomain.com

# Database (Optional - graceful fallback without it)
DATABASE_URL=postgresql://user:password@localhost:5432/shotota_db

# Optional
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import repository
4. Add environment variables in Settings > Environment Variables
5. Deploy

**Build Command:** `npm run build`
**Start Command:** `npm start`
**Install Command:** `npm ci`

### Option 2: Self-Hosted (AWS, DigitalOcean, Heroku, etc.)

#### Install Dependencies
```bash
npm ci --production
```

#### Build for Production
```bash
npm run build
```

#### Start Production Server
```bash
npm start
```

Server runs on `http://localhost:3000` by default.

#### Environment
Create a `.env.production.local` file with:
```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=your-database-url  # Optional
NODE_ENV=production
```

### Option 3: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY .next ./.next
COPY public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

#### Build and Run
```bash
docker build -t shotota:latest .
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=https://yourdomain.com \
  shotota:latest
```

## Database Setup (Optional)

### PostgreSQL Setup
```bash
# Create database
createdb shotota_db

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

### Without Database
The app works without a database using mock data and in-memory storage:
- Login with mock users: rahim@shotota.com / hashed_password_123
- Exams loaded from mock data
- Results stored in memory

## Performance Optimization

### Build Size
- Production build is optimized with Turbopack
- Static pages pre-rendered at build time
- Dynamic routes rendered on demand

### Caching
- SessionProvider refetches every 5 minutes
- Next.js cache headers configured
- SWR for client-side data fetching

## Security

### Implemented
✅ CSRF protection via NextAuth
✅ Secure JWT sessions
✅ HTTP-only cookies
✅ SQL injection prevention (Prisma)
✅ XSS protection (React)
✅ Type safety (TypeScript)

### Recommendations for Production
1. Use HTTPS only
2. Set secure cookies in NextAuth config
3. Use environment variables for secrets
4. Enable rate limiting on API routes
5. Set up monitoring and error tracking
6. Use CDN for static assets
7. Enable CORS if needed

## Testing Production Build Locally

```bash
# Build for production
npm run build

# Start production server
npm start

# Visit http://localhost:3000
```

## Monitoring & Logs

### Environment-Based Logging
- Development: Verbose logging in browser console
- Production: Minimal logging, critical errors only

### Recommended Tools
- Vercel Analytics (built-in on Vercel)
- Sentry for error tracking
- DataDog for performance monitoring
- LogRocket for session replay

## Troubleshooting

### Build Fails
```bash
# Clear build cache
rm -rf .next
npm run build
```

### Session Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear cookies in browser

### Database Connection Issues
- App works without database (graceful fallback)
- Check DATABASE_URL format
- Verify PostgreSQL is running

### Authentication Fails
- Check NextAuth route is accessible: `/api/auth/signin`
- Verify credentials provider is configured
- Check session callback in [...nextauth]/route.ts

## Rollback Procedure

If issues occur:
1. Revert to previous commit: `git revert <commit-hash>`
2. Rebuild: `npm run build`
3. Restart: `npm start`

## Support & Documentation

- **Next.js**: https://nextjs.org/docs
- **NextAuth.js**: https://next-auth.js.org
- **Prisma**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Version Info
- Next.js: 16.2.2 (Turbopack)
- NextAuth.js: Latest
- Node.js: 18+
- React: 19
- TypeScript: Latest

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Check security: `npm audit`
- Monitor error logs
- Check database backups
- Review usage analytics

### Deployment Checklist
- [ ] Build succeeds without errors
- [ ] All environment variables set
- [ ] NEXTAUTH_SECRET is secure and unique
- [ ] NEXTAUTH_URL matches deployment domain
- [ ] Database connection working (if used)
- [ ] SSL/HTTPS enabled
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Load testing completed
- [ ] Team trained on deployment

---

**Last Updated:** April 11, 2026
**Status:** Production Ready ✅
