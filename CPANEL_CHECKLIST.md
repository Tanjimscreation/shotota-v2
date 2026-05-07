# ✅ SHOTOTA V2 - CPANEL DEPLOYMENT CHECKLIST

## 🎯 Pre-Deployment Checklist

### Your Tasks (Human Work)

- [ ] **Get Database URL from Neon.tech**
  - [ ] Visit https://neon.tech/
  - [ ] Create free PostgreSQL project
  - [ ] Copy connection string → Save as `DATABASE_URL`
  - [ ] Test connection: `psql your-connection-string`

- [ ] **Generate NextAuth Secret**
  - [ ] Run: `openssl rand -base64 32`
  - [ ] Copy output → Save as `NEXTAUTH_SECRET`
  - [ ] (Must be long and random)

- [ ] **Prepare Domain**
  - [ ] Get your PutulHost domain
  - [ ] Ensure you have cPanel access
  - [ ] Note the exact domain: `https://shotota.yourdomain.com`

---

## 🛠️ Build Phase (Local Machine)

- [ ] Clone/pull latest code from GitHub
- [ ] Run: `npm install`
- [ ] Run: `npm run build`
- [ ] Verify: `ls -la .next/standalone/` exists
- [ ] Verify: `ls -la .next/standalone/server.js` exists

**Build Output Should Show:**
```
✓ Compiled successfully in 2.6s
✓ Finished TypeScript
✓ All 29 pages compiled
```

---

## 📤 Upload Phase (cPanel)

### Via SSH (Recommended)

```bash
# Navigate to your home directory
cd ~

# Upload Next.js standalone build
scp -r /path/to/shotota-v2/.next public_html/

# Upload public folder
scp -r /path/to/shotota-v2/public public_html/

# Upload server entry point
scp /path/to/shotota-v2/server.js public_html/

# Upload package.json
scp /path/to/shotota-v2/package.json public_html/
```

### Via cPanel File Manager

1. Go to **File Manager**
2. Navigate to `public_html` folder
3. Upload these folders/files:
   - `.next` (entire folder)
   - `public` (entire folder)
   - `server.js` (file)
   - `package.json` (file)

---

## ⚙️ Configuration Phase (cPanel)

### Step 1: Node.js Selector

1. In cPanel, find **Node.js Selector** (under Software/Services)
2. Click **Create Application**

### Step 2: Application Settings

```
Application Mode:       Production
Node.js Version:        20.x LTS (or 18.x)
Application root:       public_html/
Application URL:        shotota (or subdomain)
Application startup file: server.js
Application JS file:    server.js
```

### Step 3: Environment Variables

In cPanel's **Environment Variables** section, add:

```
Key: DATABASE_URL
Value: postgresql://neondb_owner:password@host/database?sslmode=require

Key: NEXTAUTH_SECRET
Value: your-generated-secret-from-openssl-command

Key: NEXTAUTH_URL
Value: https://shotota.yourdomain.com

Key: NEXT_PUBLIC_API_URL
Value: https://shotota.yourdomain.com

Key: NODE_ENV
Value: production

Key: NEXT_PUBLIC_UPLOAD_DIR
Value: /public/uploads

Key: SKIP_ENV_VALIDATION
Value: true
```

**✅ CRITICAL:** Do NOT include quotes around values!

### Step 4: Create/Update .env File

Via SSH in `public_html/`:
```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://neondb_owner:password@host/database?sslmode=require
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://shotota.yourdomain.com
NEXT_PUBLIC_API_URL=https://shotota.yourdomain.com
NODE_ENV=production
NEXT_PUBLIC_UPLOAD_DIR=/public/uploads
SKIP_ENV_VALIDATION=true
EOF
```

---

## 🧪 Testing Phase

### After cPanel Setup

- [ ] Visit: `https://shotota.yourdomain.com/`
  - [ ] Should load home page
  - [ ] Check browser console for errors

- [ ] Test Signup: `https://shotota.yourdomain.com/signup`
  - [ ] Toggle Student/Instructor role
  - [ ] Create a student account
  - [ ] Create an instructor account
  - [ ] Try to create 6th admin (should fail with "Admin registration limit reached")

- [ ] Test Login: `https://shotota.yourdomain.com/login`
  - [ ] Login with student account
  - [ ] Should redirect to dashboard
  - [ ] Check session persists (refresh page)

- [ ] Test Admin Dashboard: `https://shotota.yourdomain.com/admin`
  - [ ] Login as instructor/admin
  - [ ] Should see upload forms
  - [ ] Test course upload
  - [ ] Test exam upload with questions

### Check Database Connection

Via SSH:
```bash
psql "your-database-url"
\dt
# Should show tables: users, accounts, sessions, courses, exams, questions, etc.
```

---

## 🔧 Troubleshooting

### App Not Starting?

1. **Check cPanel logs:**
   ```bash
   tail -f ~/logs/error_log
   ```

2. **Verify environment variables:**
   ```bash
   env | grep NEXTAUTH
   env | grep DATABASE
   ```

3. **Test database connection:**
   ```bash
   psql "your-database-url"
   ```

### Session Lost on Refresh?

- ✅ This is FIXED with database sessions
- Check that `SESSION` table exists in database
- Verify `NEXTAUTH_URL` matches your domain exactly

### Admin Limit Error?

- **Expected behavior!** Only 5 admins allowed
- Check admin count in database:
  ```sql
  psql "your-database-url"
  SELECT COUNT(*) FROM users WHERE role='ADMIN';
  ```

### Database Connection Failed?

1. Test Neon connection locally:
   ```bash
   psql "your-connection-string"
   ```

2. Verify `DATABASE_URL` has no typos
3. Ensure Neon allows connections from your IP
4. Check SSL mode is `?sslmode=require`

---

## ✅ Final Verification

Before going live, confirm:

- [ ] App loads without errors
- [ ] Signup works (role selection visible)
- [ ] Login persists across page refreshes
- [ ] Admin dashboard accessible to admins only
- [ ] Course upload form works
- [ ] Exam upload with questions works
- [ ] Admin count validation enforced (max 5)
- [ ] Database is external (Neon PostgreSQL)
- [ ] HTTPS working (cPanel SSL)

---

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| `STABILITY_LOCKDOWN.md` | Overview of all changes |
| `CPANEL_DEPLOYMENT.md` | Detailed cPanel setup |
| `.env.cpanel.example` | Environment template |
| `server.js` | Node.js entry point |
| `next.config.ts` | Build configuration |
| `prisma/schema.prisma` | Database schema |

---

## 🚀 Go Live Checklist

- [ ] All tests passing
- [ ] Database synced
- [ ] Backups created
- [ ] Domain pointing to cPanel
- [ ] SSL certificate installed
- [ ] Monitoring enabled (optional)
- [ ] Admin accounts created (max 5)
- [ ] Students can signup and login
- [ ] Instructors can upload courses/exams

---

## 💡 Pro Tips

1. **Keep NEXTAUTH_SECRET secure** - don't share or commit to Git
2. **Use strong passwords** when creating admin accounts
3. **Monitor database** - Neon has usage statistics
4. **Test on staging** before using on production
5. **Enable cPanel backups** for disaster recovery

---

## 📞 Getting Help

If stuck:
1. Check `CPANEL_DEPLOYMENT.md` troubleshooting section
2. Review cPanel error logs
3. Test database connection manually
4. Verify all environment variables are set
5. Check that `server.js` is in `public_html` root

---

**✅ Everything is ready! Follow this checklist and you'll have Shotota V2 running stably on PutulHost/cPanel.**

🎉 **Good luck with deployment!** 🚀
