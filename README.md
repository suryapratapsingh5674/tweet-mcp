# Twitter MCP Server & CLI Tool

A powerful tool that allows you to post tweets to X (Twitter) in **TWO ways**:
1. **CLI Tool** - Post directly from your terminal
2. **MCP Server** - Integrate with Claude Desktop for natural language posting

## Features

- 🐦 Post tweets to your X account
- 💬 Reply to existing tweets
- 🔒 Secure authentication using Twitter API v2
- ✨ Simple and easy to use
- 🖥️ Command-line interface for quick posting
- 🤖 MCP server for AI-powered posting via Claude Desktop

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Twitter Developer Account** with API access
3. **MCP-compatible client** (like Claude Desktop)

## Setup Instructions

### Step 1: Get Twitter API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app (or use an existing one)
3. Navigate to your app's "Keys and Tokens" section
4. Generate/copy the following credentials:
   - API Key (Consumer Key)
   - API Secret (Consumer Secret)
   - Access Token
   - Access Token Secret

**Important:** Make sure your app has "Read and Write" permissions enabled!

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Twitter API credentials:
   ```
   TWITTER_API_KEY=your_api_key_here
   TWITTER_API_SECRET=your_api_secret_here
   TWITTER_ACCESS_TOKEN=your_access_token_here
   TWITTER_ACCESS_SECRET=your_access_secret_here
   ```

### Step 4: Build the Project

```bash
npm run build
```

### Step 5: Configure Claude Desktop (or your MCP client)

Add the following to your Claude Desktop configuration file:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "twitter": {
      "command": "node",
      "args": [
        "c:\\Users\\surya\\Documents\\VScode\\twitter-mcp\\dist\\index.js"
      ],
      "env": {
        "TWITTER_API_KEY": "your_api_key_here",
        "TWITTER_API_SECRET": "your_api_secret_here",
        "TWITTER_ACCESS_TOKEN": "your_access_token_here",
        "TWITTER_ACCESS_SECRET": "your_access_secret_here"
      }
    }
  }
}
```

**Note:** Replace the path and credentials with your actual values.

### Step 6: Restart Claude Desktop

After updating the configuration, restart Claude Desktop to load the MCP server.

## 🎯 Usage - Two Ways!

### Method 1: CLI Tool (Direct from Terminal)

**Quick tweet in one command:**
```powershell
npm run tweet "Hello from my terminal! 🚀"
```

**Interactive menu:**
```powershell
npm run tweet
```

**Using batch file:**
```powershell
.\tweet.bat "My tweet message"
```

See [CLI-GUIDE.md](CLI-GUIDE.md) for detailed CLI usage.

### Method 2: MCP Server (via Claude Desktop)

Once configured, you can ask Claude to post tweets for you:

Once configured, you can ask Claude to post tweets for you:

### Examples

**Post a simple tweet:**
> "Can you post a tweet saying 'Hello from my MCP server! 🚀'"

**Post a reply:**
> "Reply to tweet ID 1234567890 with 'Great insight!'"

## Available Tools

### 1. `post_tweet`
Posts a new tweet to your X account.

**Parameters:**
- `text` (string, required): The content of the tweet

### 2. `post_tweet_with_reply`
Posts a tweet as a reply to an existing tweet.

**Parameters:**
- `text` (string, required): The content of the tweet
- `reply_to_id` (string, required): The ID of the tweet to reply to

## Scheduled Bot (Vercel)

You can deploy a bot that auto-posts every 2 days about new and interesting tech (web/app dev, DevOps, cloud).

### Deploy Steps
1. Create a new Vercel project from this folder
2. Set Environment Variables in Vercel:
  - `TWITTER_API_KEY`
  - `TWITTER_API_SECRET`
  - `TWITTER_ACCESS_TOKEN`
  - `TWITTER_ACCESS_SECRET`
  - `GEMINI_API_KEY`
  - (Optional) `GEMINI_MODEL` e.g. `gemini-flash-latest`
3. Deploy. Vercel will schedule the function per `vercel.json`.

The cron defined in `vercel.json` triggers `GET /api/cron` every 2 days at 09:00 UTC.

### Manual trigger
You can also call it manually after deployment:
`https://<your-vercel-domain>/api/cron`

### Local test
Run a one-off post locally (uses RSS + Gemini):
```powershell
npm run bot:once
```

## Development

### Watch mode (auto-rebuild on changes)
```bash
npm run dev
```

### Manual build
```bash
npm run build
```

### Run directly
```bash
npm start
```

## Troubleshooting

### Authentication Errors
- Double-check your API credentials in the `.env` file
- Ensure your Twitter app has "Read and Write" permissions
- Regenerate your access tokens if needed

### Permission Denied
- Make sure your Twitter app has the correct permission level
- You may need to regenerate tokens after changing permissions

### MCP Server Not Found
- Verify the path in `claude_desktop_config.json` is correct
- Ensure the project has been built (`npm run build`)
- Check that Node.js is in your system PATH

## Security Notes

- ⚠️ Never commit your `.env` file to version control
- ⚠️ Keep your API credentials secure
- ⚠️ The `.env` file is already in `.gitignore` for safety

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
