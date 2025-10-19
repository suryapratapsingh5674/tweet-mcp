#!/usr/bin/env node

import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import * as readline from "readline";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "TWITTER_API_KEY",
  "TWITTER_API_SECRET",
  "TWITTER_ACCESS_TOKEN",
  "TWITTER_ACCESS_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Error: Missing required environment variable: ${envVar}`);
    console.error(`   Please check your .env file`);
    process.exit(1);
  }
}

// Initialize Twitter client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

const rwClient = twitterClient.readWrite;

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask questions
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to post a tweet
async function postTweet(text: string): Promise<void> {
  try {
    console.log("\n📤 Posting tweet...");
    const tweet = await rwClient.v2.tweet(text);
    
    console.log("\n✅ Tweet posted successfully!");
    console.log(`📝 Tweet ID: ${tweet.data.id}`);
    console.log(`🔗 URL: https://twitter.com/user/status/${tweet.data.id}`);
    console.log(`💬 Text: "${tweet.data.text}"`);
  } catch (error: any) {
    console.error("\n❌ Error posting tweet:");
    if (error.code === 403) {
      console.error("   Authentication failed. Please check your Twitter API credentials.");
    } else if (error.data) {
      console.error(`   ${JSON.stringify(error.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
    throw error;
  }
}

// Function to post a reply
async function postReply(text: string, replyToId: string): Promise<void> {
  try {
    console.log("\n📤 Posting reply...");
    const tweet = await rwClient.v2.reply(text, replyToId);
    
    console.log("\n✅ Reply posted successfully!");
    console.log(`📝 Tweet ID: ${tweet.data.id}`);
    console.log(`🔗 URL: https://twitter.com/user/status/${tweet.data.id}`);
    console.log(`💬 Text: "${tweet.data.text}"`);
    console.log(`↩️  In reply to: ${replyToId}`);
  } catch (error: any) {
    console.error("\n❌ Error posting reply:");
    if (error.code === 403) {
      console.error("   Authentication failed. Please check your Twitter API credentials.");
    } else if (error.data) {
      console.error(`   ${JSON.stringify(error.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
    throw error;
  }
}

// Main interactive menu
async function main() {
  console.log("\n🐦 Twitter CLI Tool");
  console.log("==================\n");

  // Get command line arguments
  const args = process.argv.slice(2);

  // If text is provided as argument, post it directly
  if (args.length > 0) {
    const tweetText = args.join(" ");
    await postTweet(tweetText);
    rl.close();
    return;
  }

  // Interactive mode
  try {
    while (true) {
      console.log("\nWhat would you like to do?");
      console.log("1. Post a tweet");
      console.log("2. Reply to a tweet");
      console.log("3. Exit");
      
      const choice = await askQuestion("\nEnter your choice (1-3): ");

      if (choice === "1") {
        const text = await askQuestion("\n📝 Enter your tweet: ");
        
        if (!text.trim()) {
          console.log("❌ Tweet cannot be empty!");
          continue;
        }

        const confirm = await askQuestion(`\nPost this tweet? "${text}" (y/n): `);
        
        if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "yes") {
          await postTweet(text);
        } else {
          console.log("❌ Tweet cancelled.");
        }
      } else if (choice === "2") {
        const replyToId = await askQuestion("\n🔗 Enter the Tweet ID to reply to: ");
        const text = await askQuestion("📝 Enter your reply: ");
        
        if (!text.trim()) {
          console.log("❌ Reply cannot be empty!");
          continue;
        }

        const confirm = await askQuestion(`\nPost this reply? "${text}" (y/n): `);
        
        if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "yes") {
          await postReply(text, replyToId);
        } else {
          console.log("❌ Reply cancelled.");
        }
      } else if (choice === "3") {
        console.log("\n👋 Goodbye!");
        break;
      } else {
        console.log("❌ Invalid choice. Please enter 1, 2, or 3.");
      }
    }
  } catch (error) {
    console.error("\n❌ An error occurred:", error);
  } finally {
    rl.close();
  }
}

// Run the CLI
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
