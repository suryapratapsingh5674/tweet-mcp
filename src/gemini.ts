import fetch from 'node-fetch';

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  promptFeedback?: unknown;
  safetyRatings?: unknown;
};

async function callGeminiOnce(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    let details: any = text;
    try { details = JSON.parse(text); } catch {}
    const info = typeof details === 'string' ? details : JSON.stringify(details);
    const err = new Error(`Gemini API ${response.status} ${response.statusText}: ${info}`) as Error & { status?: number };
    (err as any).status = response.status;
    throw err;
  }
  const data = (await response.json()) as GeminiResponse;
  return data;
}

export async function generateTweetWithGemini(prompt: string, apiKey: string): Promise<string> {
  const preferred = (process.env.GEMINI_MODEL || '').trim();
  const modelCandidates = [
    preferred || undefined,
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro',
  ].filter(Boolean) as string[];

  const base = (process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com').replace(/\/$/, '');
  const body = { contents: [{ parts: [{ text: prompt }] }] };

  let lastErr: any;
  for (const model of modelCandidates) {
    const urls = [
      `${base}/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
      `${base}/v1/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
    ];
    for (const url of urls) {
      try {
        const data = await callGeminiOnce(url, body);
        if (data && Array.isArray(data.candidates) && data.candidates.length > 0) {
          const candidate = data.candidates[0];
          const text = candidate?.content?.parts?.[0]?.text ?? '';
          if (text) return text;
        }
      } catch (e: any) {
        lastErr = e;
        if (e && e.status === 404) {
          continue;
        }
        // If unauthorized or quota etc., stop early
        if (e && (e.status === 401 || e.status === 403)) {
          throw new Error(`Gemini authentication/permission error (${e.status}). Check API key and access.`);
        }
      }
    }
  }
  if (lastErr) {
    throw new Error(`Gemini API error: ${lastErr.message || String(lastErr)}. You can set a working model via GEMINI_MODEL in .env`);
  }
  throw new Error('Gemini API returned no content. Set GEMINI_MODEL to a supported model (e.g., gemini-1.5-flash).');
}

export async function listGeminiModels(apiKey: string): Promise<string[]> {
  const base = (process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com').replace(/\/$/, '');
  const urls = [
    `${base}/v1beta/models?key=${apiKey}`,
    `${base}/v1/models?key=${apiKey}`,
  ];
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        let details: any = text;
        try { details = JSON.parse(text); } catch {}
        const info = typeof details === 'string' ? details : JSON.stringify(details);
        const err = new Error(`Gemini API ${response.status} ${response.statusText}: ${info}`) as Error & { status?: number };
        (err as any).status = response.status;
        throw err;
      }
      const data = await response.json() as any;
      const models = data?.models as Array<{ name: string }> | undefined;
      if (Array.isArray(models)) {
        return models.map(m => m.name);
      }
    } catch (e: any) {
      if (e && e.status === 404) continue;
      throw e;
    }
  }
  return [];
}
