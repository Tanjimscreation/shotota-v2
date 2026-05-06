# 🚀 Render Deployment Guide

## Prerequisites Completed ✅

- ✅ Database: Neon PostgreSQL configured with test users
- ✅ Authentication: NextAuth.js with Credentials provider
- ✅ Auth Routes: `/api/auth/[...nextauth]` and `/api/auth/signup`
- ✅ Error Handling: Comprehensive logging and error messages
- ✅ Database Connection: Configured in `.env` and `.env.production`
- ✅ Build: Next.js with Turbopack, compiled successfully
- ✅ Test Users: Seeded in database

## Step 1: Render.com Setup

### 1.1 Connect GitHub Repository
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `Tanjimscreation/shotota-v2`
4. Select `main` branch

### 1.2 Configure Service
- **Name:** `shotota-v2`
- **Environment:** `Node`
- **Build Command:** `npx prisma generate && npm run build`
- **Start Command:** `npm start`
- **Node Version:** `20`

## Step 2: Environment Variables (Critical!)

In Render Dashboard → Settings → Environment Variables, add:

```env
# Database - Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_S4OH7mBDUpKf@ep-aged-firefly-am1yynux-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Authentication
NEXTAUTH_SECRET=NoBkFijYgoHWUDflAUvmAd2p0uqyt43E3JX7HmwXfGU=
NEXTAUTH_URL=https://shotota-v2.onrender.com

# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://shotota-v2.onrender.com

# Optional
SKIP_ENV_VALIDATION=true
```

**⚠️ IMPORTANT:** 
- Never expose these in `.env` files that are committed to git
- Render will override with environment variables from dashboard
- Check "Skip Build if Nothing Changed" for faster deployments

## Step 3: Deploy

1. **Push to GitHub:**
   ```bash
   git add -A
   git commit -m "deploy: Ready for Render production"
   git push origin main
   ```

2. **Auto-Deploy:**
   - Render automatically builds and deploys on every `main` branch push
   - Monitor deployment in Render Dashboard
   - Check logs in "Logs" tab

3. **Manual Deploy (if needed):**
   - Render Dashboard → Click "Deploy" button

## Step 4: Verify Deployment

### 4.1 Check Live URL
```
https://shotota-v2.onrender.com
```

### 4.2 Test Login
- **Email:** test@test.com
- **Password:** password
- Should redirect to `/dashboard`

### 4.3 Test Signup
- Navigate to `/signup`
- Create new account
- Login with new credentials

### 4.4 Test Features
- ✅ Dashboard with user data
- ✅ Negative Marks Analytics
- ✅ Wrong Answer Collection
- ✅ Courses & Exams

## Step 5: Database Connection Details

### Neon Database
- **URL:** ep-aged-firefly-am1yynux-pooler.c-5.us-east-1.aws.neon.tech
- **Database:** neondb
- **User:** neondb_owner
- **Tables:** 
  - users (with login credentials)
  - courses
  - exams
  - exam results
  - wrong_answers (NEW)
  - negative_mark_tracker (NEW)

### Seed Data (Pre-loaded)
```
Student: test@test.com / password
Admin: rahim@shotota.com / hashed_password_123
```

## Troubleshooting

### Issue: Build Fails
**Solution:** Check build logs in Render
```bash
# Local build test
npm run build
```

### Issue: Login Not Working
**Solution:** Verify DATABASE_URL is set in Render environment
```bash
# Check connection
curl https://shotota-v2.onrender.com/api/auth/session
```

### Issue: Database Connection Error
**Solution:** 
1. Verify NEON_DATABASE_URL in Render environment
2. Check network access: Neon allows all IPs by default
3. Retry build and deployment

### Issue: Session/Cookie Problems
**Solution:** Verify NEXTAUTH_URL and NEXTAUTH_SECRET are set

## Performance Notes

- **Build Time:** ~2-3 minutes (first time)
- **Start Time:** ~30-60 seconds
- **Cold Start:** 5-10 seconds first request
- **Database:** Free Neon tier (10GB, suitable for MVP)

## Next Steps

1. ✅ Verify all features work in production
2. ⏳ Add email verification (optional)
3. ⏳ Add password reset (optional)
4. ⏳ Implement auto question upload from Word/PDF
5. ⏳ Set up monitoring and error tracking (Sentry)

## Useful Links

- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs
- NextAuth Docs: https://next-auth.js.org/
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Status:** Ready for production deployment ✅
**Last Updated:** May 6, 2026
