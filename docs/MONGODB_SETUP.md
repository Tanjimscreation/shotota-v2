# 🚀 MongoDB + NextAuth Setup Guide

Your project is now configured to use **MongoDB** and **NextAuth.js** for authentication!

## ✅ Setup Checklist

### Step 1: Get MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project
4. Create a cluster
5. Get your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shotota-v2?retryWrites=true&w=majority
   ```

### Step 2: Update Environment Variables
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your actual values:
MONGODB_URI="mongodb+srv://your-user:your-password@cluster0.xxxxx.mongodb.net/shotota-v2?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Install Required Packages
```bash
npm install next-auth@5 bcryptjs
npm install @types/bcryptjs -D

# Verify Prisma is installed
npm install @prisma/client prisma
```

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Push Schema to MongoDB
```bash
# This creates the database collections
npx prisma db push
```

### Step 6: Open Prisma Studio (Optional)
```bash
# View/manage your data visually
npx prisma studio
```

### Step 7: Test the Setup
```bash
npm run dev
# Visit http://localhost:3000
```

---

## 📁 Files Created/Updated

| File | Purpose |
|------|---------|
| `.env.example` | ✅ Updated with MongoDB & NextAuth vars |
| `prisma/schema.prisma` | ✅ MongoDB schema with all models |
| `src/lib/db/client.ts` | ✅ Prisma client initialization |
| `app/api/auth/[...nextauth]/route.ts` | ✅ NextAuth configuration |

---

## 🔐 How Authentication Works

### Registration (Sign Up)
```typescript
// POST /api/auth/register
{
  "email": "student@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}

// Server hashes password with bcrypt and saves to MongoDB
```

### Login
```typescript
// Uses NextAuth credentials provider
// POST /api/auth/callback/credentials
{
  "email": "student@example.com",
  "password": "SecurePass123"
}

// Returns session with JWT token
```

### Protected Routes
```typescript
'use client'
import { useSession } from 'next-auth/react'

export default function Dashboard() {
  const { data: session } = useSession()
  
  if (!session) {
    return <p>Please login</p>
  }
  
  return <p>Welcome, {session.user.name}</p>
}
```

---

## 🛠️ Common Commands

```bash
# Generate Prisma types after schema changes
npx prisma generate

# Push schema to MongoDB (creates collections)
npx prisma db push

# Open Prisma Studio (visual database editor)
npx prisma studio

# Create a migration (not needed for MongoDB, but good practice)
npx prisma migrate dev --name init

# Reset database (deletes all data)
npx prisma db push --force-reset
```

---

## 📊 MongoDB Structure

Your MongoDB database will have these collections:

```
shotota-v2 (Database)
├── users
├── accounts
├── sessions
├── verificationtokens
├── courses
├── enrollments
├── exams
├── questions
├── examresults
├── uploads
└── leaderboardentries
```

---

## 🎯 Next Steps

1. **✅ Environment Setup Complete**
2. **Create Signup API** (`app/api/auth/signup/route.ts`)
3. **Create Login Page** (`app/(auth)/login/page.tsx`)
4. **Create Signup Page** (`app/(auth)/signup/page.tsx`)
5. **Protect Routes** with NextAuth middleware

---

## 🚨 Important Notes

### Password Security
- All passwords are hashed with bcrypt before storage
- Never store plain passwords!
- `bcrypt.compare()` safely compares hashed passwords

### Session Security
- JWT tokens expire after configured time
- `NEXTAUTH_SECRET` should be random & long
- Change it before production!

### MongoDB Security
- Use strong passwords for MongoDB
- Whitelist your IP in MongoDB Atlas
- Never commit `.env.local` to git (it's in `.gitignore`)

---

## 🔗 Quick Links

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Prisma Docs](https://www.prisma.io/docs)
- [bcryptjs Docs](https://github.com/dcodeIO/bcrypt.js)

---

## ✨ Example: Create Admin User

```bash
# Open Prisma Studio
npx prisma studio

# Go to User model
# Click "Add record"
# Fill in:
# - email: admin@shotota.com
# - password: (hash manually or use API)
# - name: Admin User
# - role: ADMIN
```

Or via API (we'll create this):

```typescript
// app/api/auth/signup/route.ts
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/client'

export async function POST(request: Request) {
  const { email, password, name } = await request.json()

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'STUDENT',
    },
  })

  return Response.json(user)
}
```

---

## 🎉 You're Ready!

MongoDB + NextAuth is fully configured. 

**Next**: Create authentication pages and test the flow!
