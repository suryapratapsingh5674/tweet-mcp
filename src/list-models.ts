#!/usr/bin/env node
import dotenv from 'dotenv';
import { listGeminiModels } from './gemini.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY missing in .env');
  process.exit(1);
}

(async () => {
  try {
    const models = await listGeminiModels(apiKey);
    if (!models.length) {
      console.log('No models returned. Try setting GEMINI_API_BASE or check API access.');
      return;
    }
    console.log('Available Gemini models:');
    for (const m of models) console.log(' -', m);
  } catch (e: any) {
    console.error('Error listing models:', e.message || e);
    process.exit(1);
  }
})();
