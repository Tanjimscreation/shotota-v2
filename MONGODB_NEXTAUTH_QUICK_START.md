# 🚀 MongoDB + NextAuth Quick Start

## ⚡ 5-Minute Setup

### 1. Get MongoDB Connection String
```
Go to: https://www.mongodb.com/cloud/atlas
→ Create free cluster
→ Copy connection string
```

### 2. Add to .env.local
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
MONGODB_URI="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/shotota-v2?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install Packages
```bash
npm install next-auth@5 bcryptjs
npm install @types/bcryptjs -D
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Create collections in MongoDB
npx prisma db push

# Verify with Prisma Studio
npx prisma studio
```

### 5. Test
```bash
npm run dev
# Visit http://localhost:3000
```

---

## 📋 What's Configured

✅ **MongoDB Atlas** - Cloud database  
✅ **Prisma ORM** - Database queries  
✅ **NextAuth.js** - Authentication  
✅ **Credentials Provider** - Email/password login  
✅ **Password Hashing** - bcryptjs  
✅ **JWT Sessions** - Secure tokens  
✅ **User Roles** - STUDENT, ADMIN  

---

## 🔐 Files Created

```
✅ .env.example (updated)
✅ prisma/schema.prisma (complete MongoDB schema)
✅ src/lib/db/client.ts (Prisma client)
✅ app/api/auth/[...nextauth]/route.ts (NextAuth config)
✅ app/api/auth/signup/route.ts (User registration)
✅ docs/MONGODB_SETUP.md (detailed guide)
```

---

## 📊 Database Models

All these collections are auto-created:

```
User          (users, accounts, sessions)
Course        (courses, enrollments)
Exam          (exams, questions)
ExamResult    (examresults)
Upload        (uploads)
Leaderboard   (leaderboardentries)
```

---

## 🧪 Test the Setup

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'
```

### Expected Response
```json
{
  "message": "User created successfully",
  "user": {
    "id": "cuid123...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "STUDENT"
  }
}
```

---

## 🎯 Next Steps

1. **Create Login Page** - `app/(auth)/login/page.tsx`
2. **Create Signup Page** - `app/(auth)/signup/page.tsx`
3. **Protected Routes** - Add middleware
4. **Student Dashboard** - Create dashboard pages
5. **Admin Panel** - Create admin pages

---

## 💡 Usage in Components

### Check if User is Logged In
```typescript
'use client'
import { useSession } from 'next-auth/react'

export default function Page() {
  const { data: session } = useSession()
  
  if (!session) return <p>Not logged in</p>
  
  return <p>Hello, {session.user.name}</p>
}
```

### Make Authenticated API Call
```typescript
const response = await fetch('/api/user/profile', {
  headers: {
    Authorization: `Bearer ${session?.user?.id}`
  }
})
```

### Get Session in Server Component
```typescript
import { getServerSession } from 'next-auth'
import { handler } from '@/app/api/auth/[...nextauth]/route'

export default async function Page() {
  const session = await getServerSession(handler)
  
  if (!session) return <p>Not logged in</p>
  
  return <p>Hello, {session.user.name}</p>
}
```

---

## 🔗 Resources

- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [NextAuth.js Docs](https://next-auth.js.org/getting-started/introduction)
- [Prisma MongoDB Guide](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [bcryptjs Docs](https://github.com/dcodeIO/bcrypt.js)

---

## ❓ Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB URI in .env.local
- Whitelist your IP in MongoDB Atlas
- Verify internet connection

### "Prisma client not found"
```bash
npx prisma generate
```

### "Collections not created"
```bash
npx prisma db push
```

### "NextAuth not working"
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies

---

**All set! Your MongoDB + NextAuth system is ready to go!** 🎉
