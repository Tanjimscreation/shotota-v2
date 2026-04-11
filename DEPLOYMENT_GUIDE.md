# Vercel Deployment Guide

## ✅ Automatic Setup (Already Done)

- ✅ `vercel.json` - Build configuration
- ✅ `package.json` - Build scripts with Prisma generation
- ✅ `.env.production` - Production environment template
- ✅ `.env.example` - Example environment variables
- ✅ TypeScript configuration
- ✅ Prisma schema

## 📋 REQUIRED: Set Environment Variables in Vercel

**THIS IS THE MOST IMPORTANT STEP!**

1. Go to: https://vercel.com/abbastanjim739-8906s-projects/shotota-v2-8u75/settings/environment-variables

2. Add these 3 variables (ALL marked as **Production**):

### Variable 1: MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://shotota-admin:Shotota%402026@cluster0.i26yrjg.mongodb.net/shotota-v2?retryWrites=true&w=majority
Environment: ✅ Production (checked)
```

### Variable 2: NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: shotota-super-secret-key-2026
Environment: ✅ Production (checked)
```

### Variable 3: NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://shotota-v2-8u75.vercel.app
Environment: ✅ Production (checked)
```

## 🚀 Deploy Steps

1. **Set the 3 environment variables above** (CRITICAL!)
2. Go to Deployments tab
3. Click "Redeploy" on latest deployment
4. Wait for build to complete (~2-3 minutes)
5. Once ✅ shows, your app is live!

## 🔍 If Build Still Fails

Check build logs for:
- `Module not found` → Prisma client not generated (we fixed this)
- `MONGODB_URI is undefined` → You didn't add env variables
- `NEXTAUTH_SECRET is undefined` → You didn't add env variables
- `ECONNREFUSED` → Database connection issue (check MongoDB URI)

## 📱 Test Your Deployment

Once deployed:
- Visit: https://shotota-v2-8u75.vercel.app
- Try signup: https://shotota-v2-8u75.vercel.app/auth/signup
- Try login: https://shotota-v2-8u75.vercel.app/auth/login

## 🛠️ Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Ensure all 3 env variables are set to **Production**
3. Make a small code change and push to trigger fresh build
4. Contact support with the build log error

---

**Last Updated:** April 11, 2026
**Configuration Version:** Vercel v2 with Next.js 16.2.2
