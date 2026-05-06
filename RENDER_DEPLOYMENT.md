# Render Deployment Guide

## 🚀 Deploy to Render

### Step 1: Push to GitHub
```bash
git add -A
git commit -m "feat: Role-based system with admin upload APIs - Deploy to Render"
git push origin main
```

### Step 2: Connect Render to GitHub
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Connect your GitHub account
5. Select repository: `shotota-v2`
6. Select branch: `main`

### Step 3: Configure the Web Service

**Basic Settings:**
- **Name:** `shotota-v2`
- **Environment:** `Node`
- **Region:** `Oregon (US West)`
- **Branch:** `main`
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm run start`
- **Plan:** Free (upgrade later as needed)

### Step 4: Add Environment Variables

In Render dashboard, go to **Environment** and add these variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_S4OH7mBDUpKf@ep-aged-firefly-am1yynux-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_SECRET=shotota-super-secret-key-2026

NEXTAUTH_URL=https://shotota-v2.onrender.com

NEXT_PUBLIC_API_URL=https://shotota-v2.onrender.com

SKIP_ENV_VALIDATION=true

NODE_ENV=production
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Render automatically starts building
3. Wait 3-5 minutes for deployment to complete
4. Once done, your app is live at: **https://shotota-v2.onrender.com**

---

## 📋 Features Deployed

✅ **Authentication**
- Signup with role selection (Student/Instructor)
- Login without demo credential hints
- NextAuth.js with JWT sessions

✅ **Role-Based Access Control**
- Students: View courses, take exams, see results
- Instructors/Admins: Upload courses, upload exams with questions

✅ **Admin APIs**
- `POST /api/admin/courses` - Create course
- `GET /api/admin/courses` - List courses
- `POST /api/admin/exams` - Create exam with questions
- `GET /api/admin/exams` - List exams

✅ **Database**
- Neon PostgreSQL (free tier)
- Prisma ORM
- User, Course, Exam, Question schemas

---

## 🔍 Troubleshooting

### Build Failed
Check build logs in Render dashboard. Common issues:
- Missing environment variables
- Prisma schema issues
- TypeScript compilation errors

### Database Connection Failed
- Verify `DATABASE_URL` is correct
- Check Neon PostgreSQL connection string
- Ensure IP whitelist allows all IPs (in Neon dashboard)

### App Not Starting
- Check `npm run start` output in logs
- Verify all environment variables are set
- Check NextAuth.js configuration

---

## 📱 Test the App

1. **Signup:** https://shotota-v2.onrender.com/signup
   - Toggle between Student and Instructor roles
   - Create an admin account (role: Instructor)
   
2. **Login:** https://shotota-v2.onrender.com/login
   - Login with created credentials

3. **Admin Dashboard:** https://shotota-v2.onrender.com/admin
   - Only accessible to Instructors/Admins
   - Upload courses and exams

4. **Student Dashboard:** https://shotota-v2.onrender.com/dashboard
   - View enrolled courses
   - Take exams
