# Quick Start - First Time Setup

## ⚡ Super Quick Setup (5 minutes)

### 1️⃣ Get Twitter API Keys (2 min)

1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Create a new app (or use existing)
3. Copy these 4 things:
   - API Key
   - API Secret  
   - Access Token
   - Access Token Secret
4. **IMPORTANT:** Make sure permissions = "Read and Write"

### 2️⃣ Configure Credentials (1 min)

```powershell
# Copy the example file
Copy-Item .env.example .env

# Open .env and paste your credentials
notepad .env
```

Your `.env` should look like:
```
TWITTER_API_KEY=abc123xyz...
TWITTER_API_SECRET=def456uvw...
TWITTER_ACCESS_TOKEN=789-ghi...
TWITTER_ACCESS_SECRET=jkl012mno...
```

### 3️⃣ Test It! (1 min)

```powershell
# Post your first tweet!
npm run tweet "Hello Twitter! Just set up my CLI tool! 🚀"
```

## ✅ You're Done!

Now you can:

**Option A: Quick tweets**
```powershell
npm run tweet "Your message here"
```

**Option B: Interactive mode**
```powershell
npm run tweet
# Then follow the menu
```

**Option C: Use with Claude Desktop**
- See [SETUP.md](SETUP.md) for MCP configuration

## 🆘 Troubleshooting

**"Missing environment variable"**
→ Check your `.env` file has all 4 credentials

**"Authentication failed"**  
→ Make sure your app permissions = "Read and Write"
→ You may need to regenerate tokens after changing permissions

**"Module not found"**
→ Run: `npm install`

**"Command not found"**
→ Make sure you're in the project directory
→ Run: `npm run build`

## 📚 More Help

- [README.md](README.md) - Full documentation
- [CLI-GUIDE.md](CLI-GUIDE.md) - CLI usage details
- [EXAMPLES.md](EXAMPLES.md) - Usage examples
- [SETUP.md](SETUP.md) - Detailed setup guide

## 🎉 Ready to Tweet!

Try it now:
```powershell
npm run tweet "Testing my new Twitter CLI! 🐦✨"
```
