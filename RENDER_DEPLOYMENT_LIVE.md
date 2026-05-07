# 🚀 RENDER DEPLOYMENT - LIVE INSTRUCTIONS

**Status:** Ready to Deploy
**Date:** May 7, 2026

---

## ✅ YOUR CREDENTIALS

### Database (Neon)
```
DATABASE_URL=postgresql://neondb_owner:npg_QiM9pbNELT4j@ep-curly-hill-aoftua2s-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### NextAuth Secret
```
NEXTAUTH_SECRET=FvCm5aXWDFP/RCCXo8UmJ2tEs/4lRxb6CunljKFuhRI=
```

### GitHub Repo
```
https://github.com/Tanjimscreation/shotota-v2
```

---

## 🎯 DEPLOY TO RENDER (10 MINUTES)

### **Step 1: Go to Render**
Visit: https://dashboard.render.com/

### **Step 2: Create New Web Service**
1. Click **"New"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Search: `shotota-v2`
4. Select: `Tanjimscreation/shotota-v2`
5. Click **"Connect"**

### **Step 3: Configure Service**
```
Name:                    shotota-v2
Environment:             Node
Region:                  Singapore (or nearest)
Branch:                  main
Build Command:           npm install && npm run build
Start Command:           node .next/standalone/shotota-v2/server.js
Plan:                    Free (sufficient)
```

### **Step 4: Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"**

Add these (one by one):

**1. DATABASE_URL**
```
Name:  DATABASE_URL
Value: postgresql://neondb_owner:npg_QiM9pbNELT4j@ep-curly-hill-aoftua2s-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**2. NEXTAUTH_SECRET**
```
Name:  NEXTAUTH_SECRET
Value: FvCm5aXWDFP/RCCXo8UmJ2tEs/4lRxb6CunljKFuhRI=
```

**3. NEXTAUTH_URL** (Replace with your Render domain)
```
Name:  NEXTAUTH_URL
Value: https://shotota-v2.onrender.com
```

**4. NEXT_PUBLIC_API_URL** (Same as NEXTAUTH_URL)
```
Name:  NEXT_PUBLIC_API_URL
Value: https://shotota-v2.onrender.com
```

**5. NODE_ENV**
```
Name:  NODE_ENV
Value: production
```

**6. SKIP_ENV_VALIDATION**
```
Name:  SKIP_ENV_VALIDATION
Value: true
```

### **Step 5: Deploy!**
1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. You'll see: **"Your service is live"** ✅

---

## 🧪 TEST YOUR APP

Once deployed, you'll get a URL like:
```
https://shotota-v2.onrender.com
```

### Test These:
- [ ] Home page loads
- [ ] Signup page works
- [ ] Create student account
- [ ] Create instructor account
- [ ] Login works
- [ ] Dashboard displays
- [ ] Admin panel visible (for instructor)
- [ ] "Lost Inspiration?" button works
- [ ] Logo visible (top-left)
- [ ] Watermark visible (background)

---

## 👥 TEST ACCOUNTS

After signup works, test with:

**Student:**
```
Email: student@test.com
Password: password123
```

**Instructor:**
```
Email: instructor@test.com
Password: password123
```

**Admin:**
```
Email: admin@test.com
Password: password123
```

---

## 🎁 YOUR LIVE APP

Once deployed, you'll have:

✅ **Live URL:** https://shotota-v2.onrender.com
✅ **Database:** Connected & synced
✅ **Authentication:** Working
✅ **All Features:** Live

---

## 📞 TROUBLESHOOTING

### If app won't deploy:
1. Check Render Logs (Logs tab)
2. Verify DATABASE_URL is correct
3. Verify NEXTAUTH_SECRET exists
4. Check NEXTAUTH_URL matches domain

### If login doesn't work:
1. Verify NEXTAUTH_URL in Render
2. Check NEXTAUTH_SECRET is set
3. Check browser console for errors

### If database connection fails:
1. Test connection string in terminal:
   ```
   psql "postgresql://neondb_owner:npg_QiM9pbNELT4j@ep-curly-hill-aoftua2s-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   ```
2. Verify Neon project is active
3. Check firewall/network

---

## ✅ FINAL CHECKLIST

- [ ] Render account setup
- [ ] GitHub connected
- [ ] Build command set
- [ ] Start command set
- [ ] All 6 environment variables added
- [ ] Deployment completed
- [ ] App is live
- [ ] Signup works
- [ ] Login works
- [ ] Features working

---

## 🎉 DONE!

Your app is live and ready!

**Share with customer:**
```
https://shotota-v2.onrender.com
```

**GitHub Repo:**
```
https://github.com/Tanjimscreation/shotota-v2
```

---

Need help? Check Render logs or contact Render support!
