# Phase 7: Database Migration - Setup Instructions

## Quick Start (3 Steps)

### Step 1: Start PostgreSQL Database
```bash
# Using Docker (recommended)
docker-compose up -d

# Or use the automated script
bash scripts/migrate-db.sh
```

### Step 2: Run Migration
```bash
# Create and run migrations
npx prisma migrate deploy

# Or use npm command
npm run db:migrate
```

### Step 3: Seed Database
```bash
# Populate with mock data
npm run db:seed
```

## Detailed Setup Guide

### For Local Development (Docker)

1. **Install Docker** (if not already installed)
   - macOS: Download from https://www.docker.com/products/docker-desktop
   - Linux: `curl -fsSL https://get.docker.com | sh`

2. **Start PostgreSQL Container**
   ```bash
   docker-compose up -d
   ```
   This will:
   - Create PostgreSQL 16 container named `shotota_postgres`
   - Set up database: `shotota_db`
   - Expose on port 5432
   - Create persistent volume for data

3. **Verify Connection**
   ```bash
   npx prisma db execute --stdin < prisma/migrations/0_init/migration.sql
   ```

4. **Run Migration**
   ```bash
   npm run db:migrate
   ```

5. **Seed Database**
   ```bash
   npm run db:seed
   ```

6. **View Database (Prisma Studio)**
   ```bash
   npx prisma studio
   # Opens at http://localhost:5555
   ```

### For Cloud Deployment

1. **Create PostgreSQL Database** on your cloud provider:
   - AWS RDS
   - Heroku Postgres
   - DigitalOcean Managed Databases
   - Railway
   - Render

2. **Get Connection String**
   ```
   postgresql://user:password@host:port/database
   ```

3. **Update .env.local**
   ```env
   DATABASE_URL="postgresql://user:password@host:port/shotota_db"
   ```

4. **Run Migration**
   ```bash
   npm run db:migrate
   ```

5. **Seed Database** (optional for production)
   ```bash
   npm run db:seed
   ```

## Database Schema Overview

### Core Tables
- **User** - Student accounts (email, password, batch, role)
- **Course** - Learning courses (title, instructor, category, lessons)
- **Exam** - Assessments (duration, questions, passing score)
- **Question** - MCQ questions (4 options A-D, explanation)
- **ExamResult** - Student scores (answers, percentage, time)
- **LeaderboardEntry** - Rankings (score, streak, batch)
- **Enrollment** - Course access (payment status, progress)

### Auth Tables
- **Account** - NextAuth OAuth accounts
- **Session** - User sessions
- **VerificationToken** - Email verification

### Storage Tables
- **Upload** - User file uploads

## Seed Data Included

### Users (5 Students)
1. আবদুর রহিম (MBBS-2025)
2. মোহাম্মদ করিম (MBBS-2025)
3. নাজমা আক্তার (MBBS-2026)
4. সারা খান (MBBS-2026)
5. আলী হোসেন (MBBS-2025)

### Courses (3)
1. সাধারণ জীববিজ্ঞান - ১ (Biology)
2. অর্গানিক রসায়ন মৌলিক (Chemistry)
3. পদার্থবিজ্ঞানের ভিত্তি (Physics)

### Exam (1)
- জীববিজ্ঞান প্রথম পরীক্ষা (Biology Quiz)
  - 5 MCQ questions
  - 30 minute duration
  - All questions in Bangla with explanations

### Results (2 Sample)
- User 1: 80% (4/5 correct)
- User 2: 60% (3/5 correct)

## Useful Commands

```bash
# Prisma commands
npm run db:generate   # Regenerate Prisma client
npm run db:migrate    # Run pending migrations
npm run db:seed       # Run seed script
npm run db:push       # Push schema without migrations

# Database tools
npx prisma studio    # Open Prisma Studio (GUI)
npx prisma db execute --stdin < queries.sql  # Run SQL

# Docker commands
docker-compose up -d   # Start containers
docker-compose down    # Stop containers
docker-compose logs    # View logs
docker exec shotota_postgres psql -U postgres -d shotota_db  # Access DB
```

## Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"
**Solution:** Ensure `.env.local` has `DATABASE_URL` defined and file is in project root.

```bash
cat .env.local | grep DATABASE_URL
```

### Error: "ECONNREFUSED: Connection refused"
**Solution:** PostgreSQL not running. Start Docker container:
```bash
docker-compose up -d
docker-compose logs postgres  # Check status
```

### Error: "FATAL: password authentication failed"
**Solution:** Check credentials in `.env.local`:
```env
# Default credentials in docker-compose.yml
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shotota_db"
```

### Error: "relation 'User' does not exist"
**Solution:** Run migration first:
```bash
npm run db:migrate
```

### Error: "Port 5432 already in use"
**Solution:** Stop existing database or change port:
```bash
# Kill process on port 5432
lsof -i :5432 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port in docker-compose.yml and .env.local
```

### Error: "too many clients for database"
**Solution:** Increase connection limit in `.env.local`:
```env
# Add connection pool settings
DATABASE_URL="postgresql://user:pass@host/db?connection_limit=5"
```

## Monitoring Database

### Via Prisma Studio
```bash
npx prisma studio
# Interactive GUI at http://localhost:5555
```

### Via psql (Command Line)
```bash
# Connect to database
docker exec -it shotota_postgres psql -U postgres -d shotota_db

# List tables
\dt

# View users
SELECT id, email, name, batch FROM "User";

# View exam results
SELECT * FROM "ExamResult";

# Exit
\q
```

### Via Docker Logs
```bash
docker-compose logs -f postgres  # Follow logs
docker-compose logs postgres --tail 50  # Last 50 lines
```

## Next Steps

After successful database setup:
1. **Phase 8:** Implement Zustand state management
2. **Phase 9:** Build mobile-responsive layouts
3. **Phase 10:** Final Polish & Deployment

See [PHASE7_MIGRATION.md](PHASE7_MIGRATION.md) for detailed schema documentation.
