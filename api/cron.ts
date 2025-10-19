// Vercel Serverless Function: Auto-post every 2 days using Gemini + RSS
import { TwitterApi } from 'twitter-api-v2';

type RssItem = { title?: string; link?: string; pubDate?: string };

const FEEDS = [
  'https://hnrss.org/frontpage',
  'https://www.infoq.com/development/rss/',
  'https://techcrunch.com/tag/devops/feed/',
  'https://aws.amazon.com/blogs/architecture/feed/',
];

async function fetchRss(url: string): Promise<RssItem[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RSS fetch failed ${res.status} ${res.statusText}`);
  const xml = await res.text();
  // Very light XML parsing to avoid extra deps in serverless. Not robust, but works for common feeds.
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml))) {
    const itemXml = match[1];
    const title = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/.exec(itemXml)?.[1] ||
      /<title>(.*?)<\/title>/.exec(itemXml)?.[1] || '';
    const link = /<link>(.*?)<\/link>/.exec(itemXml)?.[1] || '';
    const pubDate = /<pubDate>(.*?)<\/pubDate>/.exec(itemXml)?.[1] || '';
    items.push({ title, link, pubDate });
  }
  return items;
}

async function callGemini(prompt: string, apiKey: string, model: string, base: string) {
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  const urls = [
    `${base}/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
    `${base}/v1/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
  ];
  let lastErr: any;
  for (const url of urls) {
    const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      lastErr = new Error(`Gemini ${resp.status} ${resp.statusText}: ${text}`);
      if (resp.status === 404) continue; // try the next url
      throw lastErr;
    }
    const data: any = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text as string;
  }
  throw lastErr || new Error('Gemini returned no content');
}

function clampTweet(text: string) {
  let t = (text || '').replace(/\s+/g, ' ').trim();
  if (t.length > 280) t = t.slice(0, 277) + '...';
  return t;
}

export default async function handler(req: any, res: any) {
  try {
    const {
      TWITTER_API_KEY,
      TWITTER_API_SECRET,
      TWITTER_ACCESS_TOKEN,
      TWITTER_ACCESS_SECRET,
      GEMINI_API_KEY,
      GEMINI_MODEL = 'gemini-flash-latest',
      GEMINI_API_BASE = 'https://generativelanguage.googleapis.com',
    } = process.env as Record<string, string | undefined>;

    if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
      res.status(500).json({ ok: false, error: 'Missing Twitter credentials' });
      return;
    }
    if (!GEMINI_API_KEY) {
      res.status(500).json({ ok: false, error: 'Missing GEMINI_API_KEY' });
      return;
    }

    // Randomly select topic type
    const topicTypes = ['dev_news', 'programming_fact', 'world_problem'];
    const pickType = topicTypes[Math.floor(Math.random() * topicTypes.length)];
    let prompt = '';
    let link = '';
    if (pickType === 'dev_news') {
      // Development news from RSS
      const lists = await Promise.allSettled(FEEDS.map(fetchRss));
      const items = lists.flatMap(r => r.status === 'fulfilled' ? r.value : []);
      if (!items.length) throw new Error('No RSS items fetched');
      const sorted = items.sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime());
      const pick = sorted[0];
      const title = pick.title?.trim() || 'Interesting tech update';
      link = pick.link || '';
      const styleGuide = `
Your writing style: Casual, direct, authentic. You share personal opinions and insights, not generic advice.
Use "I" naturally when sharing your view. Ask questions to engage. Keep it conversational.
1-2 emojis max, only if natural. Avoid corporate buzzwords. Mix insight with personality.
Example tone: "Just tried this new approach. Results? Better than expected. Here's why it matters:"
`;
      prompt = `You are writing a tweet for a developer who has a casual, authentic voice. 

${styleGuide}

Write a tweet (max 270 chars) about this article. Share YOUR take on why it matters or what caught your attention. Make it feel personal and conversational, not like a news headline. Use 1-2 hashtags naturally (pick from: #webdev #devops #cloud). End with the link.

Article: ${title}
Link: ${link}

Tweet:`;
    } else if (pickType === 'programming_fact') {
      // Programming fact prompt
      prompt = `Share a lesser-known programming fact, tip, or concept. Make it engaging, concise (max 270 chars), and relevant for developers. Use a conversational tone and add 1-2 hashtags if natural.`;
    } else if (pickType === 'world_problem') {
      // World problem prompt
      prompt = `Write a tweet (max 270 chars) highlighting a current world problem (e.g., climate change, digital privacy, AI ethics). Make it insightful, relatable for developers, and encourage positive action or awareness. Use a conversational tone and add 1-2 hashtags if natural.`;
    }

    const gen = await callGemini(prompt, GEMINI_API_KEY, GEMINI_MODEL, GEMINI_API_BASE);
    const finalText = clampTweet(gen + (link ? ` ${link}` : ''));

    // Post to X
    const client = new TwitterApi({
      appKey: TWITTER_API_KEY,
      appSecret: TWITTER_API_SECRET,
      accessToken: TWITTER_ACCESS_TOKEN,
      accessSecret: TWITTER_ACCESS_SECRET,
    });
    const rw = client.readWrite;
    const tweet = await rw.v2.tweet(finalText);

    res.status(200).json({ ok: true, id: tweet.data.id, text: tweet.data.text, link: `https://twitter.com/user/status/${tweet.data.id}` });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
