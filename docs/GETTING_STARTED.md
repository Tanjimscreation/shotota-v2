# 🎯 Shotota V2 - Getting Started Guide

Welcome! This guide will help you understand and work with the Shotota project.

---

## 📖 Read Documentation First

The project has extensive documentation. **Read these files in this order**:

1. **`README.md`** - Project overview and quick commands
2. **`docs/SETUP.md`** - Installation & database configuration (DO THIS FIRST!)
3. **`docs/FILE_STRUCTURE.md`** - How the project is organized
4. **`docs/FEATURES.md`** - Development roadmap with all features listed as bullet points
5. **`docs/DATABASE.md`** - Database schema and relationships
6. **`docs/API.md`** - API endpoints and examples

---

## ⚡ 30-Second Overview

**Shotota** is an exam platform where:
- 📚 **Students** take exams and compete on leaderboards
- 👨‍🎓 **Instructors** create courses and upload bulk questions
- 👨‍💼 **Admins** manage platform and verify payments

**Tech**: Next.js 16, TypeScript, PostgreSQL, Prisma, Tailwind CSS

---

## 🚀 Get Started in 5 Steps

### Step 1: Install Dependencies
```bash
cd /Users/tanjimshadmansaad/shotota-v2
npm install
```

Additional packages (see docs/SETUP.md for full list):
```bash
npm install @prisma/client prisma next-auth react-hook-form framer-motion react-icons bcryptjs jsonwebtoken axios swr
```

### Step 2: Setup Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/shotota"
NEXT_PUBLIC_API_URL="http://localhost:3000"
JWT_SECRET="your-random-secret-key"
NEXTAUTH_SECRET="another-random-key"
NEXT_PUBLIC_BKASH_NUMBER="01XXX-XXX-XXX"
```

### Step 3: Setup Database
```bash
# Install PostgreSQL (if needed)
brew install postgresql
brew services start postgresql

# Create database
createdb shotota

# Create Prisma schema (copy from docs/DATABASE.md to prisma/schema.prisma)

# Run migration
npx prisma migrate dev --name init
```

### Step 4: Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5: Follow Development Roadmap
See `docs/FEATURES.md` for the complete roadmap with phases 1-9

---

## 📁 Project Structure at a Glance

```
shotota-v2/
├── app/                    ← Next.js pages & API routes
├── src/
│   ├── components/        ← UI components (organized by feature)
│   ├── lib/
│   │   ├── db/           ← Database client
│   │   ├── services/     ← Business logic
│   │   └── utils/        ← Helpers (validators, formatters)
│   ├── types/            ← TypeScript definitions
│   └── styles/           ← CSS & animations
├── docs/                 ← 📖 DOCUMENTATION (READ THESE!)
├── public/uploads/       ← User-uploaded files
└── prisma/schema.prisma  ← Database schema
```

---

## 🎨 Key Concepts

### Component Organization
```
src/components/
├── common/      ← Navbar, Footer (used everywhere)
├── home/        ← Hero, Features (home page)
├── courses/     ← CourseCard, CourseGrid (courses)
├── exam/        ← ExamInterface, QuestionCard (exams)
├── admin/       ← CourseForm, Dashboard (admin)
└── leaderboard/ ← LeaderboardTable (rankings)
```

**Rule**: Keep all related components together. Don't scatter them.

### Naming Convention
```
Components:  PascalCase   (CourseCard.tsx, QuestionCard.tsx)
Utilities:   camelCase    (formatters.ts, validators.ts)
Types:       PascalCase   (Course.ts, User.ts)
Pages:       lowercase    (page.tsx, layout.tsx)
```

### Import Aliases
```typescript
// ❌ Bad
import { CourseCard } from '../../../components/courses'

// ✅ Good
import { CourseCard } from '@/components/courses'
```

All configured in `tsconfig.json` with `@/*` pointing to `src/`

---

## 🔄 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/course-management
```

Branch naming:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code improvements

### 2. Make Changes
```bash
# Edit files...
# Test frequently!
```

### 3. Commit Changes
```bash
git add .
git commit -m "feat: Add course listing page"
```

Commit messages:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `test:` - Tests

### 4. Push to Develop
```bash
git push origin feature/course-management
# Create Pull Request on GitHub
# Merge to develop after review
```

### 5. Promote to Production
```
develop → staging (testing)
staging → main (production)
```

---

## 🧩 Building a Feature (Step-by-Step)

Let's say you want to build the "Course Listing" feature:

### Step 1: Create Types
**File**: `src/types/index.ts`
```typescript
export interface Course {
  id: string
  title: string
  description: string
  price: number
  instructor: string
  thumbnail?: string
}
```

### Step 2: Create Components
**File**: `src/components/courses/CourseCard.tsx`
```typescript
'use client'
import { Course } from '@/types'

interface Props {
  course: Course
}

export const CourseCard = ({ course }: Props) => {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">{course.title}</h3>
      <p className="text-gray-600">{course.description}</p>
      <p className="text-lg font-semibold">৳{course.price}</p>
    </div>
  )
}
```

### Step 3: Create API Endpoint
**File**: `app/api/courses/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function GET() {
  try {
    const courses = await prisma.course.findMany()
    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### Step 4: Create Page
**File**: `app/courses/page.tsx`
```typescript
'use client'
import { useEffect, useState } from 'react'
import { CourseCard } from '@/components/courses/CourseCard'
import { Course } from '@/types'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
  }, [])

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

### Step 5: Test
```bash
npm run dev
# Visit http://localhost:3000/courses
# Test functionality
```

### Step 6: Commit
```bash
git add .
git commit -m "feat: Add course listing page with API"
```

---

## 💡 Tips & Best Practices

### DO ✅
- ✅ Read documentation before starting
- ✅ Use TypeScript for everything
- ✅ Keep components small (<200 lines)
- ✅ Reuse components
- ✅ Test frequently during development
- ✅ Commit often with meaningful messages
- ✅ Use proper naming conventions
- ✅ Keep related code together

### DON'T ❌
- ❌ Don't commit to main directly
- ❌ Don't ignore TypeScript errors
- ❌ Don't create giant components (>500 lines)
- ❌ Don't repeat code (use components)
- ❌ Don't merge without testing
- ❌ Don't skip documentation
- ❌ Don't use any-types in TypeScript
- ❌ Don't ignore error handling

---

## 🐛 Debugging

### Enable Debug Logs
```bash
DEBUG=shotota:* npm run dev
```

### Use Prisma Studio (GUI)
```bash
npx prisma studio
# Opens http://localhost:5555
```

### Check TypeScript Errors
```bash
npm run lint
```

### Test API Endpoints
```bash
# Using curl
curl -X GET http://localhost:3000/api/courses

# Using Thunder Client or Postman
POST http://localhost:3000/api/auth/login
Body: {"email":"test@example.com","password":"password123"}
```

---

## 📊 Database Schema

Key tables:
- **User** - Students & admins
- **Course** - Courses
- **Enrollment** - Student enrollments (with payment status)
- **Exam** - Exams for courses
- **Question** - MCQ questions
- **ExamResult** - Student exam results
- **Upload** - File uploads

See `docs/DATABASE.md` for full schema.

---

## 🚀 From Now On

1. **Pick a phase** from `docs/FEATURES.md`
2. **Follow the bullet points** listed under that phase
3. **Implement features incrementally**
4. **Test frequently** - don't skip this!
5. **Commit to feature branches**
6. **Merge to develop** when ready
7. **Move to staging/main** when phase is complete

---

## 🎯 Quick Reference

### Useful Commands
```bash
npm run dev                # Start dev server
npm run build              # Build for production
npm run lint               # Check code quality
npm run lint -- --fix      # Auto-fix linting issues

npx prisma migrate dev     # Create migration
npx prisma studio         # Open database GUI
npx prisma generate       # Update Prisma client

git checkout develop       # Switch to develop
git branch                 # List branches
git status                 # Check changes
git log --oneline          # View commit history
```

### Folder Purpose
- `app/` - Pages and API routes
- `src/components/` - React components
- `src/lib/` - Utilities and services
- `src/types/` - TypeScript definitions
- `public/` - Static files
- `docs/` - Documentation

### File Locations
- Environment: `.env.local`
- Types: `src/types/index.ts`
- Database: `src/lib/db/client.ts`
- Validators: `src/lib/utils/validators.ts`
- Formatters: `src/lib/utils/formatters.ts`

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Docs](https://react.dev)

---

## 📞 Need Help?

1. **Check the docs** - Answer is probably there
2. **Search code comments** - Implementation examples exist
3. **Look at components/** - See how it's done elsewhere
4. **Check FEATURES.md** - Development guide with examples
5. **Use Prisma Studio** - Visualize database

---

## ✅ Checklist

Before you start coding:

- [ ] Read README.md
- [ ] Read docs/SETUP.md
- [ ] Read docs/FILE_STRUCTURE.md
- [ ] Read docs/FEATURES.md (overview)
- [ ] Install dependencies (`npm install` + packages)
- [ ] Setup .env.local
- [ ] Setup database (PostgreSQL)
- [ ] Run migrations (`npx prisma migrate dev`)
- [ ] Start dev server (`npm run dev`)
- [ ] Verify http://localhost:3000 works
- [ ] Open VS Code
- [ ] Pick a feature from docs/FEATURES.md
- [ ] Start building! 🚀

---

**You're ready! Pick a phase from FEATURES.md and start building.** 

Good luck! 🎓
