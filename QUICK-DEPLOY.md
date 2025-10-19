# Quick GitHub → Vercel Deployment

## Super Fast Setup (5 minutes)

### 1. Push to GitHub
```powershell
git init
git add .
git commit -m "Twitter bot with AI"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/twitter-bot.git
git branch -M main
git push -u origin main
```

### 2. Import to Vercel
1. https://vercel.com → **New Project**
2. Import your GitHub repo
3. Click **Deploy** (will fail - that's OK)

### 3. Add Secrets
In Vercel dashboard → **Settings** → **Environment Variables**:
```
TWITTER_API_KEY
TWITTER_API_SECRET
TWITTER_ACCESS_TOKEN
TWITTER_ACCESS_SECRET
GEMINI_API_KEY
GEMINI_MODEL=gemini-flash-latest
```

### 4. Redeploy
**Deployments** tab → **Redeploy** latest

### Done! 🎉
Your bot posts every 2 days automatically.

## Update Anytime
```powershell
# Make changes
npm run bot:once  # test locally
git add .
git commit -m "Update"
git push
# Auto-deploys! ✨
```

Full guide: See `VERCEL-DEPLOY.md`
