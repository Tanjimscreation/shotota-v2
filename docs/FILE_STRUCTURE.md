# 📁 Shotota V2 - Project Structure Guide

## Directory Overview

```
shotota-v2/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── (dashboard)/              # Protected dashboard routes
│   ├── admin/                    # Admin dashboard
│   ├── courses/                  # Course listing page
│   ├── exam/                     # Exam interface
│   ├── leaderboard/              # Leaderboard page
│   ├── profile/                  # User profile
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── src/
│   ├── components/               # Reusable React components
│   │   ├── common/               # Shared components (Navbar, Footer, etc)
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Card.tsx
│   │   │
│   │   ├── home/                 # Home page specific
│   │   │   ├── Hero.tsx          # Hero section with dynamic graphics
│   │   │   ├── FeaturesSection.tsx # Features with scroll animations
│   │   │   ├── SocialLinks.tsx   # Social media attractive display
│   │   │   └── CTASection.tsx    # Call to action
│   │   │
│   │   ├── courses/              # Course components
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseGrid.tsx
│   │   │   ├── CourseDetail.tsx
│   │   │   └── EnrollmentForm.tsx
│   │   │
│   │   ├── exam/                 # Exam components
│   │   │   ├── ExamInterface.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── OptionsDisplay.tsx
│   │   │   ├── Timer.tsx
│   │   │   └── ResultsDisplay.tsx
│   │   │
│   │   ├── admin/                # Admin specific
│   │   │   ├── CourseForm.tsx
│   │   │   ├── QuestionUploader.tsx # PDF/Word uploader
│   │   │   ├── StudentManager.tsx
│   │   │   └── AnalyticsDashboard.tsx
│   │   │
│   │   └── leaderboard/          # Leaderboard components
│   │       ├── LeaderboardTable.tsx
│   │       └── StatsCard.tsx
│   │
│   ├── lib/
│   │   ├── db/                   # Database related
│   │   │   ├── schema.ts         # Prisma schema exports
│   │   │   └── queries.ts        # Database queries
│   │   │
│   │   ├── services/             # Business logic services
│   │   │   ├── courseService.ts
│   │   │   ├── examService.ts
│   │   │   ├── userService.ts
│   │   │   ├── uploadService.ts  # File upload handler
│   │   │   ├── pdfParser.ts      # PDF/Word parsing
│   │   │   └── scoringService.ts
│   │   │
│   │   └── utils/                # Utility functions
│   │       ├── validators.ts     # Form validation
│   │       ├── formatters.ts     # Data formatting
│   │       ├── auth.ts           # Auth helpers
│   │       └── animations.ts     # Animation helpers
│   │
│   ├── types/
│   │   ├── index.ts              # All TypeScript types/interfaces
│   │   ├── user.ts
│   │   ├── course.ts
│   │   ├── exam.ts
│   │   └── api.ts
│   │
│   └── styles/
│       ├── animations.css        # Reusable animations
│       ├── variables.css         # CSS variables
│       └── components.css        # Component specific styles
│
├── public/
│   ├── uploads/                  # User uploads directory
│   │   ├── exams/
│   │   └── attachments/
│   ├── images/                   # Static images
│   ├── icons/                    # SVG icons
│   └── animations/               # Animation assets
│
├── docs/
│   ├── FILE_STRUCTURE.md         # This file
│   ├── FEATURES.md               # Feature development guide
│   ├── DATABASE.md               # Database schema
│   ├── API.md                    # API documentation
│   └── SETUP.md                  # Setup instructions
│
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example env variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## Key Folders Explained

### 📄 `/app` - Pages & Routes
- **Route Groups** `(auth)`, `(dashboard)` - Organize routes with shared layouts
- **Dynamic Routes** `[id]` - Course details, user profiles
- **API Routes** `/api/*` - Backend endpoints

### 🧩 `/src/components`
**Organization by Feature**
- Each feature has its own folder
- All related components stay together
- Import: `import { CourseCard } from '@/components/courses'`

### 📚 `/src/lib`
**Business Logic & Services**
- `db/` - Database operations
- `services/` - Core business logic (separated from components)
- `utils/` - Helper functions

### 🎨 `/src/types`
**TypeScript Definitions**
- Keep all types in one place for easy reference
- Import: `import type { Course, User } from '@/types'`

### 📁 `/public/uploads`
**User Generated Content**
- Organized by content type
- Never commit actual uploads (add to `.gitignore`)

## Import Aliases

```typescript
// Instead of: ../../../lib/utils/validators
// Use: @/lib/utils/validators

import { validateEmail } from '@/lib/utils/validators'
import { CourseCard } from '@/components/courses'
import type { Course } from '@/types/course'
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `CourseCard.tsx` |
| Pages | lowercase | `page.tsx` |
| Utils | camelCase | `formatters.ts` |
| Types | PascalCase | `Course.ts` |
| Constants | UPPER_SNAKE | `API_BASE_URL` |

## Quick Navigation

```typescript
// Adding a new feature? Follow this structure:
src/
├── components/featureName/     # UI components
├── lib/services/featureService.ts  # Business logic
├── types/feature.ts            # Type definitions
└── app/(routes)/feature/       # Pages
```

## Environment Variables (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
BKASH_ACCOUNT=your-bkash-number
```

This structure supports:
✅ Easy navigation & onboarding
✅ Scalable for future features
✅ Clear separation of concerns
✅ Team collaboration ready
