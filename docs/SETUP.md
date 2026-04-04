# 🎬 Shotota V2 - Project Setup Instructions

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local

# 3. Setup database
npx prisma migrate dev --name init

# 4. Start development server
npm run dev

# App available at http://localhost:3000
```

---

## Initial Setup

### 1. Install Required Packages

```bash
npm install
```

**Already Included**:
- ✅ Next.js 16
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ESLint

**Additional Packages to Install**:

```bash
# Database & ORM
npm install @prisma/client prisma

# Authentication
npm install next-auth jsonwebtoken bcryptjs

# Forms & Validation
npm install react-hook-form zod

# HTTP Client
npm install axios swr

# Animations
npm install framer-motion

# Charts
npm install recharts

# File Parsing
npm install pdfjs-dist docx

# Icons
npm install react-icons

# UI Components (Optional but recommended)
npm install @radix-ui/react-dialog @radix-ui/react-popover

# Utilities
npm install clsx tailwind-merge date-fns

# Upload Handler
npm install next-auth multer

# Environment Variables
npm install dotenv
```

### 2. Setup Environment Variables

Create `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shotota"

# NextAuth (if using)
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# JWT Secret (if using custom auth)
JWT_SECRET="your-jwt-secret-key"

# Prisma
PRISMA_DATABASE_URL="postgresql://user:password@localhost:5432/shotota"

# File Upload
NEXT_PUBLIC_UPLOAD_DIR="/public/uploads"
MAX_FILE_SIZE=10485760

# bKash Details (Static for now)
NEXT_PUBLIC_BKASH_NUMBER="01XXX-XXX-XXX"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Setup Database

**Option A: PostgreSQL (Recommended)**

```bash
# Install PostgreSQL (macOS)
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Create database
createdb shotota

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://YOUR_USER:@localhost:5432/shotota"

# Run migrations
npx prisma migrate dev --name init

# Verify Prisma client
npx prisma generate
```

**Option B: SQLite (Quick Testing)**

```bash
# Update .env.local
DATABASE_URL="file:./dev.db"

# Run migrations
npx prisma migrate dev --name init
```

**Option C: MongoDB (NoSQL)**

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

### 4. Prisma Setup

Create `prisma/schema.prisma` with models from `docs/DATABASE.md`

```bash
# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI for database)
npx prisma studio

# Create migration
npx prisma migrate dev --name init

# Reset database (⚠️ Deletes all data)
npx prisma migrate reset
```

### 5. Create Prisma Client

Create `src/lib/db/client.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Project Structure Setup

All folders created. Verify:

```bash
tree src/ -L 2
```

Should show:
```
src/
├── components/
│   ├── admin/
│   ├── common/
│   ├── courses/
│   ├── exam/
│   ├── home/
│   └── leaderboard/
├── lib/
│   ├── db/
│   ├── services/
│   └── utils/
├── styles/
└── types/
```

---

## TypeScript Configuration

File: `tsconfig.json` (already configured)

Key settings:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Tailwind Configuration

File: `tailwind.config.ts` (already configured)

Add custom colors if needed:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
      },
    },
  },
}
```

---

## ESLint & Code Quality

File: `eslint.config.mjs` (already configured)

Run linting:

```bash
npm run lint

# Fix issues automatically
npm run lint -- --fix
```

---

## Git Configuration

Your branches are already set up:

```bash
git branch -a
# main      (production)
# develop   (development)
# staging   (pre-production)
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/course-management

# Make changes
git add .
git commit -m "feat: Add course management system"

# Push to develop
git push origin develop

# Create PR for review
# Merge to staging for testing
# Merge to main for production
```

---

## Running the Project

### Development

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Test Build

```bash
npm run build
npm run preview
```

---

## File Naming Conventions

Create consistent naming:

```bash
# Components (PascalCase)
src/components/courses/CourseCard.tsx
src/components/exam/QuestionCard.tsx

# Utilities (camelCase)
src/lib/utils/validators.ts
src/lib/services/courseService.ts

# Types (PascalCase)
src/types/course.ts
src/types/user.ts

# Pages (lowercase or index)
app/courses/page.tsx
app/courses/[id]/page.tsx
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Add new package
npm install package-name

# Uninstall package
npm uninstall package-name

# Start dev server
npm run dev

# Build project
npm run build

# Lint code
npm run lint

# Format code (if prettier installed)
npm run format

# Prisma commands
npx prisma migrate dev      # Create migration
npx prisma studio           # Open GUI
npx prisma generate         # Update client
npx prisma db push          # Push schema without migration
npx prisma db seed          # Seed data
```

---

## VS Code Extensions Recommended

Install these for better development:

1. **Tailwind CSS IntelliSense** - CSS class suggestions
2. **Prisma** - Prisma syntax highlighting
3. **TypeScript Vue Plugin** - TypeScript support
4. **ESLint** - Linting
5. **Prettier** - Code formatter
6. **Thunder Client** or **REST Client** - Test API

```bash
# Install extensions via CLI
code --install-extension bradlc.vscode-tailwindcss
code --install-extension Prisma.prisma
code --install-extension Vue.vscode-typescript-vue-plugin
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

---

## Troubleshooting

### Prisma Client Not Found
```bash
npx prisma generate
npm install @prisma/client
```

### Port 3000 Already in Use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Database Connection Error
```bash
# Verify DATABASE_URL in .env.local
# Test connection
npx prisma db execute --stdin < /dev/null
```

### TypeScript Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## Deployment Checklist

- [ ] Environment variables set in production
- [ ] Database migrations run
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Tests pass (if applicable)
- [ ] Images optimized
- [ ] Security headers configured
- [ ] Error logging setup
- [ ] Backup strategy ready

---

## Next Steps

1. ✅ Project structure created
2. ✅ Git branches setup
3. ⬜ Install packages (run `npm install` commands above)
4. ⬜ Setup database (PostgreSQL or SQLite)
5. ⬜ Create Prisma schema
6. ⬜ Start building features (see FEATURES.md)

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

---

## Questions?

Refer to:
- `docs/FILE_STRUCTURE.md` - Project organization
- `docs/FEATURES.md` - Development guide
- `docs/DATABASE.md` - Database schema
- `docs/API.md` - API documentation
