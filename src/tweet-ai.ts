#!/usr/bin/env node
import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';
import { generateTweetWithGemini } from './gemini.js';
import * as readline from 'readline';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.error('❌ Gemini API key missing in .env');
  process.exit(1);
}

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});
const rwClient = twitterClient.readWrite;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(q: string) { return new Promise<string>(r => rl.question(q, r)); }

async function main() {
  const topic = process.argv.slice(2).join(' ');
  let prompt = topic;
  if (!prompt) prompt = await ask('Describe the topic for your tweet: ');
  const model = process.env.GEMINI_MODEL || 'auto';
  const base = (process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com');
  console.log(`\n🤖 Generating tweet with Gemini... (model=${model}, base=${base})`);
  const tweetText = await generateTweetWithGemini(
    `Write a concise, engaging tweet (max 280 chars) about: ${prompt}`,
    apiKey
  );
  // Normalize whitespace and trim to 280 chars
  let finalText = (tweetText || '').replace(/\s+/g, ' ').trim();
  if (finalText.length > 280) {
    finalText = finalText.slice(0, 277) + '...';
  }
  console.log('\n🐦 Generated tweet:');
  console.log(finalText);
  const confirm = await ask('\nPost this tweet to X? (y/n): ');
  if (confirm.toLowerCase() === 'y') {
    console.log('\n📤 Posting tweet...');
    const tweet = await rwClient.v2.tweet(finalText);
    console.log('✅ Tweet posted!');
    console.log(`🔗 https://twitter.com/user/status/${tweet.data.id}`);
  } else {
    console.log('❌ Tweet cancelled.');
  }
  rl.close();
}

main().catch(e => { console.error('Error:', e); rl.close(); });
