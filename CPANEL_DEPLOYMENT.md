# 🚀 Shotota V2 - PutulHost/cPanel Deployment Guide

## ✅ Pre-Deployment Checklist

### Step 1: Set Up External Database (Neon.tech)

1. Go to **[Neon.tech](https://neon.tech/)** and create a free account
2. Create a new PostgreSQL project
3. Copy your **Connection String** (looks like: `postgresql://user:password@host/database`)
4. Save this as your `DATABASE_URL`

### Step 2: Generate NextAuth Secret

Run this in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this quick generator:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save the output as your `NEXTAUTH_SECRET`.

---

## 📦 Build for Production

### Local Build (before uploading to cPanel)

```bash
# 1. Install dependencies
npm install

# 2. Build the project with standalone output
npm run build

# 3. Verify the build
ls -la .next/standalone/  # Should exist
```

The `.next/standalone` folder contains everything needed to run on cPanel.

---

## 📤 Upload to PutulHost cPanel

### File Structure to Upload

```
public-html/
├── .next/               # Copy entire folder
├── public/              # Copy entire folder
├── node_modules/        # Optional: speeds up deployment
├── .env                 # Environment file (create on cPanel)
├── server.js            # Entry point for cPanel Node.js Selector
└── package.json
```

### Upload Steps

1. **SSH into your cPanel server** or use **File Manager**:
   ```bash
   scp -r .next/standalone username@putulhost.com:~/public_html/
   scp -r public username@putulhost.com:~/public_html/
   scp server.js username@putulhost.com:~/public_html/
   scp package.json username@putulhost.com:~/public_html/
   ```

2. **Via cPanel File Manager**:
   - Go to **File Manager** → Navigate to `public_html`
   - Upload `.next`, `public`, `server.js`

---

## ⚙️ Configure cPanel Node.js Selector

### 1. Go to Node.js Selector

In cPanel:
1. Scroll down to **Software/Services** section
2. Click **Node.js Selector**
3. Click **Create Application**

### 2. Fill in the Application Settings

```
Application Mode:           Select "Production"
Node.js Version:           18.x or 20.x (LTS recommended)
Application root:          public_html/
Application URL:           shotota.yourdomain.com (or your domain)
Application startup file:   server.js
Application JS file:        server.js
```

### 3. Environment Variables

In the **Environment Variables** section, add:

```
DATABASE_URL = postgresql://user:password@host/database?sslmode=require
NEXTAUTH_SECRET = your-generated-secret-key
NEXTAUTH_URL = https://shotota.yourdomain.com
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://shotota.yourdomain.com
```

**⚠️ IMPORTANT:** 
- Do NOT include quotes around values
- Use your actual Neon database URL
- Use your actual domain (not localhost)

### 4. Install Dependencies (Optional)

Run in SSH:
```bash
cd ~/public_html
npm install --production
```

This reduces folder size if you didn't upload `node_modules`.

---

## 🔧 Environment Variables Required

Create a `.env` file in your `public_html` folder with:

```env
# Database (from Neon.tech)
DATABASE_URL="postgresql://your-neon-connection-string"

# NextAuth Configuration
NEXTAUTH_SECRET="your-generated-secret-key"
NEXTAUTH_URL="https://shotota.yourdomain.com"

# API Configuration
NEXT_PUBLIC_API_URL="https://shotota.yourdomain.com"

# Node Environment
NODE_ENV="production"

# File Upload
NEXT_PUBLIC_UPLOAD_DIR="/public/uploads"
MAX_FILE_SIZE="10485760"
```

---

## ✅ Verify Deployment

After setting up in cPanel:

1. **Check if the app is running:**
   ```
   https://shotota.yourdomain.com
   ```

2. **Test signup with role selection:**
   ```
   https://shotota.yourdomain.com/signup
   ```
   - Toggle between Student and Instructor roles
   - Create an admin account (limited to 5 maximum)

3. **Test login:**
   ```
   https://shotota.yourdomain.com/login
   ```

4. **Access admin dashboard (if admin):**
   ```
   https://shotota.yourdomain.com/admin
   ```

---

## 🐛 Troubleshooting

### Issue: "App is not starting"

**Solution:**
1. Check cPanel error logs: **Error Documents** or SSH:
   ```bash
   tail -f ~/logs/error_log
   ```
2. Verify `DATABASE_URL` is correct
3. Verify `NEXTAUTH_SECRET` is set
4. Ensure `server.js` is in the root of `public_html`

### Issue: "Database connection failed"

**Solution:**
1. Test your Neon connection string locally:
   ```bash
   psql your-database-url
   ```
2. Ensure Neon allows connections from your cPanel IP
3. Verify `DATABASE_URL` in cPanel env variables (no typos)

### Issue: "Admin registration limit reached"

**Expected behavior!** Only 5 admin accounts allowed. This is the "5-Admin Guard" feature.

### Issue: "Session is lost after restart"

**Solution:** Ensure `session: { strategy: "database" }` is configured in NextAuth. Sessions are now stored in your database, not lost on restart.

---

## 📊 Key Features Deployed

✅ **Database:** Neon PostgreSQL (external, stable)
✅ **Authentication:** NextAuth.js with Prisma Adapter (database sessions)
✅ **Roles:** STUDENT, INSTRUCTOR, ADMIN (max 5 admins)
✅ **Admin Features:** Course & Exam upload with form validation
✅ **Standalone Build:** Optimized for cPanel Node.js Selector
✅ **Session Persistence:** Database-backed sessions survive restarts

---

## 🔐 Security Notes

- `NEXTAUTH_SECRET` must be a random, long string
- Keep `DATABASE_URL` secret (don't commit to Git)
- Use HTTPS domain only (cPanel provides free SSL)
- Regularly update dependencies:
  ```bash
  npm audit fix
  ```

---

## 📞 Support

If you encounter issues:
1. Check cPanel error logs
2. Verify all environment variables
3. Ensure database connection string is correct
4. Check that `server.js` is in the root of your app folder

**Good luck! 🚀**
