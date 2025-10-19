# 🎬 Demo & Examples

## Terminal CLI Examples

### Example 1: Post a Quick Tweet
```powershell
PS C:\Users\surya\Documents\VScode\twitter-mcp> npm run tweet "Just built a Twitter CLI tool! 🚀 #coding"

📤 Posting tweet...

✅ Tweet posted successfully!
📝 Tweet ID: 1234567890123456789
🔗 URL: https://twitter.com/user/status/1234567890123456789
💬 Text: "Just built a Twitter CLI tool! 🚀 #coding"
```

### Example 2: Interactive Menu
```powershell
PS C:\Users\surya\Documents\VScode\twitter-mcp> npm run tweet

🐦 Twitter CLI Tool
==================

What would you like to do?
1. Post a tweet
2. Reply to a tweet
3. Exit

Enter your choice (1-3): 1

📝 Enter your tweet: Hello from my CLI! 🎉

Post this tweet? "Hello from my CLI! 🎉" (y/n): y

📤 Posting tweet...

✅ Tweet posted successfully!
📝 Tweet ID: 1234567890123456789
🔗 URL: https://twitter.com/user/status/1234567890123456789
💬 Text: "Hello from my CLI! 🎉"
```

### Example 3: Reply to a Tweet
```powershell
PS C:\Users\surya\Documents\VScode\twitter-mcp> npm run tweet

🐦 Twitter CLI Tool
==================

What would you like to do?
1. Post a tweet
2. Reply to a tweet
3. Exit

Enter your choice (1-3): 2

🔗 Enter the Tweet ID to reply to: 1234567890123456789
📝 Enter your reply: Great insight! Thanks for sharing.

Post this reply? "Great insight! Thanks for sharing." (y/n): y

📤 Posting reply...

✅ Reply posted successfully!
📝 Tweet ID: 9876543210987654321
🔗 URL: https://twitter.com/user/status/9876543210987654321
💬 Text: "Great insight! Thanks for sharing."
↩️  In reply to: 1234567890123456789
```

## Claude Desktop (MCP) Examples

Once configured with Claude Desktop, you can use natural language:

**User:** "Post a tweet saying 'Just learned about MCP servers! 🤖'"

**Claude:** *Uses the post_tweet tool and posts to your account*

**User:** "Reply to tweet 1234567890 with 'Love this!'"

**Claude:** *Uses the post_tweet_with_reply tool*

## Automation Examples

You can use this in scripts!

### PowerShell Script
```powershell
# daily-tweet.ps1
$date = Get-Date -Format "MMMM dd, yyyy"
npm run tweet "Good morning! Today is $date ☀️"
```

### Scheduled Task
Create a scheduled task to post tweets automatically:
```powershell
# Post a daily motivational quote
npm run tweet "Keep coding and stay curious! 💻 #MondayMotivation"
```

## Tips & Tricks

1. **Emojis work!** Use them freely: 🚀 🎉 💻 ⚡
2. **Hashtags** are supported: #coding #developer
3. **Mentions** work too: @username
4. **Line breaks** in interactive mode: Just type normally
5. **Quick posts**: Best with the command-line argument method

## What You Can Do

✅ Post status updates
✅ Share code snippets (with proper formatting)
✅ Reply to conversations
✅ Schedule automated tweets (with task scheduler)
✅ Integrate with other scripts
✅ Use from any terminal or command prompt

## Getting Started

1. First time? Run: `npm run tweet`
2. Want it fast? Use: `npm run tweet "Your message"`
3. Need help? Check: `CLI-GUIDE.md`

Happy tweeting! 🐦✨
