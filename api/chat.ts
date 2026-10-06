import { GoogleGenAI } from '@google/genai';
import { solveDoubtOffline } from '../src/utils/stemReasoner';

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

export default async function handler(req: any, res: any) {
  // Set CORS headers for cross-device support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { messages, subject, topic } = req.body || {};
  const lastUserMsg = (messages && Array.isArray(messages) && messages[messages.length - 1]?.content) || 'Class 9 STEM Doubt';

  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      // Answer via NCERT STEM engine so cross-device users get immediate answers without needing Vercel config!
      const text = solveDoubtOffline(lastUserMsg, subject);
      return res.status(200).json({ text });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are "Auzzie AI", an expert, patient, and highly accurate Class 9 STEM tutor specializing in CBSE/NCERT Physics, Chemistry, and Mathematics (New NCERT 2026 Curriculum).
Your goal is to clear student doubts with 100% conceptual clarity and mathematical/scientific correctness:
- For numerical questions, show clean step-by-step working:
  1. Given data with proper symbols and units
  2. Formula applied
  3. Substitution of values
  4. Step-by-step calculation
  5. Final answer highlighted with correct SI units
- For theoretical questions, break explanations down into clear, structured points or bullet points.
- Highlight common exam pitfalls and conceptual confusions.
- FORMULA FORMATTING RULE (CRITICAL):
  Whenever you write any mathematical or scientific formula, write it properly and cleanly in standard, human-readable notation with clear parentheses and operators (for example: \`a = (v - u) / t\`, \`v = u + at\`, \`s = ut + (1/2)at²\`, \`v² - u² = 2as\`, \`F = m × a\`, \`W = F × s\`, \`Ek = (1/2)mv²\`, \`Ep = m × g × h\`, \`P = W / t\`, \`d = √[(x₂ - x₁)² + (y₂ - y₁)²]\`, \`M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)\`, \`A = √[s(s - a)(s - b)(s - c)] where s = (a + b + c) / 2\`, \`aₙ = a + (n - 1)d\`, \`Sₙ = (n / 2)[2a + (n - 1)d]\`).
  Do NOT write raw unrendered LaTeX markup like \\frac{...}{...} or \\cdot; write clean formulas that look clear and proper on any screen.
- Maintain an encouraging, friendly, and respectful student-mentor tone.
${subject ? `Current Context: Subject is Class 9 ${subject}.` : ''}
${topic ? `Current Topic: ${topic}.` : ''}`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let generatedText = '';

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.25,
          },
        });

        if (response && response.text) {
          generatedText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`[Vercel api/chat] Model ${model} note:`, err?.message);
      }
    }

    if (!generatedText) {
      generatedText = solveDoubtOffline(lastUserMsg, subject);
    }

    return res.status(200).json({ text: generatedText });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const text = solveDoubtOffline(lastUserMsg, subject);
    return res.status(200).json({ text });
  }
}
