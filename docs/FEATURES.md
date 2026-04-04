# 🚀 Shotota V2 - Development Features & Bullets

> **Vibe Coding Guide**: Use this as a reference. Build incrementally. Test frequently.

---

## 🎯 PHASE 1: FOUNDATION (Week 1-2)

### 1.1 Authentication System
- [ ] User model: **Student** & **Admin** roles
- [ ] JWT-based authentication
- [ ] Signup/Login pages
- [ ] Protected routes middleware
- [ ] Password hashing (bcrypt)
- [ ] Session management
- **Implementation Notes**:
  - Use NextAuth.js or JWT token in headers
  - Store auth token in HTTP-only cookies
  - Redirect unauthenticated users to login

### 1.2 Database Setup
- [ ] PostgreSQL with Prisma ORM
- [ ] User table (id, email, password, role, createdAt)
- [ ] Course table (id, title, description, price, instructor, createdAt)
- [ ] Enrollment table (userId, courseId, enrolledAt, paymentProof)
- [ ] Exam table (id, courseId, questions, negativeMarking, duration)
- [ ] ExamResult table (userId, examId, score, negativeMarks, timeTaken)
- [ ] Leaderboard aggregation
- **Implementation Notes**:
  - Use Prisma migrations for database versioning
  - Seed initial data for testing

### 1.3 Basic UI Components
- [ ] Navbar (responsive, mobile menu)
- [ ] Footer (social links)
- [ ] Card components (reusable)
- [ ] Button variants (primary, secondary, danger)
- [ ] Modal/Dialog
- [ ] Form inputs (validated)
- [ ] Loading spinner
- **Implementation Notes**:
  - Build with Tailwind CSS
  - Use Shadcn/ui for faster development
  - Ensure mobile-responsive design

---

## 🏠 PHASE 2: HOME PAGE (Week 2-3)

### 2.1 Hero Section with Dynamic Graphics
- [ ] Animated gradient background
- [ ] Hero text with typewriter effect
- [ ] CTA button (scroll animation)
- [ ] Parallax scrolling effect
- **Tech Stack**:
  - Framer Motion (animations)
  - Canvas/SVG for graphics
  - CSS animations for transitions
- **Implementation Notes**:
  ```typescript
  // Use Framer Motion for smooth animations
  import { motion } from 'framer-motion'
  
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    Dynamic content
  </motion.div>
  ```

### 2.2 Features Section with Scroll Animations
- [ ] Appear on scroll effect
- [ ] Feature cards with icons
- [ ] Smooth transitions
- [ ] Staggered animation (each card animates sequentially)
- **Implementation Notes**:
  - Use `useInView` from Framer Motion
  - Trigger animations when element enters viewport
  - Create smooth transition between sections

### 2.3 Social Links Display (Attractive)
- [ ] Social icons in footer/header
- [ ] Hover effects
- [ ] Links: Facebook, YouTube, LinkedIn, WhatsApp
- [ ] Icon animation on hover
- **Implementation Notes**:
  ```typescript
  const socialLinks = [
    { name: 'Facebook', url: 'https://...', icon: FaFacebook },
    { name: 'YouTube', url: 'https://...', icon: FaYoutube },
    // ...
  ]
  ```

### 2.4 Call-to-Action Section
- [ ] Browse courses button
- [ ] Login/Signup links
- [ ] Newsletter signup (optional for budget)

---

## 📚 PHASE 3: COURSE MANAGEMENT (Week 3-4)

### 3.1 Admin: Create Courses
- [ ] Course form (name, description, price, duration, instructor)
- [ ] Rich text editor for description
- [ ] Course thumbnail upload
- [ ] Validation (empty fields, price > 0)
- [ ] Save to database
- **Implementation Notes**:
  - Create at: `src/components/admin/CourseForm.tsx`
  - Use React Hook Form for form management
  - Validate before submission

### 3.2 Display Courses
- [ ] Course grid view (responsive)
- [ ] Course cards (title, price, instructor, rating)
- [ ] Search/filter by category
- [ ] Pagination
- [ ] Click to view details
- **Implementation Notes**:
  - Fetch from `/api/courses` endpoint
  - Cache results with SWR or React Query
  - Show loading state while fetching

### 3.3 Course Details Page
- [ ] Full course information
- [ ] Instructor details
- [ ] Course curriculum (if available)
- [ ] Enroll button
- [ ] Reviews/ratings (optional for MVP)
- **Implementation Notes**:
  - Dynamic route: `app/courses/[id]/page.tsx`
  - Display all course details from database

### 3.4 Enrollment System (Without Payment Gateway)
- [ ] Enrollment form with bKash details display
- [ ] Student fills enrollment form (name, email, transaction ID)
- [ ] Payment proof upload (screenshot)
- [ ] Admin verification required (later)
- [ ] Upon enrollment: student gets access to exams
- **Implementation Notes**:
  ```typescript
  // Show bKash number statically
  <div className="bkash-info">
    Send money to: <strong>01XXX-XXX-XXX</strong>
  </div>
  // Student uploads proof
  <input type="file" accept="image/*" />
  ```

---

## 📝 PHASE 4: EXAM SYSTEM (Week 4-6)

### 4.1 Bulk Question Upload (PDF/Word)
- [ ] File upload interface
- [ ] Accept .pdf and .docx files
- [ ] Parse file to extract questions
- [ ] Question format: `Q1. Question text? A) Option1 B) Option2 C) Option3 D) Option4 Answer: A`
- [ ] Validate parsed questions
- [ ] Save to database
- **Implementation Notes**:
  - Use libraries: `pdfjs-dist` (PDF) & `docx` (Word)
  - Parse questions line by line
  - Create batch insert in database
  - **Sample format**:
    ```
    Q1. What is 2+2?
    A) 3
    B) 4
    C) 5
    D) 6
    Answer: B
    
    Q2. What is capital of France?
    A) London
    B) Berlin
    C) Paris
    D) Madrid
    Answer: C
    ```

### 4.2 Question Management
- [ ] List all questions in exam
- [ ] Edit individual questions (fallback)
- [ ] Delete questions
- [ ] Set question order
- [ ] Set negative marking value
- **Implementation Notes**:
  - Create endpoint: `POST /api/exams/upload`
  - Create endpoint: `POST /api/questions/parse`
  - Store questions with exam association

### 4.3 Exam Interface (Student View)
- [ ] Timer (countdown)
- [ ] Question card display (one per page or all visible)
- [ ] Radio buttons for answer selection
- [ ] Navigation (next, previous)
- [ ] Question palette (mark review, attempted, unanswered)
- [ ] Submit exam button
- **Implementation Notes**:
  ```typescript
  // Timer component
  <Timer duration={examDuration} onExpired={handleSubmit} />
  
  // Question card
  <QuestionCard question={q} onAnswer={handleAnswer} />
  
  // Question palette
  <QuestionPalette questions={questions} selected={currentQuestion} />
  ```

### 4.4 Negative Marking System
- [ ] Define negative marks per wrong answer (e.g., -0.25 per wrong)
- [ ] Calculate score: (correct * 1) - (wrong * negativeMarks) + (unanswered * 0)
- [ ] Display calculation breakdown in results
- [ ] **Formula**: 
  ```
  Score = (Correct × 1) - (Wrong × negativeMarking) 
  Percentage = (Score / Total × 1) × 100
  ```
- **Implementation Notes**:
  - Store negativeMarking value with exam
  - Calculate on exam submission
  - Show formula in results page

### 4.5 Results & Score Display
- [ ] Show final score
- [ ] Show negative marks breakdown
- [ ] Show percentage
- [ ] Show time taken
- [ ] Question-by-question review
- [ ] Correct/incorrect/unanswered indicator

---

## 📊 PHASE 5: STUDENT ANALYTICS - DAILY/WEEKLY/MONTHLY NEGATIVE MARK TRACKER (Week 6-7)

### 5.1 Daily/Weekly/Monthly Negative Mark Tracker ⭐ **NEW**
The most requested feature - detailed negative marking analytics!

**Daily Tracking:**
- [ ] Group exams by date
- [ ] Show daily negative mark percentage
- [ ] Count exams per day
- [ ] Display all scores for that day
- [ ] Visual progress bar per day
- **Formula**: (Total Negative Marks / Total Questions) × 100

**Weekly Tracking:**
- [ ] Group exams by week (Sunday-Saturday)
- [ ] Calculate weekly negative mark percentage
- [ ] Show daily breakdown within week
- [ ] Identify best/worst days in week
- [ ] Week-over-week comparison
- **Features**:
  ```
  Week of Apr 1 - Apr 7
  Exams: 5 | Questions: 50 | Negative Marks: 12.5
  Negative Mark %: 25%
  
  Daily breakdown:
  Mon Apr 1: 20%  📊 Bar graph
  Tue Apr 2: 28%  📊
  Wed Apr 3: 15%  📊 ← Best day
  Thu Apr 4: 35%  📊 ← Worst day
  ```

**Monthly Tracking:**
- [ ] Group exams by calendar month
- [ ] Track month-over-month improvement
- [ ] Show improvement % (positive = getting better)
- [ ] Weekly breakdown within month
- [ ] Monthly comparison graph
- **Example**:
  ```
  March 2026: 32% negative marks
  April 2026: 28% negative marks
  Improvement: +4% ✓ (You improved!)
  ```

**Implementation:**
- [ ] Create types: `NegativeMarkStats`, `DailyAnalytics`, `WeeklyAnalytics`, `MonthlyAnalytics`
- [ ] Create utilities: `calculateDailyAnalytics()`, `calculateWeeklyAnalytics()`, `calculateMonthlyAnalytics()`
- [ ] Create component: `NegativeMarkTracker.tsx` with tabs (Daily/Weekly/Monthly)
- [ ] Create API: `GET /api/analytics/negative-marks?period=daily|weekly|monthly`
- [ ] Add charts using Recharts (trend lines)
- [ ] Show insights (average, trend direction, pattern analysis)

**Files Created:**
```
✅ src/types/index.ts - Added analytics types
✅ src/lib/utils/analyticsHelpers.ts - Analytics calculation functions
✅ src/components/exam/NegativeMarkTracker.tsx - Main tracker component
✅ app/api/analytics/negative-marks/route.ts - API endpoint
```

**Usage Example:**
```typescript
// Get all data
const dashboard = buildPerformanceDashboard(userId, userName, allResults)

// Display daily
dashboard.daily.forEach(day => {
  console.log(`${day.date}: ${day.negativeMarkPercentage}%`)
})

// Display weekly
dashboard.weekly.forEach(week => {
  console.log(`Week ${week.weekStart}: ${week.negativeMarkPercentage}%`)
})

// Display monthly
dashboard.monthly.forEach(month => {
  console.log(`${month.month}/${month.year}: ${month.negativeMarkPercentage}%`)
})

// Display in component
<NegativeMarkTracker dashboard={dashboard} />
```

### 5.2 Student Performance Tracking
- [ ] Negative marking percentage (per exam) ✅ **In tracker**
- [ ] Daily analytics (exams taken, avg score) ✅ **In tracker**
- [ ] Weekly analytics (best exam, worst exam) ✅ **In tracker**
- [ ] Monthly analytics (total exams, trends) ✅ **In tracker**
- [ ] Overall performance dashboard ✅ **In tracker**
- **Implementation Notes**:
  ```typescript
  // Utilities already created in analyticsHelpers.ts
  const overall = calculateNegativeMarkStats(results)
  const daily = calculateDailyAnalytics(results)
  const weekly = calculateWeeklyAnalytics(results)
  const monthly = calculateMonthlyAnalytics(results)
  ```

### 5.3 Student Dashboard
- [ ] Enrolled courses
- [ ] Completed exams
- [ ] Performance graph (chart) - use `NegativeMarkTracker`
- [ ] Quick stats (total attempts, avg score)
- [ ] Recent activity feed
- [ ] **Highlight**: Add negative mark tracker prominently
- **Implementation Notes**:
  - Use Chart.js or Recharts for graphs
  - Fetch user results from `/api/results`
  - Display time-filtered data
  - Integrate `NegativeMarkTracker` component

### 5.4 Profile Page
- [ ] User information
- [ ] Edit profile
- [ ] Change password
- [ ] View enrollment history
- [ ] View negative mark statistics
- [ ] Download certificates (optional)

---

## 🏆 PHASE 6: LEADERBOARD (Week 7)

### 6.1 Leaderboard System
- [ ] Rank students by total score
- [ ] Global leaderboard (all students)
- [ ] Course-specific leaderboard
- [ ] Filter by time period (this week, this month, all-time)
- [ ] Display: rank, name, score, performance
- **Implementation Notes**:
  ```typescript
  // Get top 100 students
  const leaderboard = await prisma.examResult.groupBy({
    by: ['userId'],
    _sum: { score: true },
    _count: { id: true },
    take: 100,
    orderBy: { _sum: { score: 'desc' } }
  })
  ```

### 6.2 Leaderboard UI
- [ ] Rank badge (1st, 2nd, 3rd with colors)
- [ ] Student name & score
- [ ] Performance indicator (trend up/down)
- [ ] Responsive table design
- [ ] Your rank highlighting (if user logged in)

---

## 📤 PHASE 7: FILE UPLOADS (Week 8)

### 7.1 Student Attachment Uploads
- [ ] File upload input
- [ ] File type validation (.pdf, .doc, .jpg, .png)
- [ ] File size limit (10MB max)
- [ ] Store file path in database
- [ ] Associate with user account
- **Implementation Notes**:
  ```typescript
  // Endpoint: POST /api/uploads
  const file = req.file
  const filename = `${Date.now()}-${file.originalname}`
  await fs.promises.writeFile(`public/uploads/${filename}`, file.buffer)
  ```

### 7.2 Upload Management
- [ ] List user's uploads
- [ ] Delete uploads
- [ ] Download uploads
- [ ] View upload history

---

## 🎨 PHASE 8: POLISH & OPTIMIZATION (Week 8-9)

### 8.1 Performance
- [ ] Image optimization (next/image)
- [ ] Code splitting
- [ ] Lazy loading components
- [ ] Database query optimization
- [ ] Caching strategy (SWR/React Query)

### 8.2 Mobile Responsiveness
- [ ] Test all pages on mobile
- [ ] Touch-friendly buttons
- [ ] Mobile navigation menu
- [ ] Readable text sizes

### 8.3 SEO
- [ ] Meta tags (title, description)
- [ ] Open Graph tags (social sharing)
- [ ] Sitemap
- [ ] robots.txt

### 8.4 Error Handling
- [ ] Try-catch in API routes
- [ ] User-friendly error messages
- [ ] Error logging
- [ ] 404 page

---

## 🔒 PHASE 9: SECURITY & ADMIN (Week 9-10)

### 9.1 Admin Dashboard
- [ ] View all students
- [ ] View all courses
- [ ] View enrollment requests
- [ ] Verify payments manually
- [ ] Export data (CSV)
- [ ] System analytics

### 9.2 Security
- [ ] Rate limiting on API
- [ ] Input sanitization
- [ ] SQL injection prevention (use ORM)
- [ ] XSS protection
- [ ] CORS configuration
- [ ] Environment variables

### 9.3 Validation
- [ ] Form validation (client + server)
- [ ] File upload validation
- [ ] Authentication checks on protected routes

---

## 📋 QUICK REFERENCE: Common Tasks

### Add a New API Endpoint
```typescript
// app/api/[feature]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ data: [] })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### Create a New Component
```typescript
// src/components/[feature]/NewComponent.tsx
import React from 'react'

interface Props {
  // Your props
}

export const NewComponent: React.FC<Props> = ({ }) => {
  return <div>Component</div>
}
```

### Add a New Type
```typescript
// src/types/newType.ts
export interface NewType {
  id: string
  name: string
  createdAt: Date
}
```

### Fetch Data in Component
```typescript
'use client'
import useSWR from 'swr'

export default function Component() {
  const { data, error, isLoading } = useSWR('/api/endpoint')
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  
  return <div>{data?.name}</div>
}
```

---

## 🎯 Development Tips

1. **Start Simple**: Build MVP first, add features later
2. **Test Frequently**: Test each feature before moving on
3. **Use TypeScript**: Catch errors early
4. **Keep Components Small**: Max 200 lines per component
5. **DRY Principle**: Don't repeat code, create reusable components
6. **Commit Often**: Small, meaningful commits
7. **Document Complex Logic**: Add comments for business logic
8. **Use Git Branches**: Feature branches → develop → staging → main

---

## 🚀 Deployment Checklist

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Images optimized
- [ ] Mobile responsive verified
- [ ] Analytics integrated
- [ ] Error tracking setup (Sentry)
- [ ] Backup strategy ready

---

> **Remember**: Quality over quantity. Build incrementally. Listen to feedback. Scale when needed.
