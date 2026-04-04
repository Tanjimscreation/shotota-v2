# 📊 Shotota V2 - Database Schema

## Technology Stack
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Location**: `prisma/schema.prisma`

---

## Database Tables

### 1. `User` (Students & Admins)
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // hashed
  name          String
  role          Role      @default(STUDENT)     // STUDENT, ADMIN
  phone         String?
  avatar        String?                         // profile picture URL
  bio           String?
  
  // Relations
  enrollments   Enrollment[]
  examResults   ExamResult[]
  uploads       Upload[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  STUDENT
  ADMIN
}
```

### 2. `Course` (Courses)
```prisma
model Course {
  id            String    @id @default(cuid())
  title         String
  description   String    @db.Text
  price         Float
  instructor    String
  duration      Int       // in hours
  category      String
  thumbnail     String?   // image URL
  
  // Relations
  enrollments   Enrollment[]
  exams         Exam[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([category])
}
```

### 3. `Enrollment` (Student-Course Relationship)
```prisma
model Enrollment {
  id            String    @id @default(cuid())
  userId        String
  courseId      String
  
  // Payment Info
  paymentStatus PaymentStatus @default(PENDING)  // PENDING, VERIFIED, REJECTED
  bkashNumber   String                            // bKash number used
  transactionId String                            // bKash transaction ID
  paymentProof  String                            // screenshot URL
  
  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  course        Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  enrolledAt    DateTime  @default(now())
  verifiedAt    DateTime?
  
  @@unique([userId, courseId])                    // One enrollment per user per course
  @@index([userId])
  @@index([courseId])
  @@index([paymentStatus])
}

enum PaymentStatus {
  PENDING
  VERIFIED
  REJECTED
}
```

### 4. `Exam` (Exam Configuration)
```prisma
model Exam {
  id              String    @id @default(cuid())
  courseId        String
  title           String
  description     String?
  duration        Int       // in minutes
  totalQuestions  Int
  negativeMarking Float     // e.g., 0.25 for -0.25 per wrong answer
  passingScore    Float?    // optional minimum score to pass
  
  // Relations
  course          Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  questions       Question[]
  results         ExamResult[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([courseId])
}
```

### 5. `Question` (MCQ Questions)
```prisma
model Question {
  id            String    @id @default(cuid())
  examId        String
  questionText  String    @db.Text
  options       Option[]  // Array of options
  correctAnswer String    // A, B, C, or D
  order         Int       // Question number in exam
  
  // Relations
  exam          Exam      @relation(fields: [examId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([examId])
}

// Options stored as JSON in database for simplicity
// Prisma handles it automatically
```

### 6. `ExamResult` (Student Exam Performance)
```prisma
model ExamResult {
  id              String    @id @default(cuid())
  userId          String
  examId          String
  
  // Scoring
  totalQuestions  Int
  correctAnswers  Int
  wrongAnswers    Int
  unattempted     Int
  score           Float     // calculated score with negative marking
  percentage      Float     // percentage score
  negativeMarks   Float     // total negative marks deducted
  
  // Time & Status
  timeTaken       Int       // in seconds
  status          ExamStatus @default(COMPLETED)
  
  // Question Answers (JSON)
  answers         AnswerMap // { questionId: "A", ... }
  
  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  exam            Exam      @relation(fields: [examId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([userId, examId])  // One result per user per exam (can be updated)
  @@index([userId])
  @@index([examId])
  @@index([createdAt])
}

enum ExamStatus {
  IN_PROGRESS
  SUBMITTED
  COMPLETED
  GRADED
}

// TypeScript type for answers
type AnswerMap = Record<string, string>  // { "q1": "A", "q2": "B" }
```

### 7. `Upload` (Student File Uploads)
```prisma
model Upload {
  id            String    @id @default(cuid())
  userId        String
  filename      String
  originalName  String
  fileType      String    // pdf, doc, image, etc
  fileSize      Int       // in bytes
  filePath      String    // stored at public/uploads/{path}
  
  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime  @default(now())
  
  @@index([userId])
}
```

### 8. `Leaderboard` (Cached for Performance)
```prisma
model LeaderboardEntry {
  id            String    @id @default(cuid())
  userId        String    @unique
  userName      String
  totalScore    Float
  examCount     Int
  avgScore      Float
  rank          Int
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([rank])
  @@index([totalScore])
  @@index([updatedAt])
}
```

---

## Relationships Diagram

```
User (1) ──────────────────────────── (Many) Enrollment
  │                                         │
  │                                    (1) Course
  │
  ├─────── (1) ──────────────── (Many) ExamResult
  │                                      │
  │                                  (1) Exam
  │                                      │
  │                                  (Many) Question
  │
  └─────── (1) ──────────────── (Many) Upload
```

---

## Key Queries

### Get Student's Courses
```typescript
const courses = await prisma.enrollment.findMany({
  where: { userId: studentId, paymentStatus: 'VERIFIED' },
  include: { course: true }
})
```

### Get Exam Questions
```typescript
const questions = await prisma.question.findMany({
  where: { examId: examId },
  orderBy: { order: 'asc' }
})
```

### Calculate Student's Score
```typescript
const result = await prisma.examResult.create({
  data: {
    userId,
    examId,
    correctAnswers,
    wrongAnswers,
    unattempted,
    score: (correctAnswers * 1) - (wrongAnswers * negativeMarking),
    percentage: ((correctAnswers * 1) - (wrongAnswers * negativeMarking)) / totalQuestions * 100,
    negativeMarks: wrongAnswers * negativeMarking,
    timeTaken,
    answers: studentAnswers
  }
})
```

### Get Leaderboard
```typescript
const leaderboard = await prisma.leaderboardEntry.findMany({
  orderBy: { rank: 'asc' },
  take: 100
})
```

### Filter Results by Date
```typescript
const weeklyResults = await prisma.examResult.findMany({
  where: {
    userId,
    createdAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    }
  }
})
```

---

## Indexes for Performance

Key indexes already defined:
- `Enrollment`: `(userId, courseId)` unique, `paymentStatus`
- `ExamResult`: `(userId, examId)` unique, `createdAt`
- `Question`: `examId`
- `LeaderboardEntry`: `rank`, `totalScore`, `updatedAt`

---

## Migration Steps

```bash
# Install Prisma
npm install @prisma/client prisma

# Initialize Prisma
npx prisma init

# Create migration (after updating schema.prisma)
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

---

## Prisma Client Usage

```typescript
// src/lib/db/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Import everywhere:
```typescript
import { prisma } from '@/lib/db/client'

// Use it
const user = await prisma.user.findUnique({ where: { id: userId } })
```

---

## Backup Strategy

```bash
# Export database
pg_dump DATABASE_URL > backup.sql

# Restore database
psql DATABASE_URL < backup.sql
```

Schedule backups weekly in production.
