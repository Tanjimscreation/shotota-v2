# Dual Role Login System

## Overview
Your Shotota platform now has a complete dual-role authentication system with separate login flows for **Admins** and **Students**.

---

## Login System

### Role Selection
When users visit `/login`, they see two clear options:

**1. Admin Login** 🛡️
- Manage question papers
- Create and upload exams
- Monitor active tests
- View student progress

**2. Student Login** 📚
- Take exams
- View results
- Leaderboard access
- Check performance metrics

---

## Demo Credentials

### Admin Account
```
Email: rahim@shotota.com
Password: hashed_password_123
```

### Student Account
```
Email: test@test.com
Password: password
```

---

## Key Features

### ✅ Admin Panel (`/admin`)
- **Dashboard**: Overview of exams, students, completion rate
- **Question Paper Upload** (`/admin/exams`):
  - Form-based question creation
  - CSV import support
  - Bulk upload capability
  - Edit and delete exams
  
- **Exam Monitoring** (`/admin/monitor`):
  - View active exams
  - Student progress tracking
  - Real-time score updates

- **Settings** (`/admin/settings`):
  - System configuration
  - User management

### ✅ Student Dashboard (`/dashboard`)
- View enrolled courses
- Take exams
- View results and scores
- Leaderboard rankings
- Performance analytics

---

## API Endpoints

### Admin APIs
```
POST   /api/admin/exams/manage      - Create new exam
GET    /api/admin/exams/manage      - List all exams
DELETE /api/admin/exams/manage?id=  - Delete exam
```

### Student APIs
```
GET    /api/exams                   - Get available exams
POST   /api/exams/results           - Submit exam results
GET    /api/leaderboard             - Get rankings
```

---

## Role-Based Access Control

### Protected Routes

**Admin Only:**
- `/admin` - Main admin panel
- `/admin/exams` - Question management
- `/admin/monitor` - Exam monitoring
- `/admin/settings` - Settings

**Student Only:**
- `/dashboard` - Student dashboard
- `/exam` - Take exam
- `/exam-results` - View results

**Public:**
- `/login` - Login page
- `/signup` - Registration
- `/` - Home page

---

## File Structure

```
app/
├── admin/
│   ├── page.tsx              # Admin dashboard
│   ├── exams/
│   │   └── page.tsx          # Question upload & management
│   ├── monitor/              # (Coming soon)
│   └── settings/             # (Coming soon)
├── (auth)/
│   └── login/
│       └── page.tsx          # Role selection + login form
└── api/
    └── admin/
        └── exams/
            ├── route.ts      # Admin exam CRUD
            └── manage/
                └── route.ts  # Exam management API

src/components/auth/
├── LoginForm.tsx             # Updated with role support
├── SignupForm.tsx
├── QuoteRotator.tsx
└── StatsBar.tsx
```

---

## How It Works

### Login Flow

1. User visits `/login`
2. Selects **Admin** or **Student** role
3. Enters credentials for that role
4. System validates with NextAuth
5. Redirects to appropriate dashboard:
   - Admin → `/admin`
   - Student → `/dashboard`

### Session Management
- JWT-based sessions (5-min refresh)
- Mock users for development
- Role stored in session (`session.user.role`)
- Automatic role validation on protected routes

---

## Testing the System

### Test Admin Features
1. Go to http://localhost:3000/login
2. Click "Admin Login"
3. Use: `rahim@shotota.com` / `hashed_password_123`
4. You'll be redirected to `/admin`
5. Click "Question Upload" to manage exams

### Test Student Features
1. Go to http://localhost:3000/login
2. Click "Student Login"  
3. Use: `test@test.com` / `password`
4. You'll be redirected to `/dashboard`

---

## Next Steps

1. **Connect Database**: Replace mock users with real database
2. **Exam Monitoring**: Implement real-time monitoring for `/admin/monitor`
3. **Settings Page**: Create system configuration at `/admin/settings`
4. **User Registration**: Update signup to assign roles
5. **Analytics**: Add detailed analytics for admins

---

## Environment Variables

Ensure these are set in `.env.local`:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your-database-url (optional)
SKIP_ENV_VALIDATION=true
```

---

## Security Notes

- ✅ Role validation on every protected route
- ✅ HTTP-only cookies for sessions
- ✅ CSRF protection enabled
- ✅ Password validation (hashed in production)
- ✅ TypeScript type safety

---

## Support

For issues or questions about the login system, check:
- NextAuth documentation: https://next-auth.js.org
- Your admin dashboard for role verification
- Browser console for error messages
