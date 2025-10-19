#!/usr/bin/env node
import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';
import Parser from 'rss-parser';
import { generateTweetWithGemini } from './gemini.js';

dotenv.config();

const FEEDS = [
  'https://hnrss.org/frontpage',
  'https://www.infoq.com/development/rss/',
  'https://techcrunch.com/tag/devops/feed/',
  'https://aws.amazon.com/blogs/architecture/feed/',
];

function clamp(text: string) {
  let t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length > 280) t = t.slice(0, 277) + '...';
  return t;
}

async function main() {
  const {
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET,
    GEMINI_API_KEY,
  } = process.env as Record<string, string | undefined>;

  if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
    throw new Error('Missing Twitter credentials in .env');
  }
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY in .env');

  const parser = new Parser();
  const results = await Promise.allSettled(FEEDS.map((f) => parser.parseURL(f)));
  const items = results.flatMap((r) => (r.status === 'fulfilled' ? r.value.items : []));
  if (!items.length) throw new Error('No RSS items fetched');
  const sorted = items.sort((a, b) => new Date(b.isoDate || b.pubDate || 0).getTime() - new Date(a.isoDate || a.pubDate || 0).getTime());
  const pick = sorted[0];
  const title = (pick.title || 'Interesting tech update').trim();
  const link = pick.link || '';

  const styleGuide = `
Your writing style: Casual, direct, authentic. You share personal opinions and insights, not generic advice.
Use "I" naturally when sharing your view. Ask questions to engage. Keep it conversational.
1-2 emojis max, only if natural. Avoid corporate buzzwords. Mix insight with personality.
Example tone: "Just tried this new approach. Results? Better than expected. Here's why it matters:"
`;
  const prompt = `You are writing a tweet for a developer who has a casual, authentic voice. 

${styleGuide}

Write a tweet (max 270 chars) about this article. Share YOUR take on why it matters or what caught your attention. Make it feel personal and conversational, not like a news headline. Use 1-2 hashtags naturally (pick from: #webdev #devops #cloud). End with the link.

Article: ${title}
Link: ${link}

Tweet:`;

  console.log('🤖 Generating personalized tweet with Gemini...');
  const gen = await generateTweetWithGemini(prompt, GEMINI_API_KEY);
  const finalText = clamp(gen + (link ? ` ${link}` : ''));
  console.log('\n🐦 Tweet to post:\n', finalText);

  const client = new TwitterApi({
    appKey: TWITTER_API_KEY,
    appSecret: TWITTER_API_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_SECRET,
  });
  const rw = client.readWrite;
  console.log('\n📤 Posting tweet...');
  const tweet = await rw.v2.tweet(finalText);
  console.log('✅ Tweet posted:', `https://twitter.com/user/status/${tweet.data.id}`);
}

main().catch((e) => {
  console.error('❌ Error:', e?.message || e);
  process.exit(1);
});
