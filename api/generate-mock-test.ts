import { GoogleGenAI, Type } from '@google/genai';

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { subjectId, chapterTitle, questionCount = 5 } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Generate exactly ${questionCount} high-quality Class 9 STEM multiple choice questions (MCQs) for CBSE/NCERT curriculum (2026 Academic Edition).
Subject: ${subjectId || 'Physics/Chemistry/Math'}
${chapterTitle ? `Focus Chapter: ${chapterTitle}` : 'Comprehensive mix'}

Requirements:
- Questions must be conceptually accurate and aligned strictly with Class 9 NCERT.
- Each question must have exactly 4 options (A, B, C, D).
- Specify the correct option index (0 for A, 1 for B, 2 for C, 3 for D).
- Provide a clear, thorough, step-by-step NCERT explanation for the answer.
- All mathematical and scientific formulas must be in standard clean notation (e.g. \`v = u + at\`, \`Ek = (1/2)mv²\`). Do NOT use raw LaTeX markup.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctOptionIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              difficulty: {
                type: Type.STRING,
                enum: ['easy', 'medium', 'hard'],
              },
            },
            required: ['id', 'question', 'options', 'correctOptionIndex', 'explanation', 'difficulty'],
          },
        },
      },
      required: ['questions'],
    };

    let generatedText = '';
    let lastError: any = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
            temperature: 0.2,
          },
        });

        if (response && response.text) {
          generatedText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!generatedText) {
      throw lastError || new Error('Failed to generate mock test');
    }

    const parsed = JSON.parse(generatedText);
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error in /api/generate-mock-test:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate mock test' });
  }
}
