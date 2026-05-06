# 🎓 Shotota V2 - Professional Exam Platform

> A budget-friendly, semi-professional exam preparation platform for competitive exams

## 📋 Project Overview

Shotota is a comprehensive exam preparation platform with:
- 🏫 **Student Portal**: Take exams, track performance, compete on leaderboards
- 📚 **Instructor Panel**: Create courses and upload bulk questions
- 👨‍💼 **Admin Dashboard**: Manage platform, verify payments, view analytics

## 🚀 Live Application

**Deployed on Render:** https://shotota-v2.onrender.com

**Features:**
- ✅ Role-based signup (Student/Instructor)
- ✅ Secure authentication with NextAuth.js
- ✅ Student dashboard with exam access
- ✅ Admin dashboard with course/exam upload APIs
- ✅ PostgreSQL database (Neon free tier)

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for deployment details.

## 🌟 Key Features

### For Students
- ✅ Browse and enroll in courses via bKash (manual verification)
- ✅ Take MCQ exams with timer
- ✅ Negative marking system
- ✅ Track performance (daily, weekly, monthly)
- ✅ Upload attachments
- ✅ Compete on leaderboards

### For Instructors
- ✅ Create courses with rich descriptions
- ✅ Bulk upload questions from PDF/Word
- ✅ Set exam parameters
- ✅ View student performance

## 📁 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Setup database
npx prisma migrate dev --name init

# 4. Start dev server
npm run dev
```

**📚 IMPORTANT**: Read the documentation in `/docs/`:
- `docs/SETUP.md` - Installation instructions
- `docs/FILE_STRUCTURE.md` - Project organization
- `docs/FEATURES.md` - Development roadmap
- `docs/DATABASE.md` - Database schema
- `docs/API.md` - API documentation

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Animations**: Framer Motion
- **File Parsing**: PDF.js, docx library

## 📊 Status

- ✅ Project structure & documentation created
- ✅ Git branches setup (main, develop, staging)
- ⬜ Database setup & migrations
- ⬜ Core features development

**Next**: See `docs/SETUP.md` to get started!
