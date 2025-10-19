# Quick Setup Guide

## Step-by-Step Setup

### 1. Get Twitter API Credentials

1. Visit: https://developer.twitter.com/en/portal/dashboard
2. Create a new Project and App (or use existing)
3. Go to your App → "Keys and Tokens"
4. Copy these 4 credentials:
   - API Key
   - API Secret
   - Access Token
   - Access Token Secret
5. **IMPORTANT:** Set app permissions to "Read and Write"!

### 2. Configure Your Credentials

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` and paste your credentials

### 3. Configure Claude Desktop

Edit your Claude Desktop config file:
- **Location:** `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration (update the path if needed):

```json
{
  "mcpServers": {
    "twitter": {
      "command": "node",
      "args": [
        "c:\\Users\\surya\\Documents\\VScode\\twitter-mcp\\dist\\index.js"
      ],
      "env": {
        "TWITTER_API_KEY": "YOUR_API_KEY",
        "TWITTER_API_SECRET": "YOUR_API_SECRET",
        "TWITTER_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN",
        "TWITTER_ACCESS_SECRET": "YOUR_ACCESS_SECRET"
      }
    }
  }
}
```

### 4. Restart Claude Desktop

Close and reopen Claude Desktop completely.

### 5. Test It!

In Claude Desktop, try:
- "Post a tweet saying 'Hello from my MCP server! 🚀'"
- "Tweet: Just testing my new Twitter MCP integration!"

## Verification Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Project built (`npm run build`)
- [ ] `.env` file created with valid credentials
- [ ] Twitter app has "Read and Write" permissions
- [ ] Claude Desktop config updated
- [ ] Claude Desktop restarted

## Common Issues

**"Authentication failed"**
- Check credentials in `.env` or Claude config
- Verify app has "Read and Write" permissions
- Regenerate tokens after changing permissions

**"Tool not found"**
- Make sure Claude Desktop config path is correct
- Rebuild the project: `npm run build`
- Restart Claude Desktop

## Usage Examples

Once configured, you can say:
- "Post a tweet for me: [your message]"
- "Tweet this: [your message]"
- "Can you post on Twitter: [your message]"

The MCP server will handle posting to your X account!
