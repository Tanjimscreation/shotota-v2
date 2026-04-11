# Phase 7: Database Migration Complete

## Migration Summary

### Schema Changes:
- **Datasource**: Changed from MongoDB to PostgreSQL  
- **Architecture**: Removed all MongoDB-specific decorators (@map("_id"))
- **Models Updated**: All 8 data models migrated

### Key Model Changes:

#### User Model
- Added `batch` field (String?, stores MBBS-2025, MBBS-2026, etc.)
- Removed MongoDB ObjectId decorators

#### Course Model  
- Added `lessons` field (Int, default 0) - tracks lesson count
- Changed `duration` unit to weeks (from implicit)

#### Question Model
- **BREAKING**: Changed from `options` array to individual fields:
  - Removed: `type Option { label: String, value: String }`
  - Added: `optionA`, `optionB`, `optionC`, `optionD` (String)
- Added `explanation` field (String) - Bangla MCQ explanation text
- Added `order` field (Int) - question display order

#### Enrollment Model
- Made payment fields optional with defaults:
  - `bkashNumber`: String? @default("")
  - `transactionId`: String? @default("")
  - `paymentProof`: String? @default("")

#### LeaderboardEntry Model
- Added `batch` field (String @default("সবাই"))
- Added `streak` field (Int @default(0)) - consecutive days active

#### ExamResult Model
- All required fields added with types
- `answers` field uses JSONB (PostgreSQL JSON)

### Migration Files:
- **Location**: `prisma/migrations/0_init/migration.sql`
- **Status**: Ready to execute once PostgreSQL is set up
- **Size**: ~250 lines of SQL

### Setup Instructions:

1. **Install PostgreSQL** (if not already installed):
   ```bash
   brew install postgresql@15  # macOS
   ```

2. **Start PostgreSQL Service**:
   ```bash
   brew services start postgresql@15
   ```

3. **Create Database**:
   ```bash
   createdb shotota_db
   ```

4. **Run Migration**:
   ```bash
   npm run db:migrate
   # or
   npx prisma migrate deploy
   ```

5. **Seed Database** (Optional):
   ```bash
   npm run db:seed
   # or
   npx prisma db seed
   ```

### Next Steps:
- Update Next.js API routes to use Prisma Client (if not already done)
- Create environment variables for PostgreSQL connection
- Test database connectivity
- Run full build and test suite

### Notes:
- All existing MongoDB code references need updating to new schema
- Question rendering logic changed (must use optionA/B/C/D instead of array)
- No data migration needed (fresh development database)
