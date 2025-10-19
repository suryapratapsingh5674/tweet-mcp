# Deploy Your Twitter Bot to Vercel

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Your Twitter API credentials (already in `.env`)
3. Your Gemini API key (already in `.env`)
4. A GitHub account (for GitHub deployment method)

## Deployment Methods

Choose one:
- **Method A: Deploy from GitHub** (Recommended - easier, auto-updates)
- **Method B: Deploy from CLI** (Manual)

---

## Method A: Deploy from GitHub (Recommended)

This method is easier and auto-deploys when you push changes to GitHub.

### 1. Push Your Code to GitHub

If you haven't already created a GitHub repo:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Twitter bot with Gemini AI"

# Create a new repo on GitHub (via web), then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Important:** Your `.env` file is already in `.gitignore`, so your secrets won't be pushed to GitHub.

### 2. Connect Vercel to GitHub

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Authorize Vercel to access your GitHub account
5. Select your Twitter bot repository
6. Click **"Import"**

### 3. Configure Build Settings

Vercel will auto-detect the project. Keep defaults:
- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** Leave empty
- Click **"Deploy"** (it will fail first time - that's ok, we need to add env vars)

### 4. Add Environment Variables

After the first deploy (even if it fails):
1. Go to your project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add these one by one (copy values from your local `.env` file):

```
TWITTER_API_KEY = your_api_key_here
TWITTER_API_SECRET = your_api_secret_here
TWITTER_ACCESS_TOKEN = your_access_token_here
TWITTER_ACCESS_SECRET = your_access_secret_here
GEMINI_API_KEY = your_gemini_api_key_here
GEMINI_MODEL = gemini-flash-latest
```

For each variable:
- Enter **Name** and **Value**
- Select **All** environments (Production, Preview, Development)
- Click **"Save"**

### 5. Redeploy

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

Or just push a new commit:
```powershell
git commit --allow-empty -m "Trigger redeploy"
git push
```

### 6. Done! 🎉

Your bot is now live and will auto-post every 2 days at 9 AM UTC.

**Auto-updates:** Every time you push to GitHub, Vercel automatically redeploys!

---

## Method B: Deploy from CLI

### Step-by-Step Deployment

### 1. Install Vercel CLI (if not already installed)
```powershell
npm install -g vercel
```

### 2. Login to Vercel
```powershell
vercel login
```
Follow the prompts to authenticate.

### 3. Deploy from this directory
```powershell
vercel
```

When prompted:
- "Set up and deploy?" → **Yes**
- "Which scope?" → Choose your account
- "Link to existing project?" → **No** (first time)
- "What's your project's name?" → `twitter-bot` (or whatever you prefer)
- "In which directory is your code located?" → `.` (current directory)

### 4. Add Environment Variables

After first deployment, go to your Vercel dashboard:
- Open your project
- Go to **Settings** → **Environment Variables**
- Add these variables (copy from your `.env` file):

```
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-flash-latest
```

### 5. Redeploy with Environment Variables
```powershell
vercel --prod
```

### 6. Enable Cron Jobs

The bot is configured to auto-post every 2 days at 9:00 AM UTC (via `vercel.json`).

Vercel automatically enables cron for production deployments. No extra setup needed!

## Schedule Details

Current schedule in `vercel.json`:
```json
"schedule": "0 9 */2 * *"
```

This means:
- Every 2 days
- At 9:00 AM UTC

### Change the Schedule

Edit `vercel.json` to change timing:
- `0 9 * * *` = Daily at 9 AM UTC
- `0 9 */3 * *` = Every 3 days at 9 AM UTC
- `0 0,12 * * *` = Twice daily (midnight and noon UTC)

After changing, run `vercel --prod` to deploy.

## Test Your Deployment

### Manual Test
Visit your deployed endpoint to trigger a post manually:
```
https://your-project-name.vercel.app/api/cron
```

You should see JSON response:
```json
{
  "ok": true,
  "id": "tweet_id",
  "text": "your tweet",
  "link": "https://twitter.com/user/status/..."
}
```

### Check Logs
In Vercel dashboard:
- Go to your project
- Click **Deployments**
- Click on latest deployment
- View **Functions** logs to see cron executions

## Customize Your Voice

Edit `STYLE.md` to define your unique writing style. The bot reads this to make tweets sound like YOU.

Add examples of your best tweets to `STYLE.md` so Gemini can match your tone.

## Local Testing Before Deploy

Always test locally first:
```powershell
npm run bot:once
```

This runs the same logic as the Vercel cron, but locally.

## GitHub Workflow Tips

### Update Your Bot
1. Make changes locally
2. Test with `npm run bot:once`
3. Commit and push:
   ```powershell
   git add .
   git commit -m "Update bot tone/feeds"
   git push
   ```
4. Vercel auto-deploys! ✨

### Protect Your Secrets
Never commit `.env` to GitHub. It's already in `.gitignore`, but double-check:
```powershell
git status
# Should NOT show .env
```

### View Production Logs
- Vercel Dashboard → Your Project → Deployments
- Click latest deployment → View Function Logs
- See when cron runs and any errors

## Troubleshooting

**"No environment variables"**
- Make sure you added all credentials in Vercel dashboard (Settings → Environment Variables)
- For GitHub deploys: Redeploy after adding variables (Deployments → Redeploy)
- For CLI deploys: Run `vercel --prod`

**"Cron not running"**
- Cron only works in **production** (not preview)
- For GitHub: Make sure you deployed the `main` branch
- For CLI: Make sure you ran `vercel --prod` (not just `vercel`)
- View cron jobs: Vercel dashboard → Project → Settings → Cron Jobs

**"Authentication failed"**
- Verify Twitter credentials in Vercel dashboard
- Make sure redirect URLs are set in Twitter Developer Portal
- Regenerate tokens if needed and update in Vercel

**"Gemini error"**
- Check GEMINI_API_KEY is correct in Vercel dashboard
- Try setting GEMINI_MODEL to a different model
- List available models locally: `npm run gemini:models`

**"Build failed"**
- Check Vercel build logs for errors
- Make sure all dependencies are in `package.json`
- Try building locally first: `npm run build`

## Cost

- Vercel: Free tier includes 100 cron executions/month (plenty for every-2-days posting)
- Gemini API: ~$0.0001 per tweet (essentially free)
- Twitter API: Free

## Next Steps

### If you used GitHub (Method A):
1. ✅ Push code to GitHub
2. ✅ Import project in Vercel
3. ✅ Add environment variables in Vercel dashboard
4. ✅ Redeploy
5. 🎨 Customize `STYLE.md` with your voice
6. 🧪 Test: Visit `https://your-project.vercel.app/api/cron`
7. 📊 Monitor: Check Vercel logs after 2 days

### If you used CLI (Method B):
1. ✅ Run `vercel --prod`
2. ✅ Add environment variables in Vercel dashboard
3. ✅ Redeploy: `vercel --prod`
4. 🎨 Customize `STYLE.md` with your voice
5. 🧪 Test: Visit `/api/cron` endpoint
6. 📊 Monitor: Check Vercel logs after 2 days

Your bot is now live and will auto-post every 2 days! 🚀

## Recommended: GitHub Method
- ✅ Auto-deploys on every push
- ✅ Version control for your bot
- ✅ Easy rollbacks if needed
- ✅ Better for collaboration
