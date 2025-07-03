// src/utils/genaiClient.ts
import { GoogleGenAI } from '@google/genai';

export const genaiClient = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GENAI_API_KEY,
});
