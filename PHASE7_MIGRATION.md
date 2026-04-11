# Phase 7: Database Migration (MongoDB → PostgreSQL)

## Status: ✅ MIGRATION READY

All schema updates completed. Database can now be deployed to PostgreSQL.

## What Changed

### Datasource
- **Before:** MongoDB (Atlas)
- **After:** PostgreSQL (local or cloud)

### Schema Updates
1. **Removed MongoDB-specific decorators:** All `@map("_id")` removed
2. **User Model:** Added `batch` field (String?) for student batch tracking
3. **Course Model:** 
   - Added `lessons` field (Int @default(0))
   - Duration changed to measure in weeks
4. **Question Model:** 
   - Changed from `options: Option[]` array to individual fields
   - Added: `optionA`, `optionB`, `optionC`, `optionD` (String)
   - Added: `explanation` (String) for Bangla explanations
5. **Enrollment Model:**
   - Made payment fields optional with default empty strings
   - `bkashNumber`, `transactionId`, `paymentProof` all nullable
6. **LeaderboardEntry Model:**
   - Added `batch` field (String @default("সবাই"))
   - Added `streak` field (Int @default(0)) for consecutive activity tracking

## Database Setup

### Option 1: Docker (Recommended)
```bash
# Start PostgreSQL container
docker-compose up -d

# Run migration
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

### Option 2: Local PostgreSQL
```bash
# Ensure PostgreSQL is running on localhost:5432
psql -U postgres -c "CREATE DATABASE shotota_db;"

# Run migration
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

### Option 3: Cloud PostgreSQL
```bash
# Update .env.local with cloud database URL
DATABASE_URL="postgresql://user:password@host:5432/shotota_db"

# Run migration
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

## Available Commands

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with mock data
npm run db:seed

# Push schema changes (without migration history)
npm run db:push

# View database in Prisma Studio
npx prisma studio
```

## Seed Data Included

The seed script creates:
- **5 Students:** Different batches (MBBS-2025, MBBS-2026)
- **3 Courses:** Biology, Chemistry, Physics
- **1 Exam:** Biology MCQ (5 questions in Bangla)
- **2 Exam Results:** Sample scores (80%, 60%)
- **5 Leaderboard Entries:** Rankings with streaks and batches

## Database Schema

### Tables Created
- `User` - Student accounts with batch tracking
- `Course` - Courses with lessons count
- `Enrollment` - Course enrollments with payment tracking
- `Exam` - Exams with negative marking rules
- `Question` - MCQ questions with 4 options + explanations
- `ExamResult` - Student exam results with scores
- `LeaderboardEntry` - Rankings with batch and streak data
- `Upload` - File uploads (future expansion)
- `Account` - NextAuth sessions
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

### Key Indexes
- User: email (unique), role
- Course: category, instructor
- Enrollment: userId, courseId, paymentStatus (unique combination)
- ExamResult: userId, examId (unique combination), createdAt
- LeaderboardEntry: rank, totalScore, batch

## Next Steps (Phase 8)

After migration is complete:
1. Update API routes to use Prisma client
2. Implement Zustand state management
3. Connect frontend forms to database
4. Add authentication flow
5. Implement real exam submission and results

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shotota_db"
```

## Files Modified/Created

- `prisma/schema.prisma` - Updated schema (PostgreSQL)
- `prisma/seed.ts` - Seed script with mock data
- `.env.local` - Updated DATABASE_URL
- `docker-compose.yml` - PostgreSQL container config
- `prisma/migrations/0_init/migration.sql` - Initial schema migration
- `package.json` - Added prisma seed config

## Troubleshooting

### Port 5432 Already in Use
```bash
# Kill existing process
lsof -i :5432 | grep -i listen | awk '{print $2}' | xargs kill -9
```

### Database Connection Failed
- Check DATABASE_URL in .env.local
- Verify PostgreSQL is running
- Check credentials are correct

### Migration Failed
```bash
# Reset and try again
npx prisma migrate reset

# Or manually run migration
npx prisma migrate deploy
```

### Seed Data Issues
```bash
# Verify seed script
npx ts-node prisma/seed.ts

# Or use npm command
npm run db:seed
```
