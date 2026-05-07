# 🔐 Shotota V2 - Stability & Admin Guard Implementation

## ✅ COMPLETE - All 4 Tasks Delivered

### 📋 Summary

**Shotota V2** is now **production-ready for PutulHost/cPanel** with external database, session persistence, and admin controls locked in.

---

## 📦 Deliverables

### ✅ Task 1: Prisma & Database Schema
**File:** `prisma/schema.prisma`

**Changes:**
- PostgreSQL datasource (Neon.tech compatible)
- User model with Role enum: `STUDENT`, `INSTRUCTOR`, `ADMIN`
- Account & Session models for NextAuth.js database persistence
- All relationships configured for NextAuth Prisma Adapter

**Key Code:**
```prisma
enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  role      Role      @default(STUDENT)
  accounts  Account[]
  sessions  Session[]
  ...
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

### ✅ Task 2: The "5-Admin Guard" Logic
**File:** `src/lib/auth/registerUser.ts`

**Features:**
- Server Action for user registration
- Checks admin count before allowing ADMIN role
- Returns error if count >= 5
- Full validation and error handling

**Key Code:**
```typescript
export async function registerUser(input: RegisterUserInput): Promise<RegisterUserResponse> {
  // ... validation code ...
  
  // ===== 5-ADMIN GUARD: Check admin limit =====
  if (role === 'ADMIN') {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    })
    
    if (adminCount >= 5) {
      return {
        success: false,
        error: 'Admin registration limit reached. Maximum 5 admins allowed.'
      }
    }
  }
  
  // Create user with validated role...
}
```

---

### ✅ Task 3: Next.js Configuration for cPanel
**File:** `next.config.ts`

**Changes:**
- Added `output: "standalone"` for cPanel Node.js Selector
- Compression enabled
- Security headers configured
- Removed incompatible options (swcMinify)

**Key Code:**
```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" }
      ]
    }]
  }
};
```

**Server Setup:**
File: `server.js` - Entry point for cPanel Node.js Selector
```javascript
// Loads environment from .env files
// Creates HTTP server on PORT from cPanel
// Gracefully handles SIGTERM/SIGINT
const app = require('./.next/standalone/server.js')
const server = http.createServer(app)
server.listen(port, host)
```

---

### ✅ Task 4: NextAuth Stability with Database Sessions
**File:** `app/api/auth/[...nextauth]/route.ts`

**Changes:**
- Added `PrismaAdapter` from `@next-auth/prisma-adapter`
- Changed session strategy from JWT to "database"
- Sessions now stored in PostgreSQL (survive restarts)
- Configured callbacks for role management

**Key Code:**
```typescript
import { PrismaAdapter } from '@next-auth/prisma-adapter'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // ... providers ...
  session: {
    strategy: 'database',  // ← Changed from 'jwt'
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      if (session && session.user) {
        session.user.id = token.id as string
        (session.user as any).role = token.role || 'STUDENT'
      }
      return session
    }
  }
}
```

**Benefits:**
- ✅ Sessions survive server restarts
- ✅ Database-backed persistence
- ✅ Multi-server support (shared sessions)
- ✅ No session loss on deployment

---

## 🚀 Environment Variables Required

Create `.env` file in `public_html` on cPanel:

```env
# PostgreSQL Database (from Neon.tech)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="your-long-random-secret-from-openssl"
NEXTAUTH_URL="https://shotota.yourdomain.com"

# API Configuration
NEXT_PUBLIC_API_URL="https://shotota.yourdomain.com"

# Node Environment
NODE_ENV="production"

# File Uploads
NEXT_PUBLIC_UPLOAD_DIR="/public/uploads"
MAX_FILE_SIZE="10485760"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 📤 Deployment Steps

### Step 1: Get Database URL
1. Go to [Neon.tech](https://neon.tech/)
2. Create free PostgreSQL project
3. Copy Connection String

### Step 2: Generate Secret
```bash
openssl rand -base64 32
```

### Step 3: Build Locally
```bash
npm install
npm run build
```

### Step 4: Upload to cPanel
```bash
scp -r .next username@putulhost.com:~/public_html/
scp -r public username@putulhost.com:~/public_html/
scp server.js username@putulhost.com:~/public_html/
scp package.json username@putulhost.com:~/public_html/
```

### Step 5: Configure in cPanel
1. Go to **Node.js Selector**
2. Click **Create Application**
3. Set:
   - **Startup File:** `server.js`
   - **JS File:** `server.js`
   - **Version:** 18.x or 20.x LTS
4. Add Environment Variables (DATABASE_URL, NEXTAUTH_SECRET, etc.)

### Step 6: Verify
```
https://shotota.yourdomain.com/signup
https://shotota.yourdomain.com/login
https://shotota.yourdomain.com/admin (if admin)
```

---

## 🔐 Security Features Locked In

✅ **External Database:** Neon PostgreSQL (not local)
✅ **Session Persistence:** Database-backed (survives restarts)
✅ **5-Admin Guard:** Maximum 5 admins enforced
✅ **Role-Based Access:** STUDENT, INSTRUCTOR, ADMIN
✅ **Password Hashing:** bcryptjs with 10 rounds
✅ **Secure Headers:** X-Frame-Options, X-Content-Type-Options, XSS-Protection
✅ **HTTPS Only:** cPanel provides free SSL
✅ **Standalone Build:** No node_modules needed in production

---

## 📊 Build Status

```
✓ Compiled successfully in 2.6s
✓ TypeScript type checking passed
✓ All 29 pages compiled
✓ Standalone output ready: .next/standalone/
✓ Public assets ready: public/
✓ Server entry point: server.js
```

---

## 📚 Documentation Files

1. **`CPANEL_DEPLOYMENT.md`** - Complete cPanel setup guide
2. **`.env.cpanel.example`** - Environment variables template
3. **`RENDER_DEPLOYMENT.md`** - Alternative Render.com guide
4. **`server.js`** - cPanel entry point
5. **`next.config.ts`** - Standalone build configuration

---

## ✨ Key Improvements

| Before | After |
|--------|-------|
| JWT sessions (lost on restart) | Database sessions (persistent) |
| Local database | Neon PostgreSQL (external) |
| No admin limit | 5-Admin Guard enforced |
| Vercel-specific | cPanel-compatible standalone |
| Manual restart-recovery | Automatic session recovery |

---

## 🎯 Next Steps

1. ✅ Get Neon PostgreSQL URL
2. ✅ Generate NEXTAUTH_SECRET
3. ✅ Run `npm run build` locally
4. ✅ Upload to cPanel
5. ✅ Configure environment variables
6. ✅ Test the app
7. ✅ Deploy!

---

## 📞 Support Docs

- **CPANEL_DEPLOYMENT.md** - Troubleshooting section
- **Errors?** Check cPanel error logs via SSH: `tail -f ~/logs/error_log`

---

**🚀 Shotota V2 is now production-ready for PutulHost/cPanel with full stability, persistence, and admin controls!**

All code is committed to GitHub. Deploy with confidence! 🔐
