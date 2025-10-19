# CLI Usage Guide

## 🚀 Quick Start - Using from Terminal

Now you can post tweets directly from your terminal!

### Option 1: Quick Tweet (One Command)

Just run and type your tweet:
```powershell
npm run tweet
```

Or use the batch file:
```powershell
.\tweet.bat
```

### Option 2: Post Tweet Directly (with text)

Post a tweet in one line:
```powershell
npm run tweet "Hello World! 🚀"
```

Or:
```powershell
.\tweet.bat "Just posted from my terminal!"
```

### Option 3: Interactive Menu

Run without arguments to get a menu:
```powershell
npm run tweet
```

You'll see:
```
🐦 Twitter CLI Tool
==================

What would you like to do?
1. Post a tweet
2. Reply to a tweet
3. Exit

Enter your choice (1-3):
```

## 📝 Examples

### Post a Simple Tweet
```powershell
npm run tweet "Testing my new Twitter CLI! 🎉"
```

### Interactive Mode
```powershell
npm run tweet
# Then select option 1
# Type your tweet
# Confirm with 'y'
```

### Reply to a Tweet
```powershell
npm run tweet
# Select option 2
# Enter the Tweet ID you want to reply to
# Type your reply
# Confirm with 'y'
```

## 🎯 Both Ways Work!

You now have **TWO ways** to post tweets:

### 1. **Terminal CLI** (Direct & Fast)
```powershell
npm run tweet "My message"
```
- Quick and direct
- Run from terminal
- Perfect for scripting

### 2. **MCP Server** (Claude Desktop Integration)
- Configure in Claude Desktop
- Natural language: "Post a tweet saying..."
- Conversational interface

## 💡 Tips

- **Quick tweets:** Use `npm run tweet "message"`
- **Interactive:** Just run `npm run tweet`
- **Scripting:** You can add this to your automation scripts!

## 🔧 Setup Required

Make sure you've:
1. Created `.env` file with your Twitter credentials
2. Run `npm install` and `npm run build`

That's it! Start tweeting from your terminal! 🐦✨
