# Connecting Neon Database to VS Code

## PostgreSQL Extension Installed ✅

You now have the **PostgreSQL** extension installed. Here's how to connect to your Neon database:

### Step 1: Open the Extension
1. Click the **PostgreSQL** icon in the left sidebar (looks like an elephant icon)
2. Or press `Ctrl+Shift+P` and search for "PostgreSQL"

### Step 2: Add Connection
Click the **"+"** button to add a new connection with these details:

**Connection Name:** `Shotota Neon`

**Connection Details:**
```
Host: ep-curly-hill-aoftua2s-pooler.c-2.ap-southeast-1.aws.neon.tech
Port: 5432
Database: neondb
User: neondb_owner
Password: npg_QiM9pbNELT4j
SSL Mode: require
```

### Step 3: Test Connection
Right-click the connection and select **"Connect"** to test it.

### Features Available:
- ✅ View all tables and schemas
- ✅ Run SQL queries
- ✅ View table data
- ✅ Create/modify tables
- ✅ Execute scripts

### Verify Database Schema

Once connected, you should see these tables in the `public` schema:

**NextAuth Tables:**
- `Account` - Third-party login accounts
- `Session` - User sessions
- `VerificationToken` - Email verification
- `User` - User accounts

**Application Tables:**
- `Course` - Courses
- `Enrollment` - Course enrollments
- `Exam` - Exams
- `ExamResult` - Exam results
- `Question` - Exam questions
- `ExamQuestion` - Questions in exams
- `Answer` - Student answers
- `LeaderboardEntry` - Leaderboard data
- `WrongAnswer` - Wrong answers tracking
- `NegativeMarkTracker` - Negative marks
- `Upload` - File uploads

### Quick Queries to Run

Check if tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Count records:
```sql
SELECT 
  (SELECT COUNT(*) FROM "User") as users,
  (SELECT COUNT(*) FROM "Course") as courses,
  (SELECT COUNT(*) FROM "Exam") as exams;
```

Check users:
```sql
SELECT id, email, name, role FROM "User" LIMIT 10;
```

## Troubleshooting

**Connection Failed?**
- Verify the connection string is exactly as shown
- Check your Neon project credentials in console.neon.tech
- Ensure SSL mode is set to "require"

**Can't see tables?**
- The schema might not have been created yet
- Tables are created automatically on first app deployment
- Check Render build logs

## NextAuth Database Structure

Your NextAuth setup uses Prisma Adapter, which creates these tables automatically:

- **User** → Your user profiles
- **Account** → OAuth provider connections
- **Session** → Active login sessions
- **VerificationToken** → Email verification tokens

All sessions are stored in the database (not cookies), so they persist across server restarts.

---

Happy querying! 🚀
