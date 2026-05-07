# Manual Deployment to Render

Since automatic deployment is not working, follow these steps to deploy manually:

## Step 1: Connect Repository to Render

1. Go to https://dashboard.render.com
2. Click **"New +"** button
3. Select **"Web Service"**
4. Click **"Connect GitHub"** (if not already connected)
5. Authorize Render to access your GitHub account
6. Select repository: **Tanjimscreation/shotota-v2**
7. Click **"Connect"**

## Step 2: Configure Service

Render will automatically detect your `render.yaml` configuration. Verify the settings:

**Service Settings:**
- **Name:** shotota-v2
- **Region:** Singapore (or your preferred region)
- **Branch:** main
- **Runtime:** Node
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `node server.js`

**Database:**
- **Name:** shotota-postgres
- **Engine:** PostgreSQL
- **Version:** 15

## Step 3: Environment Variables

Render will automatically configure these from your `render.yaml`:
- `DATABASE_URL` (from Render database)
- `NEXTAUTH_SECRET` (auto-generated)
- `NEXTAUTH_URL` (from service host)
- `NEXT_PUBLIC_API_URL` (from service host)
- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`
- `NEXT_PUBLIC_UPLOAD_DIR=/public/uploads`

**Add additional environment variables if needed:**
- `NEXTAUTH_SECRET` (if not auto-generated)
- Any other custom variables from your `.env.production`

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start the deployment process
3. Monitor the deployment logs in the Render dashboard
4. Wait for deployment to complete (may take 5-10 minutes)

## Step 5: Verify Deployment

1. Check the deployment status in Render dashboard
2. Visit the deployed URL (e.g., https://shotota-v2.onrender.com)
3. Test the application functionality
4. Check that database migrations were applied successfully

## Troubleshooting

**Deployment fails:**
- Check deployment logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify build command is correct
- Check that database connection string is valid

**Database issues:**
- The pre-deploy command `npx prisma db push --skip-generate` should handle migrations
- Check database logs in Render dashboard
- Verify DATABASE_URL is correctly configured

**Environment variables missing:**
- Manually add any missing variables in Render dashboard
- Copy from your `.env.production` file if needed

## Future Automatic Deployments

Once connected, future deployments will trigger automatically when you push to the main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

The deployment will start automatically in Render.
